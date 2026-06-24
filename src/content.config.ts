import { defineCollection } from 'astro:content';
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        headerImage: image(),
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
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum((projectTypes as [string, ...string[]])),
        weight: z.number(),
        headerImage: image(),
        url: z.string().url(),
        tags: z.array(z.string()),
    }),
})

export const collections = {
    posts,
    projects
};