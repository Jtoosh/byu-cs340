import { AuthToken } from "tweeter-shared";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenter/AppNavbarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model.service/UserService";

describe("App Navbar Tests", () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  let authToken = new AuthToken("john-stockton", Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    let mockAppNavbarViewInstance = instance(mockAppNavbarView);

    when(mockAppNavbarView.displayInfoMessage(anything(), 0)).thenReturn(
      "message123",
    );

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarViewInstance),
    );
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockUserService = mock<UserService>();
    when(appNavbarPresenterSpy.service).thenReturn(instance(mockUserService));
  });

  it("tells the view to display a logout message", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on user service with correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);
    // verify(mockUserService.logOut(authToken)).once();

    let [capturedAuthToken] = capture(mockUserService.logOut).last();
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("on success, tells view to clear info message, clear user info, and navigate to login page", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayErrorMessage(anything())).never();
    verify(mockAppNavbarView.deleteMessage("message123")).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.navigate("/login"));
  });

  it("on fail, tells view to display error message,but not clear the info message, user info or navigate to login page", async () => {
    let error = new Error("An error occurred");
    when(mockUserService.logOut).thenThrow(error);
    await appNavbarPresenter.logOut(authToken);
    verify(
      mockAppNavbarView.displayErrorMessage(
        `Failed to log user out because of exception: An error occurred`,
      ),
    ).once();
    verify(mockAppNavbarView.deleteMessage(anything())).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
    verify(mockAppNavbarView.navigate(anything())).never();
  });
});
