import readline from 'node:readline';

export const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
};

export function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

export function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(`${colors.yellow}${prompt}${colors.reset}`, resolve);
    });
}

export function printHeader(title) {
    console.clear();
    process.stdout.write(`${colors.bright}${colors.cyan}`);
    process.stdout.write('╔');
    for (let i = 0; i < title.length + 2; i++) process.stdout.write('=');
    process.stdout.write('╗\n');
    process.stdout.write(`║ ${title} ║\n`)
    process.stdout.write('╚');
    for (let i = 0; i < title.length + 2; i++) process.stdout.write('=');
    process.stdout.write('╝');
    process.stdout.write(`${colors.reset}\n\n`);
}

export function printSuccess(message, details = {}) {
    console.log(`\n${colors.green}✓ ${message}${colors.reset}`);
    for (const [key, value] of Object.entries(details)) {
        console.log(`${colors.blue}${key}: ${value}${colors.reset}`);
    }
    console.log();
}

export function printError(message) {
    console.log(`${colors.red}Error: ${message}${colors.reset}`);
}

export function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export function formatTags(tagsInput) {
    const tags = tagsInput
        ? tagsInput.split(',').map(t => t.trim()).filter(t => t)
        : [];
    
    return tags.length > 0
        ? `[${tags.map(t => `"${t}"`).join(', ')}]`
        : '[]';
}
