import { Task } from "./Tasks"
export interface Project {
  title: string;
  description: string;
  id?: number;
  tasks?: Task[]
}
