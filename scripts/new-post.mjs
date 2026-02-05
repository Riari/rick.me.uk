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
const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function main() {
    printHeader('New post');

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

        const tagsInput = await question(rl, 'Tags (comma-separated, optional): ');

        rl.close();

        const postDir = path.join(postsDir, slug);
        if (fs.existsSync(postDir)) {
            printError(`Post "${slug}" already exists`);
            return;
        }

        fs.mkdirSync(postDir, { recursive: true });

        const pubDate = getCurrentDate();
        const tagsFormatted = formatTags(tagsInput);

        const frontmatter = `---
title: "${title}"
description: "${description}"
pubDate: ${pubDate}
heroImage: '../../../images/post-headers/pixellated-code.png'
tags: ${tagsFormatted}
---
import ExternalLink from '../../../components/ExternalLink.astro';
import OpenGraphSummary from "../../../components/OpenGraphSummary.astro";
import Image from '../../../components/Image.astro';


`;

        const filePath = path.join(postDir, 'index.mdx');
        fs.writeFileSync(filePath, frontmatter, 'utf-8');

        printSuccess('Post created!', {
            'Location': filePath,
            'Date': pubDate,
        });
    } catch (error) {
        printError(error.message);
        rl.close();
    }
}

main().catch(console.error);
