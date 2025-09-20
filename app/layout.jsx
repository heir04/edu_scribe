import { Inter } from 'next/font/google'
import './globals.css'
import ClientWrapper from './ClientWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EduScribe - Transform Lectures into Learning',
  description: 'AI-powered transcription, summarization, and translation for educational content. Upload once, access forever with support for Nigerian local languages.',
  keywords: 'education, transcription, AI, translation, Nigerian languages, e-learning, lectures',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}