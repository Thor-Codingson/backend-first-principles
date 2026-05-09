const { z } = require('zod');

const bookSchema = z.object({
  title: z.string().trim().min(1).max(120),
  author: z.string().trim().min(1).max(100),
  tags: z.array(z.string().trim()).max(5).optional(),
  published_year: z.number().int().min(1500).max(new Date().getFullYear()).optional()
});

module.exports = bookSchema