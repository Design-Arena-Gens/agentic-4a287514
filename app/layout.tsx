export const metadata = {
  title: 'Video Text Overlay - Black Friday',
  description: 'Add custom text overlays to your videos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  )
}
