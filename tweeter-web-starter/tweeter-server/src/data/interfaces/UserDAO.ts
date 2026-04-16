import { UserDso } from "./dso/UserDso";

export interface UserDAO {
  getUser(userAlias: string): Promise<UserDso>; //Returns UserDto, followerCount, followeeCount
  createUser(firstName: string, lastName: string, alias: string, password: string, imageURL: string): Promise<void>;
  incrementFollowers(userAlias: string): Promise<void>;
  decrementFollowers(userAlias: string): Promise<void>;
  incrementFollowees(userAlias: string): Promise<void>;
  decrementFollowees(userAlias: string): Promise<void>;
}
