export interface Task{
    projectId?:number,
    user?:string,
    taskId? : number,
    createdOn?:Date,
    description?: string,
    status?:number,
    importance?:boolean,
    userId?:number
}