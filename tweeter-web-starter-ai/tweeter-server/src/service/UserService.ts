import {Buffer} from "buffer";
import {AuthToken, FakeData, UserDto, AuthTokenDto} from "tweeter-shared";
import {Service} from "./Service";

export class UserService implements Service {
    public async getUser(
        token: string,
        alias: string,
    ): Promise<UserDto | null> {
        // TODO: Replace with the result of calling server
        const userFound = FakeData.instance.findUserByAlias(alias);
        return userFound !== null ? userFound.dto : null
    }

    public async login(
        alias: string,
        password: string,
    ): Promise<[UserDto, AuthTokenDto]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        return [user.dto, FakeData.instance.authToken.dto];
    }

    public async logOut(token: string) {

        await new Promise((res) => setTimeout(res, 1000));
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBase64: string,
        imageFileExtension: string,
    ): Promise<[UserDto, AuthTokenDto]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string = userImageBase64;

        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user.dto, FakeData.instance.authToken.dto];
    }
}
