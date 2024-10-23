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

export enum ProjectStatus {
    Active = 'Active',
    Complete = 'Complete',
    Archived = 'Archived',
}

export const projectStatuses: string[] = Object.values(ProjectStatus)

const projects = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        status: z.enum((projectStatuses as [string, ...string[]])),
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