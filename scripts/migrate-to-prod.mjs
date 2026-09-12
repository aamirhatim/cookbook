#!/usr/bin/env node

/**
 * Migration Script: Emulator Data -> Production Firebase
 * 
 * Migrates:
 * 1. Storage emulator files (blobs + metadata) -> Production Cloud Storage
 * 2. Firestore recipes collection -> Production Cloud Firestore (with updated production imageUrls)
 * 
 * Explicitly skips auth user profiles (users collection).
 * 
 * Usage:
 *   npm run migrate:prod
 *   node scripts/migrate-to-prod.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const JAVA_HOME =
    process.env.JAVA_HOME ||
    '/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home';

const projectId = process.env.GCLOUD_PROJECT || 'recipe-book-f7e7f';
const storageBucketName = 'recipe-book-f7e7f.firebasestorage.app';
const firestoreEmulatorPort = 8080;
const firestoreBaseUrl = `http://127.0.0.1:${firestoreEmulatorPort}/v1/projects/${projectId}/databases/(default)/documents`;

function getServiceAccount() {
    const keyPath = path.join(projectRoot, 'service-account.json');
    if (fs.existsSync(keyPath)) {
        return JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
        return JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
    }
    throw new Error(
        'Missing service-account.json in project root.\n' +
        `Please download your service account key from https://console.firebase.google.com/project/${projectId}/settings/serviceaccounts/adminsdk`
    );
}

async function isFirestoreEmulatorRunning() {
    try {
        const res = await fetch(`http://127.0.0.1:${firestoreEmulatorPort}/`);
        return res.ok;
    } catch {
        return false;
    }
}

async function startFirestoreEmulator() {
    console.log('Firestore emulator is not running. Starting local emulator to read data...');
    const child = spawn(
        'firebase',
        ['emulators:start', '--only', 'firestore', '--import=./emulator-data'],
        {
            cwd: projectRoot,
            env: {
                ...process.env,
                JAVA_HOME
            },
            stdio: ['ignore', 'pipe', 'pipe']
        }
    );

    const startTime = Date.now();
    while (Date.now() - startTime < 30000) {
        if (await isFirestoreEmulatorRunning()) {
            console.log('Local Firestore emulator is ready.\n');
            return child;
        }
        await new Promise((r) => setTimeout(r, 1000));
    }

    child.kill();
    throw new Error('Timed out waiting for Firestore emulator to start.');
}

async function migrateStorage(bucket) {
    const storageExportDir = path.join(projectRoot, 'emulator-data', 'storage_export');
    const metadataDir = path.join(storageExportDir, 'metadata');
    const blobsDir = path.join(storageExportDir, 'blobs');

    if (!fs.existsSync(metadataDir) || !fs.existsSync(blobsDir)) {
        console.log('No emulator storage export directory found. Skipping storage migration.');
        return new Map();
    }

    const metadataFiles = fs.readdirSync(metadataDir).filter((f) => f.endsWith('.json'));
    console.log(`Found ${metadataFiles.length} storage files to migrate in emulator-data/storage_export/...\n`);

    const storagePathToProdUrl = new Map();
    let uploadedCount = 0;

    for (let i = 0; i < metadataFiles.length; i++) {
        const metaFilename = metadataFiles[i];
        const blobFilename = metaFilename.replace(/\.json$/, '');
        const metaPath = path.join(metadataDir, metaFilename);
        const blobPath = path.join(blobsDir, blobFilename);

        if (!fs.existsSync(blobPath)) {
            console.warn(`Warning: Blob file missing for ${metaFilename}, skipping.`);
            continue;
        }

        const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        const filePath = metadata.name;
        const contentType = metadata.contentType || 'image/jpeg';
        const token = metadata.downloadTokens?.[0] || crypto.randomUUID();
        const blobBuffer = fs.readFileSync(blobPath);

        const file = bucket.file(filePath);
        await file.save(blobBuffer, {
            resumable: false,
            metadata: {
                contentType,
                metadata: {
                    firebaseStorageDownloadTokens: token
                }
            }
        });

        const encodedPath = encodeURIComponent(filePath);
        const prodUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;

        storagePathToProdUrl.set(filePath, prodUrl);
        uploadedCount++;
        console.log(`  [${uploadedCount}/${metadataFiles.length}] Uploaded: ${filePath}`);
    }

    console.log(`\nSuccessfully uploaded ${uploadedCount} files to Firebase Storage bucket (${bucket.name}).\n`);
    return storagePathToProdUrl;
}

function decodeFirestoreValue(val) {
    if (!val || typeof val !== 'object') return null;
    if ('stringValue' in val) return val.stringValue;
    if ('booleanValue' in val) return val.booleanValue;
    if ('integerValue' in val) return parseInt(val.integerValue, 10);
    if ('doubleValue' in val) return val.doubleValue;
    if ('timestampValue' in val) return new Date(val.timestampValue);
    if ('nullValue' in val) return null;
    if ('arrayValue' in val) {
        return (val.arrayValue.values || []).map(decodeFirestoreValue);
    }
    if ('mapValue' in val) {
        const fields = val.mapValue.fields || {};
        const result = {};
        for (const [k, v] of Object.entries(fields)) {
            result[k] = decodeFirestoreValue(v);
        }
        return result;
    }
    return null;
}

function decodeFirestoreDocument(doc) {
    const fields = doc.fields || {};
    const result = {};
    for (const [k, v] of Object.entries(fields)) {
        result[k] = decodeFirestoreValue(v);
    }
    return result;
}

async function migrateFirestoreRecipes(db, storagePathToProdUrl) {
    console.log(`Fetching recipes from Firestore emulator (http://127.0.0.1:${firestoreEmulatorPort})...`);

    const res = await fetch(`${firestoreBaseUrl}/recipes?pageSize=300`, {
        headers: { 'Authorization': 'Bearer owner' }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch recipes from emulator: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    const documents = data.documents || [];
    console.log(`Found ${documents.length} recipes in emulator Firestore.\n`);

    let migratedCount = 0;

    for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const docId = doc.name.split('/').pop();
        const recipe = decodeFirestoreDocument(doc);

        // Update imageUrl to production URL
        if (recipe.imageStoragePath && storagePathToProdUrl.has(recipe.imageStoragePath)) {
            recipe.imageUrl = storagePathToProdUrl.get(recipe.imageStoragePath);
        } else if (typeof recipe.imageUrl === 'string' && recipe.imageUrl.includes(':9199/')) {
            recipe.imageUrl = recipe.imageUrl.replace(
                /http:\/\/127\.0\.0\.1:9199\/v0\/b\/[^/]+\/o\//,
                `https://firebasestorage.googleapis.com/v0/b/${storageBucketName}/o/`
            );
        }

        await db.collection('recipes').doc(docId).set(recipe);
        migratedCount++;
        console.log(`  [${migratedCount}/${documents.length}] Migrated: "${recipe.title || 'Untitled'}" (${docId})`);
    }

    console.log(`\nSuccessfully migrated ${migratedCount} recipes to production Cloud Firestore.\n`);
}

async function main() {
    console.log('=== Firebase Emulator -> Production Migration ===');
    console.log(`Target Project: ${projectId}`);
    console.log(`Storage Bucket: ${storageBucketName}`);
    console.log('Skipping user profiles / auth records as requested.\n');

    const serviceAccount = getServiceAccount();
    const app = initializeApp({
        credential: cert(serviceAccount),
        projectId,
        storageBucket: storageBucketName
    });

    const db = getFirestore(app);
    const bucket = getStorage(app).bucket();

    // 1. Migrate Storage
    console.log('--- Step 1: Migrating Storage Blobs ---');
    const storageMap = await migrateStorage(bucket);

    // 2. Ensure Firestore Emulator is available
    console.log('--- Step 2: Migrating Firestore Recipes ---');
    let spawnedEmulator = null;
    try {
        const isRunning = await isFirestoreEmulatorRunning();
        if (!isRunning) {
            spawnedEmulator = await startFirestoreEmulator();
        } else {
            console.log('Connected to existing running Firestore emulator.');
        }

        await migrateFirestoreRecipes(db, storageMap);
    } finally {
        if (spawnedEmulator) {
            console.log('Cleaning up temporary Firestore emulator...');
            spawnedEmulator.kill('SIGTERM');
        }
    }

    console.log('=== Migration Complete! ===');
    console.log('All recipes and photos are now live in your production Firebase database.');
}

main().catch((err) => {
    console.error('\nMigration failed:', err);
    process.exit(1);
});
