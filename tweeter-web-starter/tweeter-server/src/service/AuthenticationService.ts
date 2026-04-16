import { UnauthorizedError } from "tweeter-shared";
import { DynamoAuthDAO } from "../data/DynamoDAO/DynamoAuthDAO";
import { DAOFactory } from "../data/factory/DAOFactory";
import { AuthDAO } from "../data/interfaces/AuthDAO";

export class AuthenticationService {
  private authDAO: AuthDAO;
  private daoFactory: DAOFactory;

  public constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
    this.authDAO = this.daoFactory.createAuthDAO();
  }

  public async authenticateToken(token: string, userAlias: string): Promise<void> {
    const TEN_MINUTES_MS = 10 * 60 * 1000;
    const storedTokenDto = await this.authDAO.getAuth(userAlias);

    if (!storedTokenDto) {
      throw new UnauthorizedError("Invalid or expired session. Please logout and login again.");
    }

    if (Date.now() - storedTokenDto.timestamp > TEN_MINUTES_MS) {
      await this.authDAO.deleteAuth(token); // clean up expired token
      throw new UnauthorizedError("Your session has expired. Please logout and login again.");
    } 
      // await this.authDAO.updateAuth(token, Date.now());
    
  }
}
