import { Sweet } from '../models/sweet.model.js';


export async function getAllSweets(req, res) {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json({ sweets });
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ error: 'Failed to fetch sweets' });
  }
}

export async function searchSweets(req, res) {
  try {
    const { sweetName,sweetCategory, minsweetPrice, maxsweetPrice } = req.query;
    const query = {};

    if (sweetName) {
      query.sweetName = { $regex: sweetName, $options: 'i' };
    }

    if (sweetCategory) {
      query.sweetCategory = { $regex: sweetCategory, $options: 'i' };
    }

    if (minsweetPrice || maxsweetPrice) {
      query.sweetPrice = {};
      if (minsweetPrice) query.sweetPrice.$gte = Number(minsweetPrice);
      if (maxsweetPrice) query.sweetPrice.$lte = Number(maxsweetPrice);
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    res.json({ sweets, count: sweets.length });
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

export async function createSweet(req, res) {
  try {
    const { sweetName, sweetCategory, sweetPrice, sweetQuantity, sweetDescription, sweetImageUrl } = req.body;

    if (!sweetName || !sweetCategory || !sweetPrice || sweetQuantity === undefined) {
      return res.status(400).json({ error: 'Name, category, price, and quantity are required' });
    }

    if (sweetPrice < 0 || sweetQuantity < 0) {
      return res.status(400).json({ error: 'Price and quantity must be positive' });
    }

    const sweet = new Sweet({
      sweetName,
      sweetCategory,
      sweetPrice,
      sweetQuantity,
      sweetDescription,
      sweetImageUrl
    });

    await sweet.save();
    res.status(201).json({ message: 'Sweet created successfully', sweet });
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ error: 'Failed to create sweet' });
  }
}

export async function updateSweet(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.sweetPrice !== undefined && updates.sweetPrice < 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }

    if (updates.sweetQuantity !== undefined && updates.sweetQuantity < 0) {
      return res.status(400).json({ error: 'Quantity must be positive' });
    }

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({ message: 'Sweet updated successfully', sweet });
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ error: 'Failed to update sweet' });
  }
}

export async function deleteSweet(req, res) {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({ message: 'Sweet deleted successfully', sweet });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ error: 'Failed to delete sweet' });
  }
}

export async function purchaseSweet(req, res) {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.sweetQuantity <= 0) {
      return res.status(400).json({ error: 'Sweet is out of stock' });
    }

    sweet.sweetQuantity -= 1;
    await sweet.save();

    res.json({ 
      message: 'Purchase successful', 
      sweet,
      remainingQuantity: sweet.sweetQuantity
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
}

export async function restockSweet(req, res) {
  try {
    const { id } = req.params;
    const { sweetQuantity } = req.body;

    if (!sweetQuantity || sweetQuantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    sweet.sweetQuantity += Number(sweetQuantity);
    await sweet.save();

    res.json({ 
      message: 'Restock successful', 
      sweet,
      newQuantity: sweet.sweetQuantity
    });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ error: 'Restock failed' });
  }
}