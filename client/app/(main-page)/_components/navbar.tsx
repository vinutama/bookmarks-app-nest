'use client';

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/');
    }

    return (
        <div className="fixed Z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
            <div className="flex items-center gap-x-4">
                <div className="hidden md:flex">
                    <Logo/>
                </div>
                <Button size="sm" className="rounded-sm hidden md:block h-auto py-1.5 px-2">
                    Create
                </Button>
                <Button size="sm" className="rounded-sm block md:hidden">
                    <Plus className="h-4 w-4"/>
                </Button>
            </div>
            <div className="ml-auto flex items-center gap-x-2">
                <Button size="sm" className="rounded-sm hidden md:block h-auto py-1.5 px-2" onClick={handleLogout}>
                    Logout
                </Button>
                <Button size="sm" className="rounded-sm block md:hidden" onClick={handleLogout}>
                    <LogOut className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    )
}

export default Navbar;