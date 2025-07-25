import { Schema, model, Document } from 'mongoose';
import { RutProcessResultEntity } from '../domain/rutProcessResult.entity';

export interface RutProcessResultDocument extends Omit<RutProcessResultEntity, '_id'>, Document {}

const rutProcessResultSchema = new Schema<RutProcessResultDocument>(
  {
    rut: {
      type: String,
      required: [true, 'RUT is required'],
      trim: true
    },
    createdBy: {
      type: String,
      required: [true, 'CreatedBy (Admin ID) is required'],
      ref: 'Admin'
    },
    data: {
      type: Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for better query performance
rutProcessResultSchema.index({ rut: 1 });
rutProcessResultSchema.index({ createdBy: 1 });
rutProcessResultSchema.index({ createdAt: -1 });
rutProcessResultSchema.index({ rut: 1, createdBy: 1 }); // Compound index

export const RutProcessResultModel = model<RutProcessResultDocument>('RutProcessResult', rutProcessResultSchema);
