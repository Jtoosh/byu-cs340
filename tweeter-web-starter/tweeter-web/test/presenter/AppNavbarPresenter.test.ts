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
    verify(mockAppNavbarView.deleteMessage(anything())).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.navigate("/login"));
  });

  it("on fail, tells view to display error message,but not clear user info or navigate to login page", async () => {
    let error = new Error("An error occurred")
    when(mockUserService.logOut).thenThrow(error)
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayErrorMessage(anything())).once()
    verify(mockAppNavbarView.clearUserInfo()).never()
    verify(mockAppNavbarView.navigate(anything())).never()
  })
});
