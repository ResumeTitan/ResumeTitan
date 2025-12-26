import { Response, Request } from 'express';
import Workshop from '../models/Workshop';
import Resume from '../models/Resume';
import "dotenv/config";

/* Get all workshops */
export const getWorkshops = async (req: Request, res: Response) => {
  // @ts-ignore
  const clerkId = req.auth?.userId;
  try {
    if (!clerkId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const workshops = await Workshop.find({ clerkId }).sort({ updatedAt: -1 });
    res.status(200).json({ workshops });
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
};

/* Get workshop by id */
export const getWorkshop = async (req: Request, res: Response) => {
  const id = req.params.id;
  // @ts-ignore
  const clerkId = req.auth?.userId;
  
  try {
    if (!clerkId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const workshop = await Workshop.findOne({ _id: id, clerkId });
    
    if (!workshop) {
      return res.status(404).json({ msg: "Workshop not found" });
    }
    
    res.status(200).json({ workshop });
  } catch (err: any) {
    console.error('Error getting workshop:', err);
    res.status(500).json({ msg: err.message });
  }
};

/* Delete workshop by id */
export const deleteWorkshop = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const workshop = await Workshop.findOneAndDelete({ _id: id });
    res.status(200).json({ workshop });
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
};

/* Create new workshop */
export const createWorkshop = async (req: Request, res: Response) => {
  const { resumeId, name } = req.body;
  // @ts-ignore
  const clerkId = req.auth?.userId;

  try {
    if (!clerkId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (!resumeId) {
      return res.status(400).json({ msg: "resumeId is required" });
    }

    const resume = await Resume.findOne({ _id: resumeId, clerkId });
    if (!resume) {
      return res.status(404).json({ msg: "Resume not found" });
    }

    const workshopName = typeof name === 'string' && name.trim() ? name.trim() : resume.name || "Workshop";

    const workshop = await Workshop.create({ 
      name: workshopName,
      clerkId,
      resumeId
    });

    console.log("Created workshop", workshop);
    res.status(200).json({ workshop });
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
}
