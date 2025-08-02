import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Description as ResumeIcon, 
  Person as UserIcon, 
  QuestionAnswer as InterviewIcon, 
  Mail as CoverLetterIcon,
  TrendingUp as GrowthIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { fetchDateRangeMetrics } from '../../api/actions';

interface MetricsData {
  dateRange: {
    start: string;
    end: string;
  };
  newItems: {
    resumes: number;
    editedResumes: number;
    interviews: number;
    coverLetters: number;
  };
  totals: {
    resumes: number;
    editedResumes: number;
    interviews: number;
    coverLetters: number;
  };
  growth: {
    resumes: string;
    editedResumes: string;
    interviews: string;
    coverLetters: string;
  };
}

const MetricsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Set default date range to last 30 days
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  const fetchMetrics = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchDateRangeMetrics(startDate, endDate);
      if (data.success) {
        setMetrics(data.data);
      } else {
        setError(data.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchMetrics();
    }
  }, [startDate, endDate]);

  const chartData = metrics ? [
    { name: 'Resumes', new: metrics.newItems.resumes, total: metrics.totals.resumes, growth: parseFloat(metrics.growth.resumes) },
    { name: 'Edited Resumes', new: metrics.newItems.editedResumes, total: metrics.totals.editedResumes, growth: parseFloat(metrics.growth.editedResumes) },
    { name: 'Interviews', new: metrics.newItems.interviews, total: metrics.totals.interviews, growth: parseFloat(metrics.growth.interviews) },
    { name: 'Cover Letters', new: metrics.newItems.coverLetters, total: metrics.totals.coverLetters, growth: parseFloat(metrics.growth.coverLetters) }
  ] : [];

  const MetricCard = ({ title, value, subtitle, icon: Icon, color }: {
    title: string;
    value: number | string;
    subtitle: string;
    icon: React.ComponentType<any>;
    color: string;
  }) => (
    <Card className="h-full">
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Metrics</h1>
          <p className="text-gray-600">Track your site's performance and growth over time</p>
        </div>

        {/* Date Range Selector */}
        <Card className="mb-6">
          <CardContent>
            <div className="flex items-center gap-4">
              <CalendarIcon className="text-gray-500" />
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={fetchMetrics}
                  disabled={loading}
                  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {metrics && (
          <>
            {/* Date Range Display */}
            <div className="mb-6">
              <p className="text-lg font-medium text-gray-700">
                Metrics for {new Date(metrics.dateRange.start).toLocaleDateString()} - {new Date(metrics.dateRange.end).toLocaleDateString()}
              </p>
            </div>

            {/* New Items Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="New Resumes"
                value={metrics.newItems.resumes}
                subtitle={`${metrics.growth.resumes}% of total`}
                icon={ResumeIcon}
                color="bg-blue-500"
              />
              <MetricCard
                title="Edited Resumes"
                value={metrics.newItems.editedResumes}
                subtitle={`${metrics.growth.editedResumes}% of total`}
                icon={UserIcon}
                color="bg-green-500"
              />
              <MetricCard
                title="New Interviews"
                value={metrics.newItems.interviews}
                subtitle={`${metrics.growth.interviews}% of total`}
                icon={InterviewIcon}
                color="bg-purple-500"
              />
              <MetricCard
                title="New Cover Letters"
                value={metrics.newItems.coverLetters}
                subtitle={`${metrics.growth.coverLetters}% of total`}
                icon={CoverLetterIcon}
                color="bg-orange-500"
              />
            </div>

            {/* Total Items Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Resumes"
                value={metrics.totals.resumes}
                subtitle="All time"
                icon={ResumeIcon}
                color="bg-blue-600"
              />
              <MetricCard
                title="Total Edited Resumes"
                value={metrics.totals.editedResumes}
                subtitle="All time"
                icon={UserIcon}
                color="bg-green-600"
              />
              <MetricCard
                title="Total Interviews"
                value={metrics.totals.interviews}
                subtitle="All time"
                icon={InterviewIcon}
                color="bg-purple-600"
              />
              <MetricCard
                title="Total Cover Letters"
                value={metrics.totals.coverLetters}
                subtitle="All time"
                icon={CoverLetterIcon}
                color="bg-orange-600"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* New Items Chart */}
              <Card>
                <CardHeader>
                  New Items in Date Range
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="new" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Growth Percentage Chart */}
              <Card>
                <CardHeader>
                  Growth Percentage
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="growth" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MetricsPage; 