import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        heroImage: image(),
        tags: z.array(z.string()),
    }),
});

export enum ProjectType {
    Game = 'Game',
    Tool = 'Tool',
    Package = 'Package',
    Website = 'Website',
}

export const projectTypes: string[] = Object.values(ProjectType)

const projects = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum((projectTypes as [string, ...string[]])),
        weight: z.number(),
        heroImage: image(),
        url: z.string().url(),
        tags: z.array(z.string()),
    }),
})

export const collections = {
    posts,
    projects
};