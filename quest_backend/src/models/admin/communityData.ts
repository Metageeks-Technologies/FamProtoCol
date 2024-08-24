import { Schema, model, Document } from 'mongoose';

interface ICategory {
  _id?: Schema.Types.ObjectId;
  name: string;
  imageUrl: string;
}

interface IEcosystem {
  _id?: Schema.Types.ObjectId;
  name: string;
  imageUrl: string;
}

interface ICommunity extends Document {
  categories: ICategory[];
  ecosystems: IEcosystem[];
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const ecosystemSchema = new Schema<IEcosystem>({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const communitySchema = new Schema<ICommunity>({
  categories: { type: [categorySchema], required: true },
  ecosystems: { type: [ecosystemSchema], required: true },
});

const CommunityData = model<ICommunity>('CommunityData', communitySchema);

export default CommunityData;