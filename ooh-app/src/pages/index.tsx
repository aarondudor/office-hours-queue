import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Office Hour Hacks</title>
        <meta name="description" content="CS 506 Office Hours Registration App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`flex flex-col w-screen h-screen`}>
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4 border-solid border border-gray-100 p-16 rounded-xl shadow-lg">
            <Image
                src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Wisconsin_Badgers_logo.svg"
                alt="Logo"
                width={160}
                height={160}
            />
            <h1 className="text-3xl font-bold mt-16">Office Hour Hacks</h1>
            {!isLoading ? (
                <button
                    className="bg-red-700 rounded-md px-4 py-2 text-white font-semibold hover:bg-red-800 active:bg-red-900 transition"
                    onClick={() => router.push('/api/auth/login')}
                >
                  Log in to continue
                </button>
            ) : (
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 14C26 16.3734 25.2962 18.6934 23.9776 20.6668C22.6591 22.6402 20.7849 24.1783 18.5922 25.0865C16.3995 25.9948 13.9867 26.2324 11.6589 25.7694C9.33116 25.3064 7.19296 24.1635 5.51473 22.4853C3.8365 20.8071 2.69361 18.6689 2.23058 16.3411C1.76756 14.0133 2.00519 11.6005 2.91344 9.40782C3.82168 7.21511 5.35975 5.34096 7.33313 4.02238C9.30652 2.7038 11.6266 2.00001 14 2" stroke="red" strokeOpacity="0.25" strokeWidth="3.84"/>
                  <path d="M14 2C16.3734 2 18.6934 2.70379 20.6668 4.02236C22.6402 5.34094 24.1783 7.21508 25.0865 9.40779C25.9948 11.6005 26.2324 14.0133 25.7694 16.3411C25.3064 18.6688 24.1635 20.807 22.4853 22.4853C20.8071 24.1635 18.6689 25.3064 16.3411 25.7694C14.0133 26.2324 11.6005 25.9948 9.40782 25.0866C7.21511 24.1783 5.34096 22.6403 4.02238 20.6669C2.7038 18.6935 2.00001 16.3734 2 14" stroke="red" strokeOpacity="0.5" strokeWidth="3.84" strokeLinecap="round"/>
                </svg>
            )}
            {error && <p className="text-red-500 text-sm">Error logging in</p>}
          </div>
        </main>
      </div>
    </>
  )
}
