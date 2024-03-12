import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.rick.me.uk/',
    integrations: [mdx(), sitemap()],
    markdown: {
        shikiConfig: {
            // Choose from Shiki's built-in themes (or add your own)
            // https://shiki.style/themes
            // theme: 'github-light',
            // Alternatively, provide multiple themes
            // https://shiki.style/guide/dual-themes
            themes: {
                light: 'github-light',
                dark: 'material-theme-palenight',
            },
            defaultColor: 'light',
            // Add custom languages
            // Note: Shiki has countless langs built-in, including .astro!
            // https://shiki.style/languages
            langs: [],
            // Enable word wrap to prevent horizontal scrolling
            wrap: false,
            // Add custom transformers: https://shiki.style/guide/transformers
            // Find common transformers: https://shiki.style/packages/transformers
            transformers: [],
        },
    },
});
