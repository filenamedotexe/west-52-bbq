import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// West 52 BBQ - Content Collections Configuration

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),
      canonical: z.string().url().optional(),
      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),
      description: z.string().optional(),
      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

// Blog Posts Collection (renamed from 'post')
const blogCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/blog' }),
  schema: z.object({
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Troy Johnson'),
    readingTime: z.number().optional(),
    featured: z.boolean().default(false),
    metadata: metadataDefinition(),
  }),
});

// Menu Items Collection
const menuCollection = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: 'src/data/menu' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    category: z.enum(['smoked-meats', 'sandwiches', 'sides', 'desserts', 'beverages', 'combo-platters']),
    image: z.string(),
    active: z.boolean().default(true),
    dietaryTags: z.array(z.enum([
      'gluten-free',
      'dairy-free',
      'vegan',
      'vegetarian',
      'keto',
      'low-carb',
      'nut-free'
    ])).default([]),
    spicyLevel: z.number().min(0).max(5).optional(),
    calories: z.number().positive().optional(),
    featured: z.boolean().default(false),
    availability: z.enum(['always', 'lunch-only', 'dinner-only', 'seasonal']).default('always'),
    allergens: z.array(z.string()).optional(),
    prepTime: z.number().positive().optional(),
    servingSize: z.string().optional(),
  }),
});

// Local Landing Pages Collection (SEO)
const locationsCollection = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/locations' }),
  schema: z.object({
    city: z.string(),
    state: z.string().length(2),
    zipCode: z.string(),
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    h1: z.string(),
    featured: z.boolean().default(false),
    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: blogCollection,  // Keep 'post' for backward compatibility with template
  blog: blogCollection,  // Also export as 'blog' for clarity
  menu: menuCollection,
  locations: locationsCollection,
};
