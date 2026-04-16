import { UserDto, AuthTokenDto, UnauthorizedError, NotFoundError, ServerError } from "tweeter-shared";
import { compare } from "bcryptjs"

import { Service } from "./Service";
import { DAOFactory } from "../data/factory/DAOFactory";
import { UserDAO } from "../data/interfaces/UserDAO";
import { AuthDAO } from "../data/interfaces/AuthDAO";
import { UserDso } from "../data/interfaces/dso/UserDso";
import { ImageDAO } from "../data/interfaces/ImageDAO";
import { AlreadyInUseError } from "tweeter-shared";

export class UserService implements Service {
  private daoFactory: DAOFactory;
  private userDAO: UserDAO;
  private authDAO: AuthDAO;
  private imageDAO: ImageDAO;

  public constructor(daoFactory: DAOFactory) {
    this.daoFactory = daoFactory;
    this.userDAO = this.daoFactory.createUserDAO();
    this.authDAO = this.daoFactory.createAuthDAO();
    this.imageDAO = this.daoFactory.createImageDAO();
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    const userFound = await this.userDAO.getUser(alias); //This might need to be adjusted to make login work, remove token param

    return userFound !== null ? this.convertToDTO(userFound) : null;

  }

  public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    
    try {
      const dso = await this.userDAO.getUser(alias);
      const user = this.convertToDTO(dso);
  
      if (!await compare(password, dso.passwordHash)) {
        throw new UnauthorizedError("Incorrect password")
      }
  
      await this.authDAO.createAuth(user.alias);
      const newAuth = await this.authDAO.getAuth(user.alias);
  
      return [user, newAuth];
    } catch (error:any) {
      throw new NotFoundError(error.message)
    }
  }

  public async logOut(token: string) {
    await this.authDAO.deleteAuth(token);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    
    try {
      await this.userDAO.getUser(alias)
      throw new AlreadyInUseError(`The alias ${alias} is already in use. Select another one.`)
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        const imageFileName = `${firstName + lastName + imageFileExtension}`;
        const imageURL = await this.imageDAO.uploadImage(imageFileName, userImageBase64);
    
        await this.userDAO.createUser(firstName, lastName, alias, password, imageURL);
        const dso = await this.userDAO.getUser(alias);
        const user = this.convertToDTO(dso);
    
        await this.authDAO.createAuth(user.alias);
        const newAuth = await this.authDAO.getAuth(user.alias);
    
        return [user, newAuth];
      } else if (error.name === "AlreadyInUseError") {
        throw new AlreadyInUseError(`The alias ${alias} is already in use. Select another one.`)
      } else {
        throw new ServerError("There was an error during registration. Please try again.")
      }
    }
    
    
  }

  private convertToDTO(dso: UserDso) {
    return {
      firstName: dso.firstName,
      lastName: dso.lastName,
      alias: dso.alias,
      imageUrl: dso.imageUrl,
    };
  }
}
