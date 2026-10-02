import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    customerAge: {
      type: Number,
      required: [true, 'Customer age is required']
      // No minimum age restriction per user requirements
    },
    customerGender: {
      type: String,
      required: [true, 'Customer gender is required'],
      trim: true
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true
    },
    appointmentDate: {
      type: String, // Stored as "YYYY-MM-DD"
      required: [true, 'Appointment date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD']
    },
    tattooType: {
      type: String,
      required: [true, 'Tattoo type is required'],
      trim: true
    },
    durationHours: {
      type: Number,
      required: [true, 'Duration in hours is required'],
      min: [0.5, 'Duration must be at least 30 minutes']
      // No upper bound limit per user requirements to support longer sessions
    },
    startTime: {
      type: String, // "HH:mm" (e.g., "09:00", "14:00")
      required: [true, 'Start time is required'],
      match: [/^\d{2}:\d{2}$/, 'Start time must be formatted as HH:mm']
    },
    endTime: {
      type: String, // "HH:mm" (e.g., "11:00", "17:00")
      required: [true, 'End time is required'],
      match: [/^\d{2}:\d{2}$/, 'End time must be formatted as HH:mm']
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED'
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast conflict lookups by date and status
appointmentSchema.index({ appointmentDate: 1, status: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
