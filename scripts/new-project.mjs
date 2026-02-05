#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    colors,
    createInterface,
    question,
    printHeader,
    printSuccess,
    printError,
    generateSlug,
    formatTags,
} from './utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, '..', 'src', 'content', 'projects');

async function getNextWeight() {
    try {
        const entries = await fs.readdir(projectsDir, { withFileTypes: true });
        let maxWeight = 0;
        
        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            
            const projectPath = path.join(projectsDir, entry.name, 'index.mdx');
            
            try {
                const content = await fs.readFile(projectPath, 'utf-8');
                const weightMatch = content.match(/^weight:\s*(\d+)/m);
                
                if (weightMatch) {
                    const weight = parseInt(weightMatch[1]);
                    if (weight > maxWeight) {
                        maxWeight = weight;
                    }
                }
            } catch {
                // Skip if can't read file
            }
        }
        
        return maxWeight + 10;
    } catch {
        return 10; // Default if directory doesn't exist or is empty
    }
}

async function main() {
    printHeader('New project');

    const rl = createInterface();

    try {
        const title = await question(rl, 'Title: ');
        if (!title.trim()) {
            printError('Title is required');
            rl.close();
            return;
        }

        const defaultSlug = generateSlug(title);
        const slugInput = await question(rl, `Slug (${colors.blue}${defaultSlug}${colors.reset}${colors.yellow}): `);
        const slug = slugInput.trim() || defaultSlug;

        const description = await question(rl, 'Description: ');
        if (!description.trim()) {
            printError('Description is required');
            rl.close();
            return;
        }

        console.log(`\n${colors.bright}Project types:${colors.reset}`);
        console.log(`  ${colors.green}1${colors.reset} - Game`);
        console.log(`  ${colors.green}2${colors.reset} - Tool`);
        console.log(`  ${colors.green}3${colors.reset} - Package`);
        console.log(`  ${colors.green}4${colors.reset} - Website\n`);

        const typeChoice = await question(rl, 'Select type (1-4): ');
        const types = ['Game', 'Tool', 'Package', 'Website'];
        const typeIndex = parseInt(typeChoice) - 1;

        if (typeIndex < 0 || typeIndex >= types.length) {
            printError('Invalid type selection');
            rl.close();
            return;
        }

        const type = types[typeIndex];

        const url = await question(rl, 'Project URL: ');
        if (!url.trim()) {
            printError('URL is required');
            rl.close();
            return;
        }

        try {
            new URL(url);
        } catch {
            printError('Invalid URL format');
            rl.close();
            return;
        }

        const tagsInput = await question(rl, 'Tags (comma-separated, optional): ');

        rl.close();

        const projectDir = path.join(projectsDir, slug);
        if (fs.existsSync(projectDir)) {
            printError(`Project "${slug}" already exists`);
            return;
        }
        
        fs.mkdirSync(projectDir, { recursive: true });
        
        const weight = await getNextWeight();
        const tagsFormatted = formatTags(tagsInput);

        const frontmatter = `---
title: "${title}"
description: "${description}"
type: "${type}"
weight: ${weight}
heroImage: "../../../images/project-headers/personal-site.png"
url: "${url}"
tags: ${tagsFormatted}
---
import ExternalLink from '../../../components/ExternalLink.astro';
import OpenGraphSummary from "../../../components/OpenGraphSummary.astro";
import Image from '../../../components/Image.astro';

`;

        const filePath = path.join(projectDir, 'index.mdx');
        fs.writeFileSync(filePath, frontmatter, 'utf-8');

        printSuccess('Project created!', {
            'Location': filePath,
            'Type': type,
            'Weight': weight,
        });
    } catch (error) {
        printError(error.message);
        rl.close();
    }
}

main().catch(console.error);
