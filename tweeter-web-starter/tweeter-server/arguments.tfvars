lambda = {
  "getMoreFollowees" = { handler = "lambda/GetFolloweesLambda.handler" }
  "getMoreFollowers" = { handler = "lambda/GetFollowersLambda.handler" }
  "getFeedItems" = {handler = "lambda/GetFeedLambda.handler"}
  "getStoryItems" = {handler = "lambda/GetStoryLambda.handler"}
  "follow" = {handler = "lambda/FollowLambda.handler"}
  "unfollow" = {handler = "lambda/FollowLambda.handler"}
  "isFollower" = {handler = "lambda/IsFollowerLambda.handler"}
  "followerCount" = {handler = "lambda/FollowerCountLambda.handler"}
  "followeeCount" = {handler = "lambda/FolloweeCountLambda.handler"}
  "getUser" = {handler = "lambda/GetUserLambda.handler"}
  "login" = {handler = "lambda/LoginLambda.handler"}
  "register" = {handler = "lambda/RegisterLambda.handler"}
  "logout" = {handler = "lambda/LogoutLambda.handler"}
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
}