import { spawn } from 'node:child_process';
import process from 'node:process';

const JAVA_HOME =
    process.env.JAVA_HOME ||
    '/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home';

const yellow = (text) => `\x1b[33;1m${text}\x1b[0m`;
const cyan = (text) => `\x1b[36;1m${text}\x1b[0m`;

function pipeOutput(stream, prefix, out) {
    let buffer = '';
    stream.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
            out.write(`${prefix} ${line}\n`);
        }
    });
    stream.on('end', () => {
        if (buffer) {
            out.write(`${prefix} ${buffer}\n`);
        }
    });
}

// Spawn Firebase emulators
const firebase = spawn(
    'firebase',
    [
        'emulators:start',
        '--import=./emulator-data',
        '--export-on-exit=./emulator-data',
    ],
    {
        env: {
            ...process.env,
            JAVA_HOME,
        },
        stdio: ['inherit', 'pipe', 'pipe'],
    }
);

pipeOutput(firebase.stdout, yellow('[firebase]'), process.stdout);
pipeOutput(firebase.stderr, yellow('[firebase]'), process.stderr);

// Spawn Vite
const vite = spawn('npx', ['vite'], {
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
});

pipeOutput(vite.stdout, cyan('[vite]'), process.stdout);
pipeOutput(vite.stderr, cyan('[vite]'), process.stderr);

let isShuttingDown = false;

function shutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;

    // Kill Vite
    if (vite && !vite.killed) {
        vite.kill('SIGTERM');
    }

    // Send single SIGINT to Firebase so it triggers clean export-on-exit
    if (firebase && !firebase.killed) {
        firebase.kill('SIGINT');
    }
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());

firebase.on('exit', (code) => {
    if (vite && !vite.killed) {
        vite.kill('SIGTERM');
    }
    process.exit(code ?? 0);
});

vite.on('exit', (code) => {
    if (!isShuttingDown) {
        shutdown();
    }
});

