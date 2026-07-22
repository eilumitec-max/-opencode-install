export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    manifest: `/app/${params.slug}/manifest`,
    other: {
      'apple-mobile-web-app-title': params.slug,
    },
  }
}

export default function AppSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
