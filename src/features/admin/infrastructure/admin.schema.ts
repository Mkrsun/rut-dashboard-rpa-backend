import { Schema, model, Document } from 'mongoose';
import { AdminEntity, AdminRole } from '../domain/admin.entity';

export interface AdminDocument extends Omit<AdminEntity, '_id'>, Document {}

const adminSchema = new Schema<AdminDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
      type: String,
      enum: Object.values(AdminRole),
      default: AdminRole.ADMIN,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret._id = ret._id.toString();
        delete ret.__v;
        delete ret.password; // Never return password in JSON
        return ret;
      }
    }
  }
);

// Index for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ isActive: 1 });

export const AdminModel = model<AdminDocument>('Admin', adminSchema);
