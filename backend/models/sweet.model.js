import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema({
  sweetName: {
    type: String,
    required: [true, 'Sweet name is required'],
    trim: true,
    minlength: [2, 'Sweet name must be at least 2 characters long'],
    maxlength: [100, 'Sweet name cannot exceed 100 characters']
  },
  sweetCategory: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    lowercase: true,
    enum: {
      values: ['chocolate', 'candy', 'gummy', 'lollipop', 'hard candy', 'sour', 'mint', 'other'],
      message: '{VALUE} is not a valid category'
    }
  },
  sweetPrice: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [10000, 'Price cannot exceed 10000'],
    set: (value) => Math.round(value * 100) / 100 // Round to 2 decimal places
  },
  sweetQuantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  sweetDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  sweetImageUrl: {
    type: String,
    trim: true,
    default: 'https://via.placeholder.com/300x200?text=Sweet+Image',
    validate: {
      validator: function(v) {
        // Basic URL validation
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  sweetFeatured: {
    type: Boolean,
    default: false
  },
  sweetRating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  sweetIsAvailable: {
    type: Boolean,
    default: true
  },
  sweetCreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sweetLastRestockedAt: {
    type: Date
  }
}, {
  timestamps: true 
});

export const Sweet = mongoose.models.Sweet || mongoose.model('Sweet', sweetSchema);