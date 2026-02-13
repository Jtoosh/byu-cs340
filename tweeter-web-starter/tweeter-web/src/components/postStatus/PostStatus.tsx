import "./PostStatus.css";
import { useState } from "react";
import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoContexts";
import { useMessageActions } from "../toaster/MessageHooks";
import { PostStatusPresenter } from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken } = useContext(UserInfoContext);
  const [post, setPost] = useState("");

  const presenter = new PostStatusPresenter({
    displayErrorMessage,
    displayInfoMessage,
    deleteMessage,
    setPost
  });

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    presenter.submitPost(post, authToken!, currentUser!);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {presenter.isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
