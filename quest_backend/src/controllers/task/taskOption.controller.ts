import { Request, Response } from 'express';
import CommunityData from '../../models/admin/communityData';
import TaskOptions from '../../models/task/taskOption';

// Controller to get community details
export const getTaskOptions = async (req: Request, res: Response) => {
  try {
    const taskOptions = await TaskOptions.findOne();
    if (!taskOptions) {
      return res.status(404).json({ message: 'TaskOptions not found' });
    }
    res.status(200).json(taskOptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTaskOptions = async (req: Request, res: Response) => {
  // console.log("create task options",req.body);
    const {categories, taskOptions } = req.body;
    // console.log( req.body );
    try {
      const newTaskOptions = new TaskOptions({
        categories,
        taskOptions,
      });
  
      await newTaskOptions.save();
  
      res.status(201).json({ message: 'taskOptions created successfully', taskOptions: newTaskOptions });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Controller to update categories and taskOptions
export const updateTaskOptions = async (req: Request, res: Response) => {
  // console.log("update taskOptions",req.body);
  const { categories, taskOptions } = req.body;

  try {
    const taskOption = await TaskOptions.findOne();
    if (!taskOption) {
      return createTaskOptions(req, res);
    }

    taskOption.categories = categories;
    taskOption.taskOptions = taskOptions;

    await taskOption.save();
    res.status(200).json({ message: 'taskOptions updated successfully', taskOptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
