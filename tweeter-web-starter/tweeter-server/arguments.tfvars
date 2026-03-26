lambda = {
  "getMoreFollowees" = { handler = "lambda/follow/GetFolloweesLambda.handler" }
  "getMoreFollowers" = { handler = "lambda/follow/GetFollowersLambda.handler" }
  "getFeedItems" = {handler = "lambda/status/GetFeedLambda.handler"}
  "getStoryItems" = {handler = "lambda/status/GetStoryLambda.handler"}
  "follow" = {handler = "lambda/follow/FollowLambda.handler"}
  "unfollow" = {handler = "lambda/follow/FollowLambda.handler"}
  "isFollower" = {handler = "lambda/follow/IsFollowerLambda.handler"}
  "followerCount" = {handler = "lambda/follow/FollowerCountLambda.handler"}
  "followeeCount" = {handler = "lambda/follow/FolloweeCountLambda.handler"}
  "getUser" = {handler = "lambda/user/GetUserLambda.handler"}
  "login" = {handler = "lambda/user/LoginLambda.handler"}
  "register" = {handler = "lambda/user/RegisterLambda.handler"}
  "logout" = {handler = "lambda/user/LogoutLambda.handler"}
  "postStatus" = {handler = "lambda/status/PostStatusLambda.handler"}
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