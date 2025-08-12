import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter, 
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm
        ],
        rehypePlugins: [rehypeHighlight],
      })
    },
    react()
  ],
  base: process.env.NODE_ENV === 'production' ? '/personal-website/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
