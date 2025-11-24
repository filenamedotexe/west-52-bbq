import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeQuotes(str: string): string {
  // First escape backslashes, then escape quotes to avoid double-escaping
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function generateMarkdownContent(data: any, body: string = ''): string {
  // Parse and validate numeric values
  const price = parseFloat(data.price);
  const spicyLevel = data.spicyLevel !== undefined && data.spicyLevel !== null
    ? parseInt(data.spicyLevel)
    : null;
  const calories = data.calories !== undefined && data.calories !== null
    ? parseInt(data.calories)
    : null;
  const prepTime = data.prepTime !== undefined && data.prepTime !== null
    ? parseInt(data.prepTime)
    : null;

  const frontmatter = [
    '---',
    `name: "${escapeQuotes(data.name)}"`,
    `description: "${escapeQuotes(data.description)}"`,
    `price: ${price}`,
    `category: "${data.category}"`,
    `image: "${data.image}"`,
    `active: ${data.active === true || data.active === 'true'}`,
    data.dietaryTags && data.dietaryTags.length > 0
      ? `dietaryTags: [${data.dietaryTags.map((t: string) => `"${escapeQuotes(t)}"`).join(', ')}]`
      : 'dietaryTags: []',
    spicyLevel !== null ? `spicyLevel: ${spicyLevel}` : null,
    calories !== null ? `calories: ${calories}` : null,
    `featured: ${data.featured === true || data.featured === 'true'}`,
    `availability: "${data.availability || 'always'}"`,
    data.allergens && data.allergens.length > 0
      ? `allergens: [${data.allergens.map((a: string) => `"${escapeQuotes(a)}"`).join(', ')}]`
      : null,
    prepTime !== null ? `prepTime: ${prepTime}` : null,
    data.servingSize ? `servingSize: "${escapeQuotes(data.servingSize)}"` : null,
    '---',
  ].filter(Boolean).join('\n');

  return body ? `${frontmatter}\n\n${body}` : frontmatter;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.category || !data.image) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate slug from name if not provided
    const slug = data.slug || generateSlug(data.name);

    // Build new file path
    const category = data.category;
    const fileName = `${slug}.md`;
    const filePath = path.join(process.cwd(), 'src', 'data', 'menu', category, fileName);

    // If updating an existing item, check if we need to delete the old file
    // (e.g., if category changed or it's an update to an existing item)
    if (data.id) {
      const oldFilePath = path.join(process.cwd(), 'src', 'data', 'menu', `${data.id}.md`);
      const newId = `${category}/${slug}`;

      // Only delete if the path changed (different category or different slug)
      if (data.id !== newId) {
        try {
          await fs.access(oldFilePath);
          await fs.unlink(oldFilePath);
        } catch {
          // Old file doesn't exist, that's okay
        }
      }
    }

    // Ensure category directory exists
    const categoryDir = path.dirname(filePath);
    await fs.mkdir(categoryDir, { recursive: true });

    // Check if file already exists (for new items)
    const exists = await fs.access(filePath).then(() => true).catch(() => false);

    // Generate markdown content
    const content = generateMarkdownContent(data, data.body || '');

    // Write the file
    await fs.writeFile(filePath, content, 'utf-8');

    return new Response(JSON.stringify({
      success: true,
      id: `${category}/${slug}`,
      slug,
      isNew: !exists
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving menu item:', error);
    return new Response(JSON.stringify({
      error: 'Failed to save menu item',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
