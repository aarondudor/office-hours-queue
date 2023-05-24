import Navbar from '@/components/Navbar';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useRoles from '@/hooks/useRoles';
import InstructorView from '@/components/InstructorView';
import StudentView from '@/components/StudentView';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { roles } = useRoles(user);
  const isInstructor = roles?.some(r => r.name === 'Instructor');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [ user, roles ]);

  if (isInstructor === undefined) {
    return <Navbar />;
  }

  return (
      <>
        <Navbar />
        {isInstructor ? <InstructorView /> : <StudentView />}
      </>
  );
}