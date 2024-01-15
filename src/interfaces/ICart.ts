export interface ICartAddRequest {
  id: number;
  category: 'product' | 'pack';
}

export interface ICartAdd {
  id: number;
  category: 'product' | 'pack';
  userId: number;
}
