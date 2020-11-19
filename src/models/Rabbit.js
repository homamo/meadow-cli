import mongoose, { Schema } from 'mongoose';

export const rabbitFields = {
  field: {
    type: String,
    required: true,
    trim: true,
  },

  owner_id: { type: Schema.Types.ObjectId, ref: 'User' },

  createdSource: String,
};

const RabbitSchema = Schema(rabbitFields, {
  timestamps: true,
});

RabbitSchema.virtual('owner', {
  ref: 'User',
  localField: 'owner_id',
  foreignField: '_id',
  justOne: true,
});

RabbitSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Rabbit', RabbitSchema);
