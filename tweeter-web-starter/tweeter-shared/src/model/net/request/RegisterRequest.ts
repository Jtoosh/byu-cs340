import {AuthRequest} from "./AuthRequest";

export interface RegisterRequest extends AuthRequest{
    firstName: string,
    lastName: string,
    UserImageBytes: Uint8Array,
    imageFileExtension: string
}