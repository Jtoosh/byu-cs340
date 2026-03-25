import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  private imageBytes: Uint8Array;

  public constructor(view: RegisterView) {
    super(view);
    this.imageBytes = new Uint8Array();
  }
  public get isLoading(): boolean {
    return super.isLoading;
  }

  public set isLoading(value: boolean) {
    super.isLoading = value;
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
      await this.doAuth(async () => {
        return await this.service.register(
          firstName,
          lastName,
          alias,
          password,
          this.imageBytes,
          imageFileExtension,
        );
      }, rememberMe);
    }, "register user");
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
}
