import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { parseFrontmatter, updateFrontmatter, safeWriteFile } from './frontmatter-utils.mjs';

export default function projectWeightManager() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const projectsDir = path.join(__dirname, '..', 'src', 'content', 'projects');
    
    return {
        name: 'project-weight-manager',
        hooks: {
            'astro:config:setup': ({ addDevToolbarApp }) => {
                addDevToolbarApp({
                    id: 'project-weight-manager',
                    name: 'Project Weights',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7.55228 5 8 5.44772 8 6V15.5858L10.2929 13.2929C10.6834 12.9024 11.3166 12.9024 11.7071 13.2929C12.0976 13.6834 12.0976 14.3166 11.7071 14.7071L7.70711 18.7071C7.31658 19.0976 6.68342 19.0976 6.29289 18.7071L2.29289 14.7071C1.90237 14.3166 1.90237 13.6834 2.29289 13.2929C2.68342 12.9024 3.31658 12.9024 3.70711 13.2929L6 15.5858V6C6 5.44772 6.44772 5 7 5ZM16.2929 5.29289C16.6834 4.90237 17.3166 4.90237 17.7071 5.29289L21.7071 9.29289C22.0976 9.68342 22.0976 10.3166 21.7071 10.7071C21.3166 11.0976 20.6834 11.0976 20.2929 10.7071L18 8.41421V18C18 18.5523 17.5523 19 17 19C16.4477 19 16 18.5523 16 18V8.41421L13.7071 10.7071C13.3166 11.0976 12.6834 11.0976 12.2929 10.7071C11.9024 10.3166 11.9024 9.68342 12.2929 9.29289L16.2929 5.29289Z" />
                    </svg>`,
                    entrypoint: './integrations/project-weight-app.js',
                });
            },
            
            'astro:server:setup': ({ toolbar }) => {
                toolbar.on('get-projects', async () => {
                    const projects = await getProjectsWithWeights(projectsDir);
                    toolbar.send('projects-data', { projects });
                });

                toolbar.on('update-weight', async (data) => {
                    const { projectSlug, newWeight } = data;
                    await updateProjectWeight(projectsDir, projectSlug, newWeight);
                    toolbar.send('weight-updated', { success: true, projectSlug, newWeight });

                    const projects = await getProjectsWithWeights(projectsDir);
                    toolbar.send('projects-data', { projects });
                });
                
                toolbar.on('redistribute-weights', async () => {
                    await redistributeWeights(projectsDir);
                    toolbar.send('redistribute-weights-complete', { success: true });

                    const projects = await getProjectsWithWeights(projectsDir);
                    toolbar.send('projects-data', { projects });
                });
            },
        },
    };
}

async function getProjectsWithWeights(projectsDir) {
    const entries = await fs.readdir(projectsDir, { withFileTypes: true });
    const projects = [];
    
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        
        const projectPath = path.join(projectsDir, entry.name, 'index.mdx');
        
        try {
            const content = await fs.readFile(projectPath, 'utf-8');
            const { frontmatter } = parseFrontmatter(content);
            
            projects.push({
                slug: entry.name,
                title: frontmatter.title || entry.name,
                weight: frontmatter.weight || 0,
                type: frontmatter.type || 'Unknown',
                path: projectPath,
            });
        } catch (error) {
            console.warn(`Could not read project: ${entry.name}`, error);
        }
    }
    
    return projects.sort((a, b) => a.weight - b.weight);
}

async function updateProjectWeight(projectsDir, projectSlug, newWeight) {
    const projectPath = path.join(projectsDir, projectSlug, 'index.mdx');
    const content = await fs.readFile(projectPath, 'utf-8');
    const updatedContent = updateFrontmatter(content, { weight: newWeight });
    await safeWriteFile(projectPath, updatedContent);
}

async function redistributeWeights(projectsDir) {
    const projects = await getProjectsWithWeights(projectsDir);

    for (let i = 0; i < projects.length; i++) {
        const newWeight = (i + 1) * 10;
        await updateProjectWeight(projectsDir, projects[i].slug, newWeight);
    }
}
