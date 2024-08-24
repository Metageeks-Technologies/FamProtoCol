import mongoose, { Schema, Document, Model } from 'mongoose';

interface IGrants extends Document {
  title: string;
  description: string;
  logoUrl: string;
  organizer: string;
  prize: number;
}

const GrantSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  logoUrl: { type: String, required: true },
  organizer: { type: String, required: true },
  prize: { type: Number, required: true },
});

// Create a Model.
const Grant: Model<IGrants> = mongoose.model<IGrants>('Grant', GrantSchema);

export default Grant;
