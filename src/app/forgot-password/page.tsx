'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!email) {
            setError('Email is required.');
            setIsLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                if (e.code === 'auth/user-not-found') {
                    setError('No account found with this email.');
                } else {
                    setError(e.message);
                }
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container flex h-[calc(100vh-80px)] items-center justify-center">
                <Card className="mx-auto max-w-sm border-4 shadow-[8px_8px_0px_hsl(var(--border))]">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl text-center">Check your Email</CardTitle>
                        <CardDescription className="text-center">
                            We have sent a password reset link to <b>{email}</b>.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full">Back to Login</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="container flex h-[calc(100vh-80px)] items-center justify-center">
            <Card className="mx-auto max-w-sm border-4 shadow-[8px_8px_0px_hsl(var(--border))]">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReset} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {error && (
                            <p className="text-sm font-medium text-destructive">{error}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                            Send Reset Link
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <Link href="/login" className="flex items-center justify-center gap-2 underline text-muted-foreground hover:text-primary">
                            <ArrowLeft className="h-4 w-4" /> Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
