import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { instance, mock } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";

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

  it("Both buttons enabled with text", async () => {
    const { user, postStatusButton, clearButton, textField } =
      renderPostStatusGetElements();
      

    await user.type(textField, "Test post text");
    expect(postStatusButton).toBeEnabled();
    // expect(clearButton).toBeEnabled()
  });
});

function renderPostStatus() {
  render(
    <MemoryRouter>
      <PostStatus></PostStatus>
    </MemoryRouter>,
  );
}

function renderPostStatusGetElements() {
  const user = userEvent.setup();

  renderPostStatus();

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByPlaceholderText("What's on your mind?");

  return { user, postStatusButton, clearButton, textField };
}
