import {Buffer} from "buffer";
import {AuthToken, User, FakeData} from "tweeter-shared";
import {Service} from "./Service";
import {ServerFacade} from "../network/ServerFacade";

export class UserService implements Service {
    private serverFacade = new ServerFacade()

    public async getUser(
        authToken: AuthToken,
        alias: string,
    ): Promise<User | null> {
        const req = {
            token: authToken.token,
            targetUserAlias: alias
        }
        const dto = await this.serverFacade.getUser(req);
        return User.createDomainObject(dto)
    }

    public async login(
        alias: string,
        password: string,
    ): Promise<[User, AuthToken]> {
        const req = {
            alias: alias,
            password: password
        }
        const [userDto, authDto] = await this.serverFacade.login(req)

        if (userDto === null) {
            throw new Error("Invalid alias or password")
        }
        return [User.createDomainObject(userDto)!, AuthToken.createDomainObject(authDto)]
    }

    public async logOut(authToken: AuthToken) {

        const req = {
            authToken: authToken.dto
        }
       await this.serverFacade.logout(req)
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string,
    ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const req = {
            firstName: firstName,
            lastName: lastName,
            alias: alias,
            password: password,
            UserImageBytes: userImageBytes,
            imageFileExtension: imageFileExtension
        }

        const [userDto, authDto] = await this.serverFacade.register(req)

        if (userDto === null) {
            throw new Error("Invalid alias or password")
        }
        return [User.createDomainObject(userDto)!, AuthToken.createDomainObject(authDto)]
    }
}
