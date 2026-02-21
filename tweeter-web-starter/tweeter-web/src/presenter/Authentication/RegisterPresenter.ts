import { Buffer } from "buffer";
import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { Presenter } from "../Presenter";
import { View } from "../ViewInterfaces/View";

export interface RegisterView extends View{
  navigate: NavigateFunction;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  private service: UserService;

  private _isLoading: boolean;
  private imageBytes: Uint8Array;

  public constructor(view: RegisterView) {
    super(view);
    this.service = new UserService();
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
    imageFileExtension: string,
    rememberMe: boolean,
  ) {
    await this.doFailureReportingOperation(async () => {
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
    }, "register user");

    this._isLoading = false;
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
