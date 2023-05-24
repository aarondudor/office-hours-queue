type Row = {
  expand: boolean;
  selected: boolean;
  group: number;
  student: string | number;
  question: string;
  label: string;
  type: 'label' | 'group' | 'student'
};

export default Row;