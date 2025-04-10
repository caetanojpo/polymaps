import React from 'react';
import {LogOut} from 'lucide-react';
import {useAuthStore} from '@/store/authStore';
import {Button} from "@/components/atoms/Buttons/Button";
import {useRouter} from 'next/navigation';
import Image from "next/image"

export function Navigation() {
    const {user, signOut} = useAuthStore();
    const router = useRouter();

    const handleSignOut = () => {
        signOut().then(() => router.push('/'));
    };
    return (
        <nav className="bg-dark shadow-sm text-white w-screen ">
            <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <Image width={30} height={30} quality={100} src="/polymap.png" alt="Polymap logo"/>
                    <h1 className="text-xl xl:text-[2rem] font-semibold ">POLYMAP</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm xl:text-[1.2rem] text-white mr-6">{user?.email}</span>
                    <Button variant="primary" className='text-white text-[1rem] xl:!text-[1.3rem]'
                            onClick={handleSignOut}>
                        <>
                            <LogOut className="hidden xl:flex w-6 h-6 mr-4"/>
                            Sign Out
                        </>
                    </Button>
                </div>
            </div>
        </nav>
    );
}