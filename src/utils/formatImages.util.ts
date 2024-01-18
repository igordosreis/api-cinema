import { SUPERAPP_CINEMA_BASE_URL } from '../constants';

interface IImageFormat {
  imageName?: string | undefined;
  folderPath?: string;
}

export default class ImageFormatter {
  public static formatUrl({ imageName, folderPath = '' }: IImageFormat) {
    const imageUrl = imageName
      ? `${SUPERAPP_CINEMA_BASE_URL}/images${folderPath}/${imageName}`
      : 'defaultUrl';

    return imageUrl;
  }
}
