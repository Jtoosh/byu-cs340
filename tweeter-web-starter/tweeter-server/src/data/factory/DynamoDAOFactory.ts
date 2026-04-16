import { DAOFactory } from "./DAOFactory";
import { AuthDAO } from "../interfaces/AuthDAO";
import { FeedDAO } from "../interfaces/FeedDAO";
import { FollowsDAO } from "../interfaces/FollowsDAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { DynamoAuthDAO } from "../DynamoDAO/DynamoAuthDAO";
import { DynamoFeedDAO } from "../DynamoDAO/DynamoFeedDAO";
import { DynamoFollowsDAO } from "../DynamoDAO/DynamoFollowsDAO";
import { DynamoStatusDAO } from "../DynamoDAO/DynamoStatusDAO";
import { DynamoUserDAO } from "../DynamoDAO/DynamoUserDAO";
import { ImageDAO } from "../interfaces/ImageDAO";
import { S3ImageDAO } from "../S3ImageDAO";

export class DynamoDAOFactory implements DAOFactory {
  createImageDAO(): ImageDAO {
    return new S3ImageDAO();
  }
  createAuthDAO(): AuthDAO {
    return new DynamoAuthDAO();
  }

  createFeedDAO(): FeedDAO {
    return new DynamoFeedDAO();
  }

  createFollowsDAO(): FollowsDAO {
    return new DynamoFollowsDAO();
  }

  createStatusDAO(): StatusDAO {
    return new DynamoStatusDAO();
  }

  createUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }
}
