import mongoose, { Schema } from 'mongoose';

export const RedFoxFields = {
  name: {
    type: String,
    required: true,
    trim: true,
  },

  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED'],
  },

  owner_id: { type: Schema.Types.ObjectId, ref: 'User' },

  createdSource: String,
};

const RedFoxSchema = Schema(RedFoxFields, {
  timestamps: true,
});

RedFoxSchema.virtual('owner', {
  ref: 'User',
  localField: 'owner_id',
  foreignField: '_id',
  justOne: true,
});

RedFoxSchema.set('toJSON', { virtuals: true });

export default mongoose.model('RedFox', RedFoxSchema);
