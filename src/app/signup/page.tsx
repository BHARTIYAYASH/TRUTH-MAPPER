'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Signup Successful',
        description: 'Please log in with your new account.',
      });
      router.push('/login');
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/email-already-in-use') {
          setError('This email address is already in use.');
        } else {
          setError(e.message);
        }
      } else {
        setError('An unknown error occurred.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-[calc(100vh-80px)] items-center justify-center">
      <Card className="mx-auto max-w-sm border-4 shadow-[8px_8px_0px_hsl(var(--border))]">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
