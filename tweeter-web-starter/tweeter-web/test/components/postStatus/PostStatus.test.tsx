import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("PostStatus Component tests", () => {
  it("disables both buttons when first rendered", () => {
    const { postStatusButton, clearButton } = renderPostStatusGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
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
