export class ProductDto {
	id: string = '';
	name: string = '';
	quantity: number = 0;
	categoryId: string = '';
	createdAt: string = '';
	updatedAt: string = '';

	constructor(partial: Partial<ProductDto>) {
		Object.assign(this, partial);
	}
}
