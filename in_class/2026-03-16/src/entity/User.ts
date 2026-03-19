export class User {
  follower_handle: string;
  follower_name: string;
  followee_handle: string;
  followee_name: string;

  constructor(
    follower_handle: string,
    follower_name: string,
    followee_handle: string,
    followee_name: string,
  ) {
    this.follower_handle = follower_handle;
    this.follower_name = follower_name;
    this.followee_handle = followee_handle;
    this.followee_name = followee_name;
  }

  toString(): string {
    return `${this.followee_name}, (${this.followee_handle}) is followed by ${this.follower_name}, (${this.follower_handle})\n`;
  }
}
