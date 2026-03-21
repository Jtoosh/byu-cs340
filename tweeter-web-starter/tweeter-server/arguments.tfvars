lambda = {
  "getMoreFollowees" = { handler = "lambda/GetFolloweesLambda.handler" }
  "getMoreFollowers" = { handler = "lambda/GetFollowersLambda.handler" }
}

api_resource = {
  "getMoreFollowees" = { pathPart = "getfollowees" }
  "getMoreFollowers" = { pathPart = "getfollowers" }
}