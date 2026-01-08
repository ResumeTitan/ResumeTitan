import { Request, Response, NextFunction } from 'express';

export const timeout = (seconds: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.setTimeout(seconds * 1000, () => {
            res.status(408).json({ error: 'Request timeout' });
        });
        next();
    };
};
