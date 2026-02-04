import fs from 'node:fs/promises';

/**
 * Parses frontmatter from MDX content
 * @param {string} content - The full MDX file content
 * @returns {{ frontmatter: Record<string, any>, content: string, raw: string }}
 */
export function parseFrontmatter(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: {}, content, raw: '' };
    }
    
    const raw = match[1];
    const frontmatter = {};

    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
        const keyValueMatch = line.match(/^(\w+):\s*(.+)$/);
        if (keyValueMatch) {
            const [, key, value] = keyValueMatch;

            if (value.startsWith('"') && value.endsWith('"')) {
                // String
                frontmatter[key] = value.slice(1, -1);
            } else if (value.startsWith('[') && value.endsWith(']')) {
                // Array
                frontmatter[key] = value;
            } else if (!isNaN(value)) {
                // Number
                frontmatter[key] = Number(value);
            } else {
                // Other (keep as string)
                frontmatter[key] = value;
            }
        }
    }
    
    return {
        frontmatter,
        content: content.slice(match[0].length),
        raw
    };
}

/**
 * Updates frontmatter fields in MDX content
 * @param {string} content - The full MDX file content
 * @param {Record<string, any>} updates - Fields to update
 * @returns {string} Updated MDX content
 */
export function updateFrontmatter(content, updates) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        throw new Error('No frontmatter found in content');
    }
    
    let frontmatterContent = match[1];
    
    // Update each field
    for (const [key, value] of Object.entries(updates)) {
        const fieldRegex = new RegExp(`^(${key}:)\\s*(.+)$`, 'm');
        const fieldMatch = frontmatterContent.match(fieldRegex);
        
        if (fieldMatch) {
            // Replace existing field
            const newValue = typeof value === 'string' && !value.startsWith('"') && !value.startsWith('[')
                ? `"${value}"`
                : value;
            frontmatterContent = frontmatterContent.replace(
                fieldRegex,
                `$1 ${newValue}`
            );
        } else {
            // Add new field at the end
            const newValue = typeof value === 'string' && !value.startsWith('"') && !value.startsWith('[')
                ? `"${value}"`
                : value;
            frontmatterContent += `\n${key}: ${newValue}`;
        }
    }
    
    return content.replace(frontmatterRegex, `---\n${frontmatterContent}\n---`);
}

/**
 * Safely writes content to a file using atomic write
 * @param {string} filePath - Path to the file
 * @param {string} content - Content to write
 */
export async function safeWriteFile(filePath, content) {
    const tempPath = `${filePath}.tmp`;
    
    try {
        await fs.writeFile(tempPath, content, 'utf-8');
        await fs.rename(tempPath, filePath);
    } catch (error) {
        try {
            await fs.unlink(tempPath);
        } catch {}
        throw error;
    }
}
