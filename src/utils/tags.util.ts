export default class TagsUtil {
  public static formatTagsArrayWithIds(
    itemInfo: { tags: number[]; productId: number } | { tags: number[]; packId: number },
  ): Array<{ tagId: number; productId: number }> | Array<{ tagId: number; packId: number }> {
    const formattedArray = itemInfo.tags.map((tag) => {
      if ('productId' in itemInfo) {
        return {
          tagId: tag,
          productId: itemInfo.productId,
        };
      }
      if ('packId' in itemInfo) {
        return {
          tagId: tag,
          packId: itemInfo.packId,
        };
      }
      throw new Error('Array inválido');
    }) as Array<{ tagId: number; productId: number }> | Array<{ tagId: number; packId: number }>;

    return formattedArray;
  }

  public static formatTagsArrayWithName(tags: string[]) {
    const formattedArray = tags.map((tag) => ({
      name: tag,
    }));

    return formattedArray;
  }
}
