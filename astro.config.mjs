import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.rick.me.uk/',
    integrations: [mdx(), sitemap(), robotsTxt()],
    markdown: {
        // https://shiki.style/
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'material-theme-palenight',
            },
            defaultColor: 'light',
            wrap: false,
        },
    },
});
