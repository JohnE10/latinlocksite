// app/blog/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { globby } from 'globby';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

const components = {
  h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-4">{children}</h2>,
  p: ({ children }) => <p className="mb-4">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className="text-blue-600 hover:underline">{children}</a>
  ),
  ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
  li: ({ children }) => <li className="mb-2">{children}</li>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  Image,
};

async function getPosts() {
  try {
    const paths = await globby('app/blog/posts/*.mdx', { cwd: process.cwd() });
    const posts = await Promise.all(
      paths.map(async (path) => {
        try {
          const fileContent = await fs.readFile(path, 'utf8');
          const { data: metadata } = matter(fileContent);
          const slug = metadata.slug || path.match(/([^/]+)\.mdx$/)?.[1];
          if (!slug || !metadata.title || !metadata.date) {
            console.error(`Invalid metadata in ${path}:`, metadata);
            return null;
          }
          return { ...metadata, slug, filePath: path };
        } catch (error) {
          console.error(`Error processing MDX file: ${path}`, error);
          return null;
        }
      })
    );
    return posts.filter((post) => post !== null);
  } catch (error) {
    console.error('Error in getPosts:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  let mdxSource;
  try {
    mdxSource = await fs.readFile(post.filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading MDX file for slug: ${slug}`, error);
    notFound();
  }

  const { content, data: metadata } = matter(mdxSource);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* {metadata.thumbnail && (
        <Image
          src={metadata.thumbnail}
          alt={metadata.title}
          width={600}
          height={400}
          sizes="(max-width: 768px) 100vw, 600px"
          priority
          className="rounded-lg shadow-md mb-6"
        />
      )} */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{metadata.title}</h1>
      <p className="text-gray-600 mb-6">{metadata.date}</p>
      <div className="prose prose-lg max-w-none">
        <MDXRemote source={content} components={components} />
      </div>
    </div>
  );
}