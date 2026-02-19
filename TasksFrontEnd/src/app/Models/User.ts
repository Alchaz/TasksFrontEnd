import { Task } from "./Task";


export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: number;
  tasks: Task[];
}
