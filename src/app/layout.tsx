import './globals.css'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Penn State Student Dashboard',
  description: 'A modern student dashboard for Penn State University',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <div className="min-h-screen bg-gradient-to-b from-[#001E44] to-[#1E407C]">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src="/penn-state-logo.png"
                    alt="Penn State Logo"
                    width={50}
                    height={50}
                    className="mr-4"
                    style={{ width: 'auto', height: '50px' }}
                  />
                  <h1 className="text-2xl font-bold text-[#001E44]">Student Dashboard</h1>
                </div>
              </div>
            </header>
            <main>
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}

