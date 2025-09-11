// app/blog/page.jsx
import Link from 'next/link';
import Image from 'next/image';
import { globby } from 'globby';
import fs from 'fs/promises';
import matter from 'gray-matter';

async function getPosts() {
  try {
    const paths = await globby('app/blog/posts/*.mdx', { cwd: process.cwd() });
    if (paths.length === 0) {
      console.warn('No MDX files found in app/blog/posts/');
      return [];
    }

    const posts = await Promise.all(
      paths.map(async (path) => {
        const fileContent = await fs.readFile(path, 'utf8');
        const { data: metadata } = matter(fileContent);
        const slug = path.match(/([^/]+)\.mdx$/)[1];
        return {
          ...metadata,
          slug,
          thumbnail: metadata.thumbnail || '/images/default-thumbnail.jpg',
        };
      })
    );

    posts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });

    return posts;
  } catch (error) {
    console.error('Error in getPosts:', error);
    return [];
  }
}

export default async function Blog() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-600">No blog posts found.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="border-b pb-6 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={post.thumbnail}
                  alt={`${post.title} thumbnail`}
                  width={120}
                  height={90}
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {post.title || 'Untitled'}
                  </h2>
                  <p className="text-gray-600">{post.date || 'No date'}</p>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}