lambda = {
  "getMoreFollowees" = { handler = "lambda/GetFolloweesLambda.handler" }
  "getMoreFollowers" = { handler = "lambda/GetFollowersLambda.handler" }
  "getFeedItems" = {handler = "lambda/GetFeedLambda.handler"}
}

api_resource = {
  "getMoreFollowees" = { pathPart = "getfollowees" }
  "getMoreFollowers" = { pathPart = "getfollowers" }
  "getFeedItems" = {pathPart = "getfeeditems"}
}