'use client';

import { Aperture, LogOut, User as UserIcon, History } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';



export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email[0].toUpperCase();
  };

  const handleLogout = async () => {
    await signOut(auth);
    // Remove the cookie from the root path
    Cookies.remove('AuthToken', { path: '/' });
    router.push('/login');
  };


  return (
    <header className="sticky top-0 z-40 w-full border-b-4 bg-background">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <a href={user ? "/dashboard" : "/"} className="flex items-center gap-3">
          <img src="/icon.png" alt="Logo" className="h-8 w-8 dark:invert" />
          <div className="text-2xl font-bold tracking-tighter font-headline text-foreground">
            Argument Cartographer
          </div>
        </a>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isUserLoading ? (
            <div className="h-10 w-20 animate-pulse rounded-sm bg-muted-foreground/20" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Button asChild variant="secondary" className="font-bold border-2 border-primary/20 hover:border-primary transition-colors">
                <Link href="/radar">Narrative Radar 📡</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                      <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <History className="mr-2 h-4 w-4" />
                      <span>Usage Statistics</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="secondary" className="mr-2 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <Link href="/radar">Narrative Radar 📡</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
