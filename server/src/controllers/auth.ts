import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * @function reloadUser
 * @param {Request} req 
 * @param {Response} res 
 * @returns Updated user
 */
export const reload = async (req: Request, res: Response): Promise<Response> => {
  try {
    // @ts-ignore
    const id = req.auth.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }
    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * @function forgotPassword
 * @description TODO do we need this for clerk
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} 
 */
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }
    // TODO send email with reset link
    return res.status(200).json({ msg: "Email sent." });
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
}

/**
 * @function handleClerk
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} 
 */
export const handleClerk = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data, type } = req.body;
    let savedUser;

    if (type === "user.created") {
      console.log(data);
      const newUser = new User({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.passwordHash,
      });
      savedUser = await newUser.save();
    } else if (type === "user.updated") {
      savedUser = await User.findOne({ clerkId: data.id });
      if (!savedUser) {
        return res.status(404).json({ msg: "User not found." });
      }
      // Update user logic here
    } else if (type === "user.deleted") {
      console.log(`Clerk user deleted: ${data}`);
      return res.status(200).json({ msg: "Clerk user deleted." });
    } else {
      return res.status(404).json({ msg: `Unknown type: ${type}` });
    }

    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET as string);

    return res.status(200).json({ token, user: savedUser, msg: "Clerk handled." });
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
}
