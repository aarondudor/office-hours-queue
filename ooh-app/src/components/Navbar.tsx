import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const { user } = useUser();
  return (
      <nav className={`
          w-screen h-16 border-solid border-b border-red-200
          flex items-center px-8
      `}>
        <div className="flex items-center gap-2 w-fit">
          <Image
              src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Wisconsin_Badgers_logo.svg"
              alt="Logo"
              width={32}
              height={32}
          />
          <p className="font-bold">Office Hour Hacks</p>
        </div>
        {user && (
            <div className="ml-auto flex items-center gap-2">
              <button
                  className="border-solid border border-gray-300 rounded-md px-4 py-2 font-semibold hover:bg-gray-100 active:bg-gray-200 transition"
                  onClick={() => router.push('/api/auth/logout')}
              >
                Logout
              </button>
              <Image src={user.picture as string} alt="Profile Picture" width={32} height={32} className="rounded-full" />
            </div>
        )}
      </nav>
  );
};

export default Navbar;