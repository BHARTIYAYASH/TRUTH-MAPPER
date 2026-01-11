import { cookies } from 'next/headers';
import { DashboardContent } from './DashboardContent';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('AuthToken')?.value;

    if (!authToken) {
        redirect('/login');
    }

    return <DashboardContent authToken={authToken} />;
}
