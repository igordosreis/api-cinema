import { SUPERAPP_CINEMA_BASE_URL } from '../constants';

interface IImageFormat {
  imageName: string | null | undefined;
  folderPath?: string;
  imageType?: string;
}

export default class ImageFormatter {
  public static formatUrl({ imageName, folderPath = '', imageType }: IImageFormat) {
    const isImageNameNotFound = !imageName;
    if (isImageNameNotFound) {
      if (imageType === 'logo') return 'default-logo-url';
      if (imageType === 'cover') return 'default-cover-url';
    }
 
    const imageUrl = `${SUPERAPP_CINEMA_BASE_URL}/images${folderPath}/${imageName}`;

    return imageUrl;
  }
}
