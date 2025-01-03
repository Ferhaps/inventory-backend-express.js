import { CatrgoryDto } from "../dto/category.dto";
import { Category } from "../models/category.model";
import { Request, Response } from 'express';
import { Log } from '../models/log.model';
import { LogEvent } from "../types/log";
import { AuthRequest } from "../types/authRequest";

export class CategoryController {
  public async getCategories(req: Request, res: Response) {
    try {
      const categories = await Category.find();
      
      const cateogoryDtos: CatrgoryDto[] = categories.map(category => ({
        id: category._id.toString(),
        name: category.name,
        createdAt: (category as any).createdAt,
        updatedAt: (category as any).updatedAt
      }));
      res.json(cateogoryDtos);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching categories', error });
    }
  }

  public async createCategory(req: AuthRequest, res: Response) {
    try {
      const { categoryName } = req.query;
      if (!categoryName || typeof categoryName !== 'string') {
        res.status(400).json({ message: 'Category name is required' });
      }

      const newCategory = new Category({
        name: categoryName,
        products: []
      });
      await newCategory.save();

      res.status(201).json({
        id: newCategory._id.toString(),
        name: newCategory.name,
        createdAt: (newCategory as any).createdAt,
        updatedAt: (newCategory as any).updatedAt
      });

      Log.create({
        event: LogEvent.CATEGORY_CREATE,
        user: req.user.id,
        category: {
          id: newCategory._id,
          name: newCategory.name
        }
      }).catch(err => console.error('Error creating category log:', err));
    } catch (error) {
      res.status(400).json({ message: 'Error creating category', error });
    }
  }

  public async deleteCategory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const deletedCategory = await Category.findByIdAndDelete(id);
      
      if (!deletedCategory) {
        res.status(404).json({ message: 'Category not found' });
      }

      res.status(201).end();

      Log.create({
        event: LogEvent.CATEGORY_DELETE,
        user: req.user.id,
        category: {
          id: deletedCategory._id,
          name: deletedCategory.name
        }
      }).catch(err => console.error('Error creating delete category log:', err));
    } catch (error) {
      res.status(400).json({ message: 'Error deleting category', error });
    }
  }
}