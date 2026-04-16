import { UserDto } from "tweeter-shared";
import { Dso } from "./Dso";

export interface UserDso extends UserDto, Dso{
  passwordHash: string,
  followerCount: number,
  followeeCount: number
}