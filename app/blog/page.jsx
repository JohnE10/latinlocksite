// app/blog/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default async function BlogPage() {
  const postsDir = path.join(process.cwd(), 'app', 'blog', 'posts');

  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.jsx'));

  const posts = await Promise.all(
    files.map(async (file) => {
      try {
        const mod = await import(`./posts/${file}`);
        return mod?.metadata ?? null;
      } catch (err) {
        console.warn(`Failed to load post: ${file}`, err);
        return null;
      }
    })
  );

  const validPosts = posts.filter(Boolean);
  validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <ul className="space-y-8">
        {validPosts.map((post, index) => (
          <li key={post.slug} className="space-y-4">
            <div className="flex gap-6 items-start">
              {post.thumbnail && (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  width={120}
                  height={100}
                  className="rounded-md object-cover"
                />
              )}

              <div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-2xl font-semibold text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>

                <p className="text-gray-600 mt-1">{post.description}</p>

                <p className="text-sm text-gray-400 mt-2">{post.date}</p>
              </div>
            </div>

            {/* Divider under each post except the last one */}
            {index < validPosts.length - 1 && (
              <hr className="border-t border-gray-300 w-[50%] mx-auto" />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
