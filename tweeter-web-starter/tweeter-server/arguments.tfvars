lambda = {
  "getMoreFollowees" = { handler = "lambda/GetFolloweesLambda.handler" }
  "getMoreFollowers" = { handler = "lambda/GetFollowersLambda.handler" }
  "getFeedItems" = {handler = "lambda/GetFeedLambda.handler"}
  "getStoryItems" = {handler = "lambda/GetStoryLambda.handler"}
}

api_resource = {
  "getMoreFollowees" = { pathPart = "getfollowees" }
  "getMoreFollowers" = { pathPart = "getfollowers" }
  "getFeedItems" = {pathPart = "getfeeditems"}
  "getStoryItems" = {pathPart = "getstoryitems"}
}