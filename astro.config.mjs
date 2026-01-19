import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import astroExpressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.rick.me.uk/',
    redirects: {
        "/posts/2026/01/devlog-flecs-city-part-3-network-messages-and-replication/": "/posts/2026/01/devlog-flecs-city-part-3-ecs-replication"
    },
    integrations: [sitemap(), robotsTxt(), astroExpressiveCode({
        themes: ['material-theme-palenight', 'github-light'],
        styleOverrides: {
            codeFontFamily: 'JetBrains Mono, monospace',
            codeFontSize: '1em',
            frames: {
                shadowColor: 'none'
            },
            uiFontFamily: 'SourceSans 3, sans-serif',
            uiFontSize: '.8em',
        },
        themeCssSelector: (theme) => {
            let siteTheme = '';
            switch (theme.name) {
                case 'material-theme-palenight':
                    siteTheme = 'dark'
                    break;
                case 'github-light':
                    siteTheme = 'light';
                    break;
            }

            return `[data-theme='${siteTheme}']`;
        }
    }),
    mdx()],
    image: {
        remotePatterns: [{ protocol: "https" }],
    }
});