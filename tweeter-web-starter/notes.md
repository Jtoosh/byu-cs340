# Tweeter Project Notes

## M3 Notes

- I struggled for a few hours getting CORS to work right with Terraform programmatic deployment. I had the resources that AI, StackOverflow, and Reddit listed as necessary, and they were configured correctly, but it just wasn't working. I think what fixed it was when I destroyed the old API using Terraform and provisioned a new one, that helped refresh things.

### List of Endpoints that need to be implemented (14 total):

- [x] GetMoreFollowers*
- [x] GetMoreFollowees*
- [x] GetFeedItems*
- [x] GetStoryItems*
- [x] follow
- [ ] unfollow
- [ ] getIsFollowerStatus
- [ ] getFolloweeCount
- [ ] getFollowerCount
- [ ] getUser
- [ ] login
- [ ] logout
- [ ] register
- [ ] postStatus

\* These need to be refactored using the template method to reduce duplication