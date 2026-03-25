export interface RegisterRequest {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  userImageBytes: Uint8Array;
  imageFileExtension: string;
}

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  userImageBase64: string;
  imageFileExtension: string;
}
