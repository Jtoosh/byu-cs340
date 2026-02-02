import { useContext } from "react";
import { User, AuthToken } from "tweeter-shared";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
};
