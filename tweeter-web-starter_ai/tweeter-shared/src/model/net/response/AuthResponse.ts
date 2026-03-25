import { UserDto } from "../../dto/UserDto";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface AuthResponse {
  success: boolean;
  message: string | null;
  user: UserDto;
  authToken: AuthTokenDto;
}
