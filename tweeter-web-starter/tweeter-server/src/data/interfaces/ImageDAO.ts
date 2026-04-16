export interface ImageDAO {
  uploadImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
