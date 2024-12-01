import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { ProductDto } from '../dto/product.dto';

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const products = await Product.find();
      
      const productDtos: ProductDto[] = products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        quantity: product.quantity,
        categoryId: product.category._id.toString()
      }));
      res.json(productDtos);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching products', error });
    }
  }
}