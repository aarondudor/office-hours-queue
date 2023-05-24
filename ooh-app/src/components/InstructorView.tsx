import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Queue from '@/models/Queue';
import { useRouter } from 'next/router';

type Row = {
  expand: boolean;
  selected: boolean;
  isGroup: boolean;
  group: number;
  student: string | number;
  question: string;
  inOffice: boolean;
};

const InstructorView = () => {
  const router = useRouter();
  const [ queue, setQueue ] = useState<Queue>();
  const [ rowDefs, setRowDefs ] = useState<Row[]>([]);
  const [ polling, setPolling ] = useState<boolean>(false);
  const groupsSelected = rowDefs.filter(r => r.selected && r.isGroup);

  const handlePoll = useCallback(async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setPolling(true);
    const resp = await fetch(`${process.env.SERVER_FETCH_URL}/instructors/poll`, {
      method: 'PUT',
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
    if (resp.ok) {
      setPolling(false);
      router.reload();
    }
  }, []);

  const handleMerge = useCallback(async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const resp = await fetch(`${process.env.SERVER_FETCH_URL}/instructors/merge`, {
      method: 'PUT',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupIds: groupsSelected.map(g => g.group)
      })
    });
    if (resp.ok) {
      router.reload();
    }
  }, [ groupsSelected ]);

  const fetchQueue = useCallback(async () => {
    const resp = await fetch(`${process.env.SERVER_FETCH_URL}/instructors/queue`);
    const { queue } = await resp.json();
    setQueue(queue);
  }, [ setQueue ]);

  useEffect(() => {
    fetchQueue();
  }, []);

  useEffect(() => {
    if (queue) {
      setRowDefs(queue.map((g) => ({
        expand: false,
        selected: false,
        isGroup: true,
        group: g.id,
        student: g.queries.length,
        question: g.topic,
        inOffice: g.inOffice
      })));
    }
  }, [ queue ]);

  return (
      <section className="px-16 py-8 flex flex-col items-center gap-2">
        <h1 className="font-medium text-2xl">Student Queue</h1>
        <h2>Topmost group is first out</h2>
        <div className="flex gap-4 w-full mt-4">
          <button
              disabled={!queue?.length || polling}
              className="bg-red-700 rounded-md px-4 py-2 text-white font-semibold hover:bg-red-800 active:bg-red-900 transition disabled:bg-red-900 flex gap-2 items-center"
              onClick={handlePoll}
          >
            Poll next group
            {polling && (
                <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 14C26 16.3734 25.2962 18.6934 23.9776 20.6668C22.6591 22.6402 20.7849 24.1783 18.5922 25.0865C16.3995 25.9948 13.9867 26.2324 11.6589 25.7694C9.33116 25.3064 7.19296 24.1635 5.51473 22.4853C3.8365 20.8071 2.69361 18.6689 2.23058 16.3411C1.76756 14.0133 2.00519 11.6005 2.91344 9.40782C3.82168 7.21511 5.35975 5.34096 7.33313 4.02238C9.30652 2.7038 11.6266 2.00001 14 2" stroke="red" strokeOpacity="0.25" strokeWidth="3.84"/>
                  <path d="M14 2C16.3734 2 18.6934 2.70379 20.6668 4.02236C22.6402 5.34094 24.1783 7.21508 25.0865 9.40779C25.9948 11.6005 26.2324 14.0133 25.7694 16.3411C25.3064 18.6688 24.1635 20.807 22.4853 22.4853C20.8071 24.1635 18.6689 25.3064 16.3411 25.7694C14.0133 26.2324 11.6005 25.9948 9.40782 25.0866C7.21511 24.1783 5.34096 22.6403 4.02238 20.6669C2.7038 18.6935 2.00001 16.3734 2 14" stroke="red" strokeOpacity="0.5" strokeWidth="3.84" strokeLinecap="round"/>
                </svg>
            )}
          </button>
          <button
              disabled={groupsSelected.length < 2}
              className="border-solid border border-gray-300 rounded-md px-4 py-2 font-semibold hover:bg-gray-100 active:bg-gray-200 transition disabled:bg-gray-100 disabled:text-gray-400"
              onClick={handleMerge}
          >
            Merge ({groupsSelected.length})
          </button>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-200">
          <tr>
            <th className="px-3 w-1" />
            <th className="px-3 w-1" />
            <th className="px-6 py-3 w-1">Group</th>
            <th className="px-6 py-3 w-80">Student</th>
            <th className="px-6 py-3">Question</th>
            <th className="px-6 py-3" />
          </tr>
          </thead>
          <tbody>
          {!queue ? (
              <tr>
                <td className="px-3" />
                <td className="px-3" />
                <td className="px-3" />
                <td className="px-6 py-4 italic">Loading...</td>
              </tr>
          ) : !queue.length ? (
              <tr>
                <td className="px-3" />
                <td className="px-3" />
                <td className="px-3" />
                <td className="px-6 py-4 italic">Queue empty</td>
              </tr>
          ) : (
              rowDefs.map((row, i) => (
                  <tr key={i} className={`${row.selected ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-50 border-b`}>
                    <td className="px-3">
                      {row.isGroup && (
                          <button
                              onClick={() => {
                                const toExpand = !rowDefs[i].expand;
                                if (toExpand) {
                                  // add
                                  const toAdd = queue?.find(g => g.id === row.group)?.queries.map(q => ({
                                    expand: false,
                                    selected: rowDefs[i].selected,
                                    isGroup: false,
                                    group: row.group,
                                    student: q.email,
                                    question: q.content
                                  })) as Row[];
                                  const tmpRows = [ ...rowDefs ];
                                  tmpRows[i].expand = toExpand;
                                  tmpRows.splice(i + 1, 0, ...toAdd);
                                  setRowDefs(tmpRows);
                                } else {
                                  // remove
                                  const tmpRows = [ ...rowDefs ];
                                  tmpRows[i].expand = toExpand;
                                  tmpRows.splice(i + 1, tmpRows.filter(r => r.group === row.group && !r.isGroup).length);
                                  setRowDefs(tmpRows);
                                }
                              }}
                          >
                            {!row.expand ? <ChevronRightIcon className="w-4 h-4" /> :
                                <ChevronDownIcon className="w-4 h-4" />}
                          </button>
                      )}
                    </td>
                    <td className="px-3">
                      {row.isGroup && (
                          <input
                              type="checkbox"
                              className="cursor-pointer w-4 h-4 rounded"
                              checked={row.selected}
                              onChange={() => {
                                const tmpRows = [ ...rowDefs ];
                                tmpRows[i].selected = !tmpRows[i].selected;
                                if (i < tmpRows.length - 1) {
                                  for (let j = i + 1; j < i + 1 + (row.student as number) && !tmpRows[j].isGroup; j++) {
                                    tmpRows[j].selected = tmpRows[i].selected;
                                  }
                                }
                                setRowDefs(tmpRows);
                              }}
                          />
                      )}
                    </td>
                    <td className="px-6 py-4">{row.isGroup && row.group}</td>
                    <td className="px-6 py-4">{row.student}</td>
                    <td className="px-6 py-4">{row.question}</td>
                    <td className="px-6 py-4 text-sm text-right italic">{row.inOffice ? 'Currently in office hour' : ''}</td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </section>
  );
};

export default InstructorView;