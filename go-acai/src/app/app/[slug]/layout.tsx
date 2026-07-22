import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return { manifest: `/app/${params.slug}/manifest` }
}

export default function AppSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
