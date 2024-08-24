import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../../models/admin/admin';
import exp from 'constants';

// Signup controller
export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const newAdmin = new Admin({ email, password});

    await newAdmin.save();

    res.status(200).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    // console.log("admin",admin);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // console.log("admin password",admin.password);
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashpassword",hashedPassword);
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY as string,{expiresIn:'1h'});

    res.status(200).json({ token,msg:"logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
