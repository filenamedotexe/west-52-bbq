import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing menu item ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build file path from ID (format: "category/slug")
    const filePath = path.join(process.cwd(), 'src', 'data', 'menu', `${id}.md`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return new Response(JSON.stringify({ error: 'Menu item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the file
    await fs.unlink(filePath);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return new Response(JSON.stringify({
      error: 'Failed to delete menu item',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
