import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

export const prerender = false;

// Validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const randomString = randomBytes(6).toString('hex');
  return `menu-${timestamp}-${randomString}${ext}`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    // Validate file exists
    if (!file) {
      return new Response(JSON.stringify({
        error: 'No file provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate extension
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return new Response(JSON.stringify({
        error: 'Invalid file extension'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'menu');
    await fs.mkdir(uploadDir, { recursive: true });

    // Get file path
    const filePath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Return the public URL path
    const publicUrl = `/images/menu/${filename}`;

    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      filename: filename
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
