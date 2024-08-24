import { Schema, model, Document } from 'mongoose';

interface ITaskOption extends Document {
  categories: string[];
  taskOptions: Object[];
}

const TaskOptionSchema = new Schema<ITaskOption>({
  categories: { type: [String], required: true },
  taskOptions: { type: [Object], required: true },
});

const TaskOptions = model<ITaskOption>('TaskOption', TaskOptionSchema);

export default TaskOptions ;
