import {AuthTokenDto} from "tweeter-shared";

export interface AuthDAO {
    getAuth(userAlias: string): Promise<AuthTokenDto>,
    createAuth(userAlias: string): Promise<void>,
    deleteAuth(token: string): Promise<void>
    updateAuth(token: string, timestamp: number): Promise<void>
}