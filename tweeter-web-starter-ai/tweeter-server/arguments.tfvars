lambda = {
  "getMoreFollowees_ai" = { handler = "lambda/GetFolloweesLambda.handler" }
  "getMoreFollowers_ai" = { handler = "lambda/GetFollowersLambda.handler" }
  "getFeedItems_ai" = {handler = "lambda/GetFeedLambda.handler"}
  "getStoryItems_ai" = {handler = "lambda/GetStoryLambda.handler"}
  "follow_ai" = {handler = "lambda/FollowLambda.handler"}
  "unfollow_ai" = {handler = "lambda/FollowLambda.handler"}
  "isFollower_ai" = {handler = "lambda/IsFollowerLambda.handler"}
  "followerCount_ai" = {handler = "lambda/FollowerCountLambda.handler"}
  "followeeCount_ai" = {handler = "lambda/FolloweeCountLambda.handler"}
  "getUser_ai" = {handler = "lambda/GetUserLambda.handler"}
  "login_ai" = {handler = "lambda/LoginLambda.handler"}
  "register_ai" = {handler = "lambda/RegisterLambda.handler"}
  "logout_ai" = {handler = "lambda/LogoutLambda.handler"}
  "postStatus_ai" = {handler = "lambda/PostStatusLambda.handler"}
}

api_resource = {
  "getMoreFollowees" = { pathPart = "getfollowees" }
  "getMoreFollowers" = { pathPart = "getfollowers" }
  "getFeedItems" = {pathPart = "getfeeditems"}
  "getStoryItems" = {pathPart = "getstoryitems"}
  "follow" = {pathPart = "follow"}
  "unfollow" = {pathPart = "unfollow"}
  "isFollower" = {pathPart = "isfollower"}
  "followerCount" = {pathPart = "followercount"}
  "followeeCount" = {pathPart = "followeecount"}
  "getUser" = {pathPart = "getuser"}
  "login" = {pathPart = "login"}
  "register" = {pathPart = "register"}
  "logout" = {pathPart = "logout"}
  "postStatus" = {pathPart = "poststatus"}
}