import { UserProfile } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';

export type StudentPositionReqParams = {
  email : string;
};

export type StudentPositionResBody = {
  position : number;
};

const fetcher = (user : UserProfile | undefined) => {
  return fetch(`${process.env.SERVER_FETCH_URL}/students/position`, {
    body: JSON.stringify({ email: user?.email })
  }).then(res => res.json());
};

const useStudentPosition = (user : UserProfile | undefined) => {
  const { data, error, isLoading } = useSWR<StudentPositionResBody>(user, fetcher);
  return {
    data,
    error,
    isLoading
  };
};

export default useStudentPosition;