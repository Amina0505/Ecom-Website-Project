import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist';
import { AuthRequest } from '../types/custom';

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const wishlist = await Wishlist.findOne({ userId: req.user!._id });
    res.json({ items: wishlist?.items || [] });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { id, title, price, image, category, description, rating } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user!._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user!._id,
        items: []
      });
    }

    // Check if item already exists in wishlist
    const itemExists = wishlist.items.some(item => item.productId === id);
    if (itemExists) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    wishlist.items.push({
      productId: id,
      title,
      price,
      image,
      category,
      description,
      rating
    });

    await wishlist.save();
    res.status(200).json({ message: 'Item added to wishlist', wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const productId = req.params.productId;
    
    const wishlist = await Wishlist.findOne({ userId: req.user!._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(item => item.productId !== productId);
    await wishlist.save();

    res.json({ message: 'Item removed from wishlist', wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
}; 