export class ProductDto {
  id: string;
  name: string;
  quantity: number;
  categoryId: string;

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}

