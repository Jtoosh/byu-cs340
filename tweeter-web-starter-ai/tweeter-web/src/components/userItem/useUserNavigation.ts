import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfo } from "../userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";
import { useUserNavigationPresenter } from "../../presenter/UserItem/useUserNavigationPresenter";
import { useRef } from "react";

export const useUserNavigation = () => {
  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const presenterRef = useRef<useUserNavigationPresenter | null>(null);
  if (!presenterRef.current){
    presenterRef.current = new useUserNavigationPresenter();
  }

  const navigateToUser = async (
    event: React.MouseEvent,
    featureURL: string,
  ): Promise<void> => {
    const { displayErrorMessage } = useMessageActions();
    const { setDisplayedUser } = useUserInfoActions();
    const { displayedUser, authToken } = useUserInfo();
    const navigate = useNavigate();
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await presenterRef.current!.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featureURL}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return navigateToUser ;
};
