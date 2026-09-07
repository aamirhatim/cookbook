#!/usr/bin/env node

/**
 * Script to assign custom claims (e.g. role: 'admin') to a user in Firebase Auth.
 * Works automatically against the local Firebase Auth emulator, or against production
 * if GOOGLE_APPLICATION_CREDENTIALS / service account is configured.
 * 
 * Usage:
 *   node scripts/set-admin.mjs <email> [role]
 * 
 * Examples:
 *   node scripts/set-admin.mjs test@example.com admin
 *   node scripts/set-admin.mjs user@example.com user
 */

const targetEmail = process.argv[2];
const targetRole = process.argv[3] || 'admin';
const projectId = process.env.GCLOUD_PROJECT || 'recipe-book-f7e7f';
const authEmulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

if (!targetEmail) {
    console.error('Error: Please provide a user email address.');
    console.log('Usage: node scripts/set-admin.mjs <email> [role]');
    process.exit(1);
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

    console.log(`Found user: ${email} (UID: ${user.localId})`);

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

    console.log(`\nSuccessfully updated custom claims for ${email}:`);
    console.log(`   UID:  ${user.localId}`);
    console.log(`   Role: ${role}`);
    console.log(`\n(Note: If the user is currently signed in, sign out and sign back in to refresh their session token.)\n`);
}

async function setRoleInProduction(email, role) {
    try {
        const admin = (await import('firebase-admin')).default;
        if (!admin.apps.length) {
            admin.initializeApp();
        }
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { role });
        console.log(`Successfully updated production custom claims for ${email} (UID: ${user.uid}) -> role: ${role}`);
    } catch (err) {
        console.error('Production update failed:', err.message);
        console.log('\nTo update production, ensure GOOGLE_APPLICATION_CREDENTIALS points to your service account key.');
        process.exit(1);
    }
}

async function main() {
    const emulatorActive = await isEmulatorRunning();
    if (emulatorActive) {
        await setRoleInEmulator(targetEmail, targetRole);
    } else {
        console.log('Auth Emulator not detected. Attempting to use Firebase Admin SDK for production...');
        await setRoleInProduction(targetEmail, targetRole);
    }
}

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
