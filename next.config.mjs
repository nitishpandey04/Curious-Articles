/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'collegeinfogeek.com',
        pathname: '/**',
      },
    ],
  },
}
 
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm]
  }
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)