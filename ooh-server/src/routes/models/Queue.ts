import Group from './Group';
import Query from './Query';

export interface QueueRow extends Group {
  queries: Query[];
}

type Queue = QueueRow[];

export default Queue;
