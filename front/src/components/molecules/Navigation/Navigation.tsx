import React from 'react';
import {LogOut} from 'lucide-react';
import {useAuthStore} from '@/store/authStore';
import {Button} from "@/components/atoms/Buttons/Button";
import {useRouter} from 'next/navigation';

export function Navigation() {
    const user = useAuthStore((state) => state.user);
    const signOut = useAuthStore((state) => state.signOut);
    const router = useRouter();

    const handleSignOut = () => {
        signOut().then(() => router.push('/'));
    };
    return (
        <nav className="bg-dark shadow-sm text-white w-screen ">
            <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-[2rem] font-semibold ">Region Management</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-[1.2rem] text-white mr-6">{user?.email}</span>
                    <Button variant="primary" className='text-white !text-[1.3rem]' onClick={handleSignOut}>
                        <>
                            <LogOut className="w-6 h-6 mr-4"/>
                            Sign Out
                        </>
                    </Button>
                </div>
            </div>
        </nav>
    );
}