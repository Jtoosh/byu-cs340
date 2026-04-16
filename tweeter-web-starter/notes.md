# Tweeter Project Notes

## M3 Notes

- I struggled for a few hours getting CORS to work right with Terraform programmatic deployment. I had the resources that AI, StackOverflow, and Reddit listed as necessary, and they were configured correctly, but it just wasn't working. I think what fixed it was when I destroyed the old API using Terraform and provisioned a new one, that helped refresh things.

### List of Endpoints that need to be implemented (14 total):

- [x] GetMoreFollowers*
- [x] GetMoreFollowees*
- [x] GetFeedItems*
- [x] GetStoryItems*
- [x] follow
- [x] unfollow
- [x] getIsFollowerStatus
- [x] getFolloweeCount
- [x] getFollowerCount
- [x] getUser
- [x] login
- [x] logout
- [x] register
- [x] postStatus

\* These need to be refactored using the template method to reduce duplication

## M4A Notes

### Critical TODOs

- [ ] Disallow duplicate alias registering

### Places to De-dupe

- [ ] server/StatusService.ts -> loadMoreFeedItems + loadMoreStoryItems
- [ ] server/FollowService.ts -> follow/unfollow

### Other improvements

- [x] Make a UserDso interface to keep things succinct?
- [x] Create increment and decrement DB methods, call those for count changes.
- [x] Get followees posts onto their follower's feeds
- [x] GetFollowerStatus is not quite working

### Authentication TODOS:

- [x] Determine timestamp checking method.
- [x] Authenticate logout requests
- [x] Authenticate post status reqs
- [x] Authenticate viewing Feed
- [x] Authenticate follow
- [x] Authenticate unfollow

## M4B Notes

- Make sure that I am testing on the AWS Lambda console with the right template. For a while I was testing SQS trigger lambdas with the Hello World template, which was not working.