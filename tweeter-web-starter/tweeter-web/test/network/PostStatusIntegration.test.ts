import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import {
    PostStatusPresenter,
    PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
    anything,
    capture,
    instance,
    mock,
    spy,
    verify,
    when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";
import { UserService } from "../../src/model.service/UserService";
import { ServerFacade } from "../../src/network/ServerFacade";
import "whatwg-fetch";

describe("PostStatusPresenter Unit Tests with ts-mockito", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockService: StatusService;

    const post = "Test status integration";
    const authToken = new AuthToken("test-token", Date.now());
    const user = new User("Test", "User", "@testuser", "image.png");

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        let mockPostStatusViewInstance = instance(mockPostStatusView);

        when(mockPostStatusView.displayInfoMessage(anything(), anything())).thenReturn(
            "messageID123",
        );

        mockService = mock<StatusService>();
        let mockServiceInstance = instance(mockService);

        let realPresenter = new PostStatusPresenter(mockPostStatusViewInstance);
        let postStatusPresenterSpy = spy(realPresenter);
        postStatusPresenter = instance(postStatusPresenterSpy);

        when(postStatusPresenterSpy.service).thenReturn(mockServiceInstance);
    });

    it("displays 'Status posted!' message on successful post", async () => {
        when(mockService.postStatus(anything(), anything())).thenResolve();

        await postStatusPresenter.submitPost(post, authToken, user);

        verify(
            mockPostStatusView.displayInfoMessage("Status posted!", 2000),
        ).once();
    });

    it("calls postStatus on the service with correct parameters", async () => {
        when(mockService.postStatus(anything(), anything())).thenResolve();

        await postStatusPresenter.submitPost(post, authToken, user);

        const [capturedAuth, capturedStatus] = capture(
            mockService.postStatus,
        ).last();
        expect(capturedAuth).toEqual(authToken);
        expect(capturedStatus.post).toEqual(post);
        expect(capturedStatus.user).toEqual(user);
    });

    it("clears the post text on successful submission", async () => {
        when(mockService.postStatus(anything(), anything())).thenResolve();

        await postStatusPresenter.submitPost(post, authToken, user);

        verify(mockPostStatusView.setPost("")).once();
    });

    it("displays error message on failure and does not display success message", async () => {
        const error = new Error("Failed to post");
        when(mockService.postStatus(anything(), anything())).thenReject(error);

        await postStatusPresenter.submitPost(post, authToken, user);

        verify(mockPostStatusView.displayErrorMessage(anything())).once();
        verify(
            mockPostStatusView.displayInfoMessage("Status posted!", anything()),
        ).never();
    });
});

describe("PostStatus Integration Tests with Server", () => {
    let serverFacade: ServerFacade;
    let statusService: StatusService;
    let userService: UserService;
    let authToken: AuthToken;
    let testUser: User;
    let registeredUser: User;

    beforeEach(async () => {
        serverFacade = new ServerFacade();
        statusService = new StatusService();
        userService = new UserService();

        const randomAlias = "testuser" + Date.now();
        const [user, token] = await userService.register(
            "Test",
            "User",
            "@" + randomAlias,
            "password123",
            new Uint8Array([1, 2, 3]),
            ".png"
        );

        registeredUser = user;
        authToken = token;
        testUser = user;
    });

    it("successfully posts a status from logged-in user and verifies it appears in story", async () => {
        const postText = "Integration test post " + Date.now();
        const newStatus = new Status(postText, testUser, Date.now());

        await statusService.postStatus(authToken, newStatus);

        const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
            authToken,
            testUser.alias,
            10,
            null
        );

        const foundStatus = storyItems.find(s => s.post === postText);
        expect(foundStatus).toBeDefined();
        expect(foundStatus!.post).toBe(postText);
        expect(foundStatus!.user.alias).toBe(testUser.alias);
        expect(foundStatus!.timestamp).toBeDefined();
    }, 10000);

    it("verifies status details are correct after posting", async () => {
        const postText = "Detailed test post " + Date.now();
        const timestamp = Date.now();
        const newStatus = new Status(postText, testUser, timestamp);

        await statusService.postStatus(authToken, newStatus);

        const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
            authToken,
            testUser.alias,
            10,
            null
        );

        const foundStatus = storyItems.find(s => s.post === postText);
        expect(foundStatus).not.toBeNull();
        expect(foundStatus!.post).toBe(postText);
        expect(foundStatus!.user.firstName).toBe(testUser.firstName);
        expect(foundStatus!.user.lastName).toBe(testUser.lastName);
        expect(foundStatus!.user.alias).toBe(testUser.alias);
    }, 10000);
});