export interface User
{
  _id: string;
  avatar: string;
  image?: string;
  displayName?: string;
  rewards?: any;
  rank?: number;
  name: string;
  xps: number;
  level: number;
  fampoints: number;
}
// Define Column type
export interface Column {
  name: string;
  uid: keyof User ;
}

// Sample columns data
const columns: Column[] = [
  { name: 'Name', uid: 'name' },
  { name: 'Fampoints', uid: 'fampoints' },
  { name: 'XPS', uid: 'xps' },
];

export { columns };

