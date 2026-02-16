import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFollowerCount  (
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };

  // public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
  //   try {
  //     setFollowerCount(await getFollowerCount(authToken, displayedUser));
  //   } catch (error) {
  //     displayErrorMessage(
  //       `Failed to get followers count because of exception: ${error}`,
  //     );
  //   }
  // }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  // public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
  //   try {
  //     setFolloweeCount(await getFolloweeCount(authToken, displayedUser));
  //   } catch (error) {
  //     displayErrorMessage(
  //       `Failed to get followees count because of exception: ${error}`,
  //     );
  //   }
  // }

  
}
