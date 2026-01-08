import { Request, Response } from 'express';
import Metric from '../models/Metric';
import Resume from '../models/Resume';
import User from '../models/User';
import Interview from '../models/Interview';
import CoverLetter from '../models/CoverLetter';

/**
 * @function getTotalMetrics
 * @description GET endpoint to retrieve all metrics where the key contains "TOTAL"
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getTotalMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find all documents where the key contains "TOTAL" (case-insensitive)
        const metrics = await Metric.find({
            key: { $regex: /TOTAL/i },
        }).select('key value description lastUpdated title icon -_id');

        // Transform the data into a more usable format
        const metricsObject: Record<string, any> = {};

        metrics.forEach(metric => {
            // Convert key to camelCase for easier frontend usage
            const key = metric.key.toLowerCase().replace(/_/g, '');
            metricsObject[key] = {
                key: metric.key,
                value: metric.value,
                description: metric.description,
                title: metric.title,
                icon: metric.icon,
                lastUpdated: metric.lastUpdated,
            };
        });

        // Return the metrics as JSON
        res.status(200).json({
            success: true,
            data: metricsObject,
            count: metrics.length,
        });
    } catch (error) {
        console.error('Error fetching total metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch metrics',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @function getAllMetrics
 * @description GET endpoint to retrieve all metrics (optional endpoint for debugging)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getAllMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const metrics = await Metric.find({}).select('key value description lastUpdated -_id');

        res.status(200).json({
            success: true,
            data: metrics,
            count: metrics.length,
        });
    } catch (error) {
        console.error('Error fetching all metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch all metrics',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @function updateMetric
 * @description POST endpoint to update or create a metric (for admin use)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const updateMetric = async (req: Request, res: Response): Promise<void> => {
    try {
        const { key, value, description, title } = req.body;

        // Validate required fields
        if (!key || typeof value !== 'number') {
            res.status(400).json({
                success: false,
                error: 'Key and value are required. Value must be a number.',
            });
            return;
        }

        // Use upsert to create or update the metric
        const metric = await Metric.findOneAndUpdate(
            { key },
            {
                key,
                value,
                description,
                title,
                lastUpdated: new Date(),
            },
            {
                upsert: true,
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            data: metric,
            message: 'Metric updated successfully',
        });
    } catch (error) {
        console.error('Error updating metric:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update metric',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @function getMetricsByKey
 * @description GET endpoint to retrieve a specific metric by key
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getMetricsByKey = async (req: Request, res: Response): Promise<void> => {
    try {
        const { key } = req.params;

        if (!key) {
            res.status(400).json({
                success: false,
                error: 'Key parameter is required',
            });
            return;
        }

        const metric = await Metric.findOne({ key }).select('key value description lastUpdated -_id');

        if (!metric) {
            res.status(404).json({
                success: false,
                error: 'Metric not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: metric,
        });
    } catch (error) {
        console.error('Error fetching metric by key:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch metric',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * @function getDateRangeMetrics
 * @description GET endpoint to retrieve metrics for a specific date range
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getDateRangeMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;

        // Validate date parameters
        if (!startDate || !endDate) {
            res.status(400).json({
                success: false,
                error: 'Start date and end date are required',
            });
            return;
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        // Validate date format
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            res.status(400).json({
                success: false,
                error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
            });
            return;
        }

        // Set end date to end of day
        end.setHours(23, 59, 59, 999);

        // Calculate edited resumes (modifiedAt > createdAt + 2 hours)
        const twoHoursInMs = 2 * 60 * 60 * 1000;

        // Perform various queries for different metrics
        const [
            newResumes,
            editedResumes,
            newInterviews,
            newCoverLetters,
            totalResumes,
            totalEditedResumes,
            totalInterviews,
            totalCoverLetters,
        ] = await Promise.all([
            // New items in date range
            Resume.countDocuments({ createdAt: { $gte: start, $lte: end } }),
            Resume.countDocuments({
                updatedAt: { $gte: start, $lte: end },
                createdAt: { $lt: start },
                $expr: {
                    $gt: [{ $subtract: ['$updatedAt', '$createdAt'] }, twoHoursInMs],
                },
            }),
            Interview.countDocuments({ createdAt: { $gte: start, $lte: end } }),
            CoverLetter.countDocuments({ createdAt: { $gte: start, $lte: end } }),

            // Total items (all time)
            Resume.countDocuments({}),
            Resume.countDocuments({
                $expr: {
                    $gt: [{ $subtract: ['$updatedAt', '$createdAt'] }, twoHoursInMs],
                },
            }),
            Interview.countDocuments({}),
            CoverLetter.countDocuments({}),
        ]);

        const metrics = {
            dateRange: {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0],
            },
            newItems: {
                resumes: newResumes,
                editedResumes: editedResumes,
                interviews: newInterviews,
                coverLetters: newCoverLetters,
            },
            totals: {
                resumes: totalResumes,
                editedResumes: totalEditedResumes,
                interviews: totalInterviews,
                coverLetters: totalCoverLetters,
            },
            growth: {
                resumes: totalResumes > 0 ? ((newResumes / totalResumes) * 100).toFixed(2) : '0',
                editedResumes: totalEditedResumes > 0 ? ((editedResumes / totalEditedResumes) * 100).toFixed(2) : '0',
                interviews: totalInterviews > 0 ? ((newInterviews / totalInterviews) * 100).toFixed(2) : '0',
                coverLetters: totalCoverLetters > 0 ? ((newCoverLetters / totalCoverLetters) * 100).toFixed(2) : '0',
            },
        };

        res.status(200).json({
            success: true,
            data: metrics,
        });
    } catch (error) {
        console.error('Error fetching date range metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch date range metrics',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
