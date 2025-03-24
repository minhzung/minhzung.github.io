// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

// Post collection schema
const postsCollection = defineCollection({
    type: 'content',
    schema:({ image }) => z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      image: z.union([image(), z.string()]),
      authors: z.array(z.string()).default(["Mindx"]),
      category: z.string().default("others"),
      draft: z.boolean().optional(),
    }),
  });

  // Export collections
export const collections = {
    posts: postsCollection,
  };