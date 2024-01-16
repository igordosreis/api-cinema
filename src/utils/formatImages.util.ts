import { SUPERAPP_CINEMA_BASE_URL } from '../constants';

interface IImageFormat {
  imageName: string;
  folderPath?: string;
}

export default class ImageFormatter {
  public static formatUrl({ imageName, folderPath = '' }: IImageFormat) {
    const imageUrl = `${SUPERAPP_CINEMA_BASE_URL}/images${folderPath}/${imageName}`;

    return imageUrl;
  }
}
