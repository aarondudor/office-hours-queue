import ordinal from 'ordinal';
import { useCallback, useState, MouseEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import { UserProfile } from '@auth0/nextjs-auth0/dist/client';

const StudentView = () => {
  const router = useRouter();
  const { user } = useUser();
  const [ position, setPosition ] = useState<number>();
  const [ topic, setTopic ] = useState<string>('');
  const [ query, setQuery ] = useState<string>('');
  const [ error, setError ] = useState();

  const handleSubmit = useCallback(async (e : MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const resp = await fetch(`${process.env.SERVER_FETCH_URL}/students/enqueue`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user?.email,
          content: query,
          topic
        })
      });
      if (resp.ok) {
        router.reload();
      }
    } catch (e : any) {
      setError(e);
    }
  }, [ user, query, router ]);

  const handleCancel = useCallback(async (e : MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const resp = await fetch(`${process.env.SERVER_FETCH_URL}/students/dequeue`, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user?.email
      })
    });
    if (resp.ok) {
      router.reload();
    }
  }, [ user, router ]);

  const fetchPosition = useCallback(async () => {
    const resp = await fetch(`${process.env.SERVER_FETCH_URL}/students/position`, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: (user as UserProfile).email
      })
    });
    const data = await resp.json();
    setPosition(data.position);
  }, [ user ]);

  useEffect(() => {
    fetchPosition();
  }, []);

  if (position === undefined) {
    return null;
  }

  return (
      <section className="px-16 py-8 flex flex-col items-center gap-4">
        <h1 className="font-medium text-2xl">
          {position < 0 ?
              'You are not in the office hour queue' :
              position > 0 ?
                  `You are ${ordinal(position)} in line` :
                  'Your turn in the office hour. Expect an email from an instructor.'}
        </h1>
        {position < 0 ? (
            <div className="flex flex-col items-center gap-4 border-solid border border-gray-100 p-8 rounded-xl shadow-lg">
              <div className="w-full flex flex-col gap-1">
                <label className="text-sm">Enter topic</label>
                <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className={`
                      border-solid border border-gray-400 rounded 
                      w-96 resize-y p-2
                      focus:outline-none focus:ring focus:ring-2 focus:ring-red-300
                  `}
                />
              </div>
              <div className="w-full flex flex-col gap-1">
                <label className="text-sm">Enter a question or problem</label>
                <textarea
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className={`
                      border-solid border border-gray-400 rounded 
                      w-96 h-40 resize-y p-2
                      focus:outline-none focus:ring focus:ring-2 focus:ring-red-300
                  `}
                />
              </div>
              <div className="w-full space-y-2">
                <button
                    className="bg-red-700 rounded-md px-4 py-2 text-white font-semibold hover:bg-red-800 active:bg-red-900 transition w-full"
                    onClick={handleSubmit}
                >
                  Submit
                </button>
                {error && <p className="text-red-500 text-sm">Error submitting your query</p>}
              </div>
            </div>
        ) : (
            <button
                className="bg-red-700 rounded-md px-4 py-2 text-white font-semibold hover:bg-red-800 active:bg-red-900 transition"
                onClick={handleCancel}
            >
              Cancel your reservation
            </button>
        )}
      </section>
  );
};

export default StudentView;