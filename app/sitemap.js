// app/sitemap.js
import fs from 'fs'
import path from 'path'

export default async function sitemap() {
  const postsDir = path.join(process.cwd(), 'app/latinlock/blog/posts')
  const files = fs.readdirSync(postsDir)

  const blogPosts = await Promise.all(
    files
      .filter(file => file.endsWith('.jsx'))
      .map(async (file) => {
        const mod = await import(`./latinlock/blog/posts/${file}`)
        const slug = mod.metadata?.slug
        const lastModified = mod.metadata?.date

        return {
          url: `https://stackorbithq.com/latinlock/blog/${slug}`,
          lastModified: new Date(lastModified),
          changeFrequency: 'monthly',
          priority: 0.7,
        }
      })
  )

  return [
    {
      url: 'https://stackorbithq.com/latinlock',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: 'https://stackorbithq.com/latinlock/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://stackorbithq.com/latinlock/latin-address-converter',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...blogPosts,
  ]
}