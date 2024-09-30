import { defineCollection, z } from 'astro:content';
import type { string } from 'astro:schema';

const posts = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string(),
        tags: z.array(z.string()),
	}),
});

export enum ProjectStatus {
    Active = 'Active',
    Complete = 'Complete',
    Archived = 'Archived',
}

export const projectStatuses: string[] = Object.values(ProjectStatus)

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        status: z.enum((projectStatuses as [string, ...string[]])),
		weight: z.number(),
		heroImage: z.string(),
        url: z.string().url(),
        tags: z.array(z.string()),
    }),
})

export const collections = {
    posts,
    projects
};