"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./_components/navbar";



const MainLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [message, setMessage] = useState('');
    const [auth, setAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (
            async () => {
                try {
                    const token = localStorage.getItem('accessToken');
                    if (!token) router.push('/');
    
                    console.log(token)
                    const response = await fetch('http://localhost:3111/users', {
                        method: 'GET',
                        headers: {'Authorization': `Bearer ${token}`}
                    });
    
                    const content = await response.json();
                    console.log(content);
                    setMessage(`Hi welcome back ${content.email}`);
                    setAuth(true);
                    
                } catch (error) {
                    setMessage('Please login first');
                    setAuth(false);
                    router.push('/');
                }
        })();
    });

    return (
        <div className="h-full bg-slate-200">
            <Navbar/>
            <main className="pt-40 pb-20 bg-slate-200">
                {children}
            </main>
            {/* <Footer/> */}
        </div>
    );
};

export default MainLayout;