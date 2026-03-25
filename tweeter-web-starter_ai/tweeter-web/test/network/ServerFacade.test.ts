import { FakeData, User, UserDto, FollowCountRequest, PagedItemRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "whatwg-fetch";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  let fakeData: FakeData;
  let authToken: string;
  let testUser: User;
  let testUserDto: UserDto;

  beforeEach(() => {
    serverFacade = new ServerFacade();
    fakeData = FakeData.instance;
    authToken = fakeData.authToken.token;
    testUser = fakeData.firstUser!;
    testUserDto = testUser.dto;
  });

  describe("getMoreFollowers", () => {
    it("returns a tuple with User array and boolean", async () => {
      const request: PagedItemRequest<UserDto> = {
        token: authToken,
        userAlias: testUser.alias,
        pageSize: 3,
        lastItem: null
      };

      const [users, hasMore] = await serverFacade.getMoreFollowers(request);
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]).toMatchObject({
        alias: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        imageUrl: expect.any(String)
      });
      expect(typeof hasMore).toBe("boolean");
    });

    it("accepts empty auth token (server does not validate tokens)", async () => {
      const request: PagedItemRequest<UserDto> = {
        token: "",
        userAlias: testUser.alias,
        pageSize: 3,
        lastItem: null
      };

      const result = await serverFacade.getMoreFollowers(request);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe("getFollowerCount", () => {
    it("resolves to a positive number", async () => {
      const request: FollowCountRequest = {
        token: authToken,
        targetUser: testUserDto
      };

      const count = await serverFacade.getFollowerCount(request);
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThan(0);
    });

    it("accepts empty auth token (server does not validate tokens)", async () => {
      const request: FollowCountRequest = {
        token: "",
        targetUser: testUserDto
      };

      const count = await serverFacade.getFollowerCount(request);
      expect(typeof count).toBe("number");
    });
  });

  describe("getFolloweeCount", () => {
    it("resolves to a positive number", async () => {
      const request: FollowCountRequest = {
        token: authToken,
        targetUser: testUserDto
      };

      const count = await serverFacade.getFolloweeCount(request);
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThan(0);
    });

    it("accepts empty auth token (server does not validate tokens)", async () => {
      const request: FollowCountRequest = {
        token: "",
        targetUser: testUserDto
      };

      const count = await serverFacade.getFolloweeCount(request);
      expect(typeof count).toBe("number");
    });
  });

  describe("register", () => {
    it("returns a User and AuthToken with valid registration data", async () => {
      const request: RegisterRequest = {
        firstName: "Test",
        lastName: "User",
        alias: "@testuser",
        password: "password123",
        userImageBytes: new Uint8Array([1, 2, 3]),
        imageFileExtension: ".png"
      };

      const [user, authToken] = await serverFacade.register(request);

      expect(user).toMatchObject({
        alias: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        imageUrl: expect.any(String)
      });
      expect(typeof authToken.token).toBe("string");
      expect(authToken.token.length).toBeGreaterThan(0);
    });

    it("returns a User and AuthToken with minimal registration data", async () => {
      const request: RegisterRequest = {
        firstName: "Min",
        lastName: "User",
        alias: "@minuser",
        password: "pass",
        userImageBytes: new Uint8Array([1]),
        imageFileExtension: ".png"
      };

      const [user, authToken] = await serverFacade.register(request);

      expect(user.alias).toBeDefined();
      expect(user.firstName).toBeDefined();
      expect(user.lastName).toBeDefined();
      expect(typeof authToken.token).toBe("string");
    });
  });
});
