import {AuthDAO} from "../interfaces/AuthDAO";
import {FeedDAO} from "../interfaces/FeedDAO";
import {FollowsDAO} from "../interfaces/FollowsDAO";
import { ImageDAO } from "../interfaces/ImageDAO";
import {StatusDAO} from "../interfaces/StatusDAO";
import {UserDAO} from "../interfaces/UserDAO";

export interface DAOFactory{
    createAuthDAO(): AuthDAO,
    createFeedDAO(): FeedDAO,
    createFollowsDAO(): FollowsDAO,
    createStatusDAO(): StatusDAO,
    createUserDAO(): UserDAO,
    createImageDAO(): ImageDAO
}