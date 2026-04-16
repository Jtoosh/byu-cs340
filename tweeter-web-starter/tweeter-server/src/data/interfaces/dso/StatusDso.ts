import { Dso } from "./Dso";

export interface StatusDso extends Dso{
  userAlias: string,
  post: string, 
  timestamp: number
}