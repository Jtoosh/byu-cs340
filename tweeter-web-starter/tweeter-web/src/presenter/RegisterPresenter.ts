import { Buffer } from "buffer";
import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
  navigate: NavigateFunction;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  displayErrorMessage: (message: string) => void;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>,
  setImageFileExtension: React.Dispatch<React.SetStateAction<string>>
}

export class RegisterPresenter {
  private service: UserService;
  private view: RegisterView;
  private _isLoading: boolean;
  private imageBytes: Uint8Array<ArrayBufferLike>;


  public constructor(view: RegisterView) {
    this.service = new UserService();
    this.view = view;
    this._isLoading = false;
    this.imageBytes = new Uint8Array();
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFileExtension : string,
    rememberMe: boolean,
  ) {
    try {
      this._isLoading = true;

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        imageFileExtension,
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this._isLoading = false;
    }
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  }

  public get isLoading() {
    return this._isLoading;
  }
}
