"use client";

import { Button } from "@/components/ui/button";
import { ALargeSmall, BadgeInfo, MailQuestion, SquareAsterisk } from "lucide-react";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3111/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email, password
      })
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem('accessToken', data.access_token);
    }

   
    await router.push('/dashboard');
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs">
        <h1 className="mb-4 text-3xl font-extrabold">
          Register
        </h1>
        <form onSubmit={submit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
            <div className="flex items-center mb-2">
                <MailQuestion className="mr-1"/>
                <label className="block text-gray-700 text-sm font-bold">
                Email
                </label>
            </div>
            <input onChange={e => setEmail(e.target.value)} className={`shadow appearance-none border rounded w-full py-2 px-3 ${email == '' ? 'border-red-500' : ''} text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2`} id="email" type="email" placeholder="your@mail.com" aria-required/>
            <p className={`text-red-500 text-xs italic ${ email == '' ? '' : 'hidden'}`}>Email required.</p>
          </div>
          <div className="mb-8">
            <div className="flex items-center mb-2">
                <SquareAsterisk className="mr-1"/>
                <label className="block text-gray-700 text-sm font-bold">
                Password
                </label>
            </div>
            <input onChange={e => setPassword(e.target.value)} className={`shadow appearance-none border ${password == '' ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline`} id="password" type="password" placeholder="********" required/>
            <p className={`text-red-500 text-xs italic ${ password == '' ? '' : 'hidden'}`}>Please type a password.</p>
          </div>
          <div className="mb-6">
            <div className="flex items-center mb-1 font-extrabold">
              <h2 className="mr-1">Personal information</h2>
                <div className="group relative w-max">
                    <BadgeInfo/>
                  <span
                    className="text-sm pointer-events-none absolute -bottom-6 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 text-white bg-black inline-block rounded-md"
                  >
                    Optional, you can skip this
                  </span>
                </div>
            </div>
            <div className="flex items-center mb-2">
                <ALargeSmall className="mr-1"/>
                <label className="block text-gray-700 text-sm font-bold">
                First Name
                </label>
            </div>
            <input onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="fName" type="text" placeholder="John"/>
            <div className="flex items-center mb-2">
                <ALargeSmall className="mr-1"/>
                <label className="block text-gray-700 text-sm font-bold">
                Last Name
                </label>
            </div>
            <input onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="lName" type="text" placeholder="Doe"/>
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Register
            </Button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2024 SnapSave Corp. All rights reserved.
        </p>
      </div>
    </div>
  )
        
};

export default RegisterPage;