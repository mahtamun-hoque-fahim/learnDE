import type { Metadata } from 'next'
import Script from 'next/script'
import { Syne, Onest } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700'],
})

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-onest',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'LearnD.E. — Differential Equations for CSE 2nd Semester',
  description: 'Interactive differential equations learning platform. Read chapters, take quizzes, earn certificates.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css" />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${syne.variable} ${onest.variable} font-onest bg-[#080808] text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
