import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { ProductDto } from '../dto/product.dto';
import { Log } from '../models/log.model';
import { LogEvent } from '../types/log';
import { AuthRequest } from '../types/authRequest';
import { Category } from '../models/category.model';

export class ProductController {
  public async getProducts(req: Request, res: Response) {
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

  public async createProduct(req: AuthRequest, res: Response) {
    try {
      const { name, categoryId } = req.query;
      if (!name || !categoryId) {
        res.status(400).json({ message: 'Name and categoryId query parameters are required' });
      }

      const product = new Product({
        name,
        category: categoryId,
        quantity: 0
      });

      const category = await Category.findById(categoryId);
      await Log.create({
        event: LogEvent.PRODUCT_CREATE,
        user: req.user.id,
        product: {
          id: product._id,
          name: product.name
        },
        category: {
          id: category._id,
          name: category.name
        }
      });

      const productDto = new ProductDto({
        id: product._id.toString(),
        name: product.name,
        quantity: product.quantity,
        categoryId: product.category.toString()
      });
      res.status(201).json(productDto);
    } catch (error) {
      res.status(400).json({ message: 'Error creating product', error });
    }
  }

  public async updateQuantity(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.query;
      if (id && (!quantity || isNaN(Number(quantity)))) {
        res.status(400).json({ message: 'Valid quantity query parameter and ID are required' });
      }

      const product = await Product.findById(id);

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      }

      const oldQuantity = product.quantity;
      product.quantity = Number(quantity);
      await product.save();

      await Log.create({
        event: LogEvent.PRODUCT_UPDATE,
        user: req.user.id,
        product: {
          id: product._id,
          name: product.name
        },
        details: `Quantity updated to ${product.quantity}, was ${oldQuantity}`
      });

      res.status(200).end();
    } catch (error) {
      res.status(400).json({ message: 'Error updating product quantity', error });
    }
  }

  public async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      }

      await Log.create({
        event: LogEvent.PRODUCT_DELETE,
        user: req.user.id,
        product: {
          id: product._id,
          name: product.name
        }
      });

      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: 'Error deleting product', error });
    }
  }
}