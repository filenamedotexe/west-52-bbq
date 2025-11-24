import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get all menu items
    const menuItems = await getCollection('menu');

    // Transform to simple format
    const items = menuItems.map(item => ({
      id: item.id,
      slug: item.slug,
      ...item.data,
    }));

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch menu items' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
