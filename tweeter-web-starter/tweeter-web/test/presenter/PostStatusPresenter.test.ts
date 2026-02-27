import { AuthToken, Status, User } from "tweeter-shared";
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

describe("PostStatusPresenter Tests", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const post = "Test status";
  const authToken = new AuthToken("john-stockton", Date.now());
  const user = new User("John", "Stockton", "@johnstockton12", "image.png");
  const status = new Status(post, user, Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    let mockPostStatusViewInstance = instance(mockPostStatusView);

    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageID123",
    );

    mockService = mock<StatusService>();

    let postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance),
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(post, authToken, user);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(post, authToken, user);
    // verify(mockService.postStatus(authToken, status)).once();

    const [capturedAuth, capturedStatus] = capture(
      mockService.postStatus,
    ).last();
    expect(capturedAuth).toEqual(authToken);
    expect(capturedStatus.post).toEqual(status.post);
  });

  it("on success, tells the view to clear the info message that was displayed previously, clears the post, and displays a status posted message", async () => {
    await postStatusPresenter.submitPost(post, authToken, user);

    verify(mockPostStatusView.displayErrorMessage(anything())).never()
    verify(mockPostStatusView.deleteMessage("messageID123")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).once();
  });

  it("on failure, tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    const error = new Error("An error occurred");
    when(mockService.postStatus).thenThrow(error);
    await postStatusPresenter.submitPost(post, authToken, user);

    verify(mockPostStatusView.deleteMessage("messageID123")).once();
    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: An error occurred`,
      ),
    ).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).never();
  });
});
