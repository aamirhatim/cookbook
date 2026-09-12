#!/usr/bin/env node

/**
 * Script to assign custom claims (e.g. role: 'admin') to a user in Firebase Auth.
 * Works against the local Firebase Auth emulator or production Firebase Auth.
 *
 * Usage:
 *   node scripts/set-admin.mjs <email> [role] [--prod]
 *   npm run set-admin -- <email> [role]
 *   npm run set-admin:prod -- <email> [role]
 *
 * Examples:
 *   node scripts/set-admin.mjs test@example.com admin
 *   node scripts/set-admin.mjs user@example.com admin --prod
 *   npm run set-admin:prod -- user@example.com admin
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const rawArgs = process.argv.slice(2);
const isProdForced = rawArgs.includes('--prod') || rawArgs.includes('--production');
const positionalArgs = rawArgs.filter(arg => !arg.startsWith('--'));

const targetEmail = positionalArgs[0];
const targetRole = positionalArgs[1] || 'admin';
const projectId = process.env.GCLOUD_PROJECT || 'recipe-book-f7e7f';
const authEmulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

if (!targetEmail) {
    console.error('Error: Please provide a user email address.\n');
    console.log('Usage:');
    console.log('  node scripts/set-admin.mjs <email> [role] [--prod]');
    console.log('  npm run set-admin:prod -- <email> [role]\n');
    console.log('Examples:');
    console.log('  node scripts/set-admin.mjs test@example.com admin');
    console.log('  npm run set-admin:prod -- user@example.com admin');
    process.exit(1);
}

function findServiceAccountKey() {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const customPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
        if (fs.existsSync(customPath)) {
            return customPath;
        }
    }

    const defaultCandidates = [
        path.join(projectRoot, 'service-account.json'),
        path.join(process.cwd(), 'service-account.json')
    ];

    for (const candidate of defaultCandidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    try {
        const files = fs.readdirSync(projectRoot);
        const match = files.find(f => (f.includes('service-account') || f.includes('serviceAccountKey')) && f.endsWith('.json'));
        if (match) {
            return path.join(projectRoot, match);
        }
    } catch {
        // ignore
    }

    return null;
}

async function isEmulatorRunning() {
    try {
        const res = await fetch(`http://${authEmulatorHost}/`);
        const data = await res.json();
        return Boolean(data?.authEmulator?.ready);
    } catch {
        return false;
    }
}

async function setRoleInEmulator(email, role) {
    console.log(`Connecting to Auth Emulator at http://${authEmulatorHost}...`);

    // 1. Lookup user by email
    const lookupRes = await fetch(
        `http://${authEmulatorHost}/identitytoolkit.googleapis.com/v1/accounts:lookup?key=fake-api-key`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer owner'
            },
            body: JSON.stringify({ email: [email] })
        }
    );

    if (!lookupRes.ok) {
        throw new Error(`Failed to lookup user: ${lookupRes.status} ${await lookupRes.text()}`);
    }

    const lookupData = await lookupRes.json();
    const user = lookupData.users?.[0];

    if (!user) {
        throw new Error(`User with email "${email}" not found in Auth Emulator.`);
    }

    console.log(`Found emulator user: ${email} (UID: ${user.localId})`);

    // 2. Update customAttributes
    const updateRes = await fetch(
        `http://${authEmulatorHost}/identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update?key=fake-api-key`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer owner'
            },
            body: JSON.stringify({
                localId: user.localId,
                customAttributes: JSON.stringify({ role })
            })
        }
    );

    if (!updateRes.ok) {
        throw new Error(`Failed to set role: ${updateRes.status} ${await updateRes.text()}`);
    }

    console.log(`\nSuccessfully updated emulator custom claims for ${email}:`);
    console.log(`   UID:  ${user.localId}`);
    console.log(`   Role: ${role}`);
    console.log(`\n(Note: If the user is currently signed in, sign out and sign back in to refresh their session token.)\n`);
}

async function setRoleInProduction(email, role) {
    console.log(`Targeting production project: ${projectId}`);

    try {
        const { initializeApp, cert, getApps } = await import('firebase-admin/app');
        const { getAuth } = await import('firebase-admin/auth');

        if (getApps().length === 0) {
            const keyPath = findServiceAccountKey();
            if (keyPath) {
                const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
                initializeApp({
                    credential: cert(serviceAccount),
                    projectId: serviceAccount.project_id || projectId
                });
                console.log(`Loaded service account key: ${path.basename(keyPath)}`);
            } else {
                console.log('No service-account.json found. Attempting Application Default Credentials...');
                initializeApp({
                    projectId
                });
            }
        }

        const auth = getAuth();
        const user = await auth.getUserByEmail(email);
        await auth.setCustomUserClaims(user.uid, { role });

        console.log(`\nSuccessfully updated production custom claims:`);
        console.log(`   Email: ${email}`);
        console.log(`   UID:   ${user.uid}`);
        console.log(`   Role:  ${role}`);
        console.log(`\n(Note: If the user is currently signed in, sign out and sign back in to refresh their session token.)\n`);
    } catch (err) {
        console.error('\nProduction update failed:', err.message);

        if (err.code === 'auth/user-not-found') {
            console.error(`\nUser "${email}" does not exist in production Firebase Auth.`);
            console.error('The user must sign up or be created in the production project before assigning claims.');
        } else if (err.code === 'app/invalid-credential' || err.message?.includes('credential')) {
            console.log('\nService account credential missing or invalid.');
            console.log('To set up production credentials:');
            console.log(`1. Go to https://console.firebase.google.com/project/${projectId}/settings/serviceaccounts/adminsdk`);
            console.log('2. Click "Generate new private key".');
            console.log('3. Save the file as "service-account.json" in the project root directory.');
        }

        process.exit(1);
    }
}

async function main() {
    if (isProdForced) {
        console.log('Mode: PRODUCTION (forced via --prod flag)');
        await setRoleInProduction(targetEmail, targetRole);
        return;
    }

    const emulatorActive = await isEmulatorRunning();
    if (emulatorActive) {
        console.log('Mode: EMULATOR (Auth Emulator detected)');
        console.log('(Tip: To target production instead, add the --prod flag or run "npm run set-admin:prod")\n');
        await setRoleInEmulator(targetEmail, targetRole);
    } else {
        console.log('Mode: PRODUCTION (Auth Emulator not detected)\n');
        await setRoleInProduction(targetEmail, targetRole);
    }
}

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
