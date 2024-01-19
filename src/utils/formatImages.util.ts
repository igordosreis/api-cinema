import { SUPERAPP_CINEMA_BASE_URL } from '../constants';

interface IImageFormat {
  imageName: string | null | undefined;
  folderPath?: string;
}

export default class ImageFormatter {
  public static formatUrl({ imageName, folderPath = '' }: IImageFormat) {
    const isImageNameNotFound = !imageName;
    if (isImageNameNotFound) {
      if (folderPath.includes('logo')) {
        return `${SUPERAPP_CINEMA_BASE_URL}/images/logo/logo_default.png`;
      }
      if (folderPath.includes('cover')) {
        return `${SUPERAPP_CINEMA_BASE_URL}/images/cover/cover_default.png`;
      }
    }

    const imageUrl = `${SUPERAPP_CINEMA_BASE_URL}/images${folderPath}/${imageName}`;

    return imageUrl;
  }
}
