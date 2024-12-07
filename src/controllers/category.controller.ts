import { CatrgoryDto } from "../dto/category.dto";
import { Category } from "../models/category.model";
import { Request, Response } from 'express';

export class CategoryController {
  public async getCategories(req: Request, res: Response) {
    try {
      const categories = await Category.find();
      
      const cateogoryDtos: CatrgoryDto[] = categories.map(category => ({
        id: category._id.toString(),
        name: category.name,
      }));
      res.json(cateogoryDtos);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching categories', error });
    }
  }

  public async createCategory(req: Request, res: Response) {
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
        name: newCategory.name
      });
    } catch (error) {
      res.status(400).json({ message: 'Error creating category', error });
    }
  }

  public async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedCategory = await Category.findByIdAndDelete(id);
      
      if (!deletedCategory) {
        res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).end();
    } catch (error) {
      res.status(400).json({ message: 'Error deleting category', error });
    }
  }
}