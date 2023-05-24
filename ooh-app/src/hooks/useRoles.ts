import useSWR from 'swr';
import { UserProfile } from '@auth0/nextjs-auth0/client';

export interface Role {
  id : string;
  name : string;
  description : string;
}

const fetcher = (user : UserProfile | undefined) => {
  return !user ? [] : fetch(`https://dev-q2plep56d8d2rdmc.us.auth0.com/api/v2/users/${encodeURIComponent(user?.sub as string)}/roles`, {
    headers: {
      authorization: `Bearer ${process.env.AUTH0_MGMT_API_ACCESS_TOKEN}`
    }
  }).then(res => res.json());
};

const useRoles = (user : UserProfile | undefined) => {
  const {
    data,
    error,
    isLoading
  } = useSWR<Role[]>(user, fetcher);
  return {
    roles: data,
    error,
    isLoading
  };
};

export default useRoles;