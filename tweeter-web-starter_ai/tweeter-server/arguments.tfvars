lambda = {
  "getMoreFollowees_ai" = { handler = "lambda/GetFolloweesLambda.handler" }
  "getMoreFollowers_ai" = { handler = "lambda/GetFollowersLambda.handler" }
  "getFeedItems_ai"     = { handler = "lambda/GetFeedLambda.handler" }
  "getStoryItems_ai"    = { handler = "lambda/GetStoryLambda.handler" }
  "follow_ai"           = { handler = "lambda/FollowLambda.handler" }
  "unfollow_ai"         = { handler = "lambda/FollowLambda.handler" }
  "isFollower_ai"       = { handler = "lambda/IsFollowerLambda.handler" }
  "followerCount_ai"    = { handler = "lambda/FollowerCountLambda.handler" }
  "followeeCount_ai"    = { handler = "lambda/FolloweeCountLambda.handler" }
}

api_resource = {
  "getMoreFollowees_ai" = { pathPart = "getfollowees" }
  "getMoreFollowers_ai" = { pathPart = "getfollowers" }
  "getFeedItems_ai"     = { pathPart = "getfeeditems" }
  "getStoryItems_ai"    = { pathPart = "getstoryitems" }
  "follow_ai"           = { pathPart = "follow" }
  "unfollow_ai"         = { pathPart = "unfollow" }
  "isFollower_ai"       = { pathPart = "isfollower" }
  "followerCount_ai"    = { pathPart = "followercount" }
  "followeeCount_ai"    = { pathPart = "followeecount" }
}