lambda = {
  "getMoreFollowees"       = { handler = "lambda/follow/GetFolloweesLambda.handler" }
  "getMoreFollowers"       = { handler = "lambda/follow/GetFollowersLambda.handler" }
  "getFeedItems"           = { handler = "lambda/status/GetFeedLambda.handler" }
  "getStoryItems"          = { handler = "lambda/status/GetStoryLambda.handler" }
  "follow"                 = { handler = "lambda/follow/FollowLambda.handler" }
  "unfollow"               = { handler = "lambda/follow/FollowLambda.handler" }
  "isFollower"             = { handler = "lambda/follow/IsFollowerLambda.handler" }
  "followerCount"          = { handler = "lambda/follow/FollowerCountLambda.handler" }
  "followeeCount"          = { handler = "lambda/follow/FolloweeCountLambda.handler" }
  "getUser"                = { handler = "lambda/user/GetUserLambda.handler" }
  "login"                  = { handler = "lambda/user/LoginLambda.handler" }
  "register"               = { handler = "lambda/user/RegisterLambda.handler" }
  "logout"                 = { handler = "lambda/user/LogoutLambda.handler" }
  "postStatus"             = { handler = "lambda/status/PostStatusLambda.handler" }
  "postUpdateFeedMessages" = { handler = "lambda/status/PostUpdateFeedMessages.handler" }
  "updateFeed"             = { handler = "lambda/status/UpdateFeed.handler" }
}

api_resource = {
  "getMoreFollowees" = { pathPart = "getfollowees" }
  "getMoreFollowers" = { pathPart = "getfollowers" }
  "getFeedItems"     = { pathPart = "getfeeditems" }
  "getStoryItems"    = { pathPart = "getstoryitems" }
  "follow"           = { pathPart = "follow" }
  "unfollow"         = { pathPart = "unfollow" }
  "isFollower"       = { pathPart = "isfollower" }
  "followerCount"    = { pathPart = "followercount" }
  "followeeCount"    = { pathPart = "followeecount" }
  "getUser"          = { pathPart = "getuser" }
  "login"            = { pathPart = "login" }
  "register"         = { pathPart = "register" }
  "logout"           = { pathPart = "logout" }
  "postStatus"       = { pathPart = "poststatus" }
}

api_documentation = {
  "getMoreFollowees" = { description = "Load a page of Followees", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "getMoreFollowers" = { description = "Load a page of Followers", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "getFeedItems"     = { description = "Load a page of Statuses in a user's Feed", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "getStoryItems"    = { description = "Load a page of Statuses in a user's Story", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "follow"           = { description = "Follow a target user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "unfollow"         = { description = "Unfollow a target user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "isFollower"       = { description = "Determine if the target user is a follower of the calling user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "followerCount"    = { description = "Return the follower count of a target user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "followeeCount"    = { description = "Return the followee count of a target user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "getUser"          = { description = "Retrieve the user object for a target user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "login"            = { description = "Login as an existing user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "register"         = { description = "Register as a new user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "logout"           = { description = "Logout an authenticated user", response_400_desc = "Client Error", response_500_desc = "Server Error" }
  "postStatus"       = { description = "A user posts a status to their story", response_400_desc = "Client Error", response_500_desc = "Server Error" }
}
