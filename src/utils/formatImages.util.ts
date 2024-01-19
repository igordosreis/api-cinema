import { SUPERAPP_CINEMA_BASE_URL } from '../constants';

interface IImageFormat {
  imageName: string | null | undefined;
  folderPath?: string;
}

export default class ImageFormatter {
  public static formatUrl({ imageName, folderPath = '' }: IImageFormat) {
    const isImageNameNotFound = !imageName;
    if (isImageNameNotFound) {
      if (folderPath.includes('logo')) return 'default-logo-url';
      if (folderPath.includes('cover')) return 'default-cover-url';
    }
 
    const imageUrl = `${SUPERAPP_CINEMA_BASE_URL}/images${folderPath}/${imageName}`;

    return imageUrl;
  }
}
