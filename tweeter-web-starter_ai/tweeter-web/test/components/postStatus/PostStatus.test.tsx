import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { verify, instance, mock, when } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";


jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component tests", () => {
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeEach(() => {
    const userMock = mock<User>();
    mockUserInstance = instance(userMock);

    const authTokenMock = mock<AuthToken>();
    mockAuthTokenInstance = instance(authTokenMock);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("disables both buttons when first rendered", () => {
    const { postStatusButton, clearButton } = renderPostStatusGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables Both buttons  with text", validateButtonEnabling);

  it("disables both buttons when text cleared", async () => {
    const { user, postStatusButton, clearButton, textField } =
      await validateButtonEnabling();

    user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("presenter calls post Status with correct params", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    when(mockPresenter.isLoading).thenReturn(false)

    const postText = "Test post text"

    const {user, postStatusButton, clearButton ,textField} = renderPostStatusGetElements(mockPresenterInstance)

    await user.type(textField, postText)
    await user.click(postStatusButton)

    verify(mockPresenter.submitPost(postText,mockAuthTokenInstance, mockUserInstance)).once()

  });
});

async function validateButtonEnabling() {
  const { user, postStatusButton, clearButton, textField } =
    renderPostStatusGetElements();

  await user.type(textField, "Test post text");
  expect(postStatusButton).toBeEnabled();
  expect(clearButton).toBeEnabled();
  return { user, postStatusButton, clearButton, textField };
}

function renderPostStatus(presenter?:PostStatusPresenter) {
  render(
    <MemoryRouter>
      {!!presenter ? (<PostStatus presenter={presenter}></PostStatus>) : (<PostStatus></PostStatus>)}
    </MemoryRouter>,
  );
}

function renderPostStatusGetElements(presenter?:PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByPlaceholderText("What's on your mind?");

  return { user, postStatusButton, clearButton, textField };
}
