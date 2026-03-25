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
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        return [user, FakeData.instance.authToken];
    }

    public async logOut(authToken: AuthToken) {

        await new Promise((res) => setTimeout(res, 1000));
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
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user, FakeData.instance.authToken];
    }
}
