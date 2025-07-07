import mongoose from 'mongoose';

// Define the Metric interface
interface Metric {
    key: string;
    value: number;
    title: string;
    description?: string;
    icon?: string;
    lastUpdated?: Date;
}

// Create a schema for the metrics collection
const MetricSchema = new mongoose.Schema<Metric>({
    key: { type: String, required: true, index: true },
    value: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String },
    description: { type: String },
    lastUpdated: { type: Date, default: Date.now }
});

// Create the model
const Metric = mongoose.model<Metric>('Metric', MetricSchema);
export default Metric;
