import {PostSegment} from "../domain/PostSegment";
import {User} from "../domain/User";

export interface StatusDto {
    readonly post: string
    readonly user: User
    readonly timestamp: number
}