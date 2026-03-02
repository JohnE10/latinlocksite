// app/blog/[slug]/page.jsx
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "app", "blog", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".jsx"));

  const params = await Promise.all(
    files.map(async (file) => {
      try {
        const mod = await import(`../posts/${file}`);
        if (!mod.metadata) return null;
        return { slug: mod.metadata.slug };
      } catch {
        return null;
      }
    })
  );

  return params.filter(Boolean);
}

export async function generateMetadata({ params: rawParams }) {
  const { slug } = await rawParams;

  const postsDir = path.join(process.cwd(), "app", "blog", "posts");
  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".jsx"));

  for (const file of files) {
    const mod = await import(`../posts/${file}`);
    const meta = mod.metadata;
    if (meta?.slug === slug) {
      return {
        title: meta.title,
        description: meta.description,
        openGraph: {
          title: meta.title,
          description: meta.description,
          type: "article",
        },
      };
    }
  }

  return {};
}


export default async function BlogPostPage({ params: rawParams }) {
  // Await params
  const { slug } = await rawParams;

  const postsDir = path.join(process.cwd(), "app", "blog", "posts");
  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".jsx"));

  let PostComponent;

  for (const file of files) {
    const mod = await import(`../posts/${file}`);
    if (mod.metadata?.slug === slug) {
      PostComponent = mod.default;
      break;
    }
  }

  if (!PostComponent) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <article className="prose prose-lg max-w-none">
        <PostComponent />
      </article>
    </main>
  );
}


