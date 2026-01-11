import Hero from '@/components/landing/hero'
import AllSections from '@/components/landing/all-sections'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('AuthToken')?.value;

  if (authToken) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <AllSections />
    </main>
  )
}
