const { z } = require('zod');

const bookSchema = z.object({
  title: z.string().trim().min(1).max(120),
  author: z.string().trim().min(1).max(100),
  tags: z.array(z.string().trim()).max(5).optional(),
  published_year: z.number().int().min(1500).max(new Date().getFullYear()).optional()
});

const listBooksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'title', 'author']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  author: z.string().trim().optional()
});

const titleSchema = z.object({
  q: z.string().trim().min(1).max(120)
});

module.exports = { bookSchema, listBooksQuerySchema, titleSchema};