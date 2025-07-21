import React, { useState, useEffect } from 'react';
import api from 'api/actions';
import 'styles/index.css';

interface MetricProps {
  number: number;
  label: string;
  icon: string;
}

const Metric: React.FC<MetricProps> = ({ number, label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`metric-${label.toLowerCase().replace(' ', '-')}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [label]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = number / steps;
      const stepDuration = duration / steps;

      let currentCount = 0;
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= number) {
          setCount(number);
          clearInterval(timer);
        } else {
          setCount(Math.floor(currentCount));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isVisible, number]);

  return (
    <div
      id={`metric-${label.toLowerCase().replace(' ', '-')}`}
      className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      data-aos="zoom-in"
      data-aos-delay={label === 'Resumes Created' ? 0 : label === 'Cover Letters' ? 200 : 400}
    >
      <div className="text-4xl mb-4 text-blue-600">
        {icon}
      </div>
      <div className="text-3xl font-bold text-neutral-900 mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-lg text-neutral-600 font-medium">
        {label}
      </div>
    </div>
  );
};

const Metrics: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({});

    // get metrics from server
    const getMetrics = async () => {
      const response = await api.get('/metrics/total');
      const data = await response.data;
      // Show resumes, cover letters, and interviews in that order
      const reorderedData = {
        Resumes: data.data.resumestotal,
        CoverLetters: data.data.coverletterstotal,
        Interviews: data.data.interviewstotal
      };

      setMetrics(reorderedData);
    };
  
    useEffect(() => {
      getMetrics();
    }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12" data-aos="fade-up">
        <h3 className="text-lg font-medium uppercase tracking-wide text-neutral-800 mb-4">
            Making a Difference, One Job at a Time
        </h3>
        <h2 className="text-4xl font-bold leading-tight tracking-wide text-neutral-900 xl:text-5xl mb-6">
            On a Mission to Simplify Job Seeking
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            We&apos;re a group driven by a simple goal: to make the job search less stressful and more successful. 
            With our AI-powered tools, we&apos;re helping job seekers everywhere take the next step 
            in their careers—faster, smarter, and with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {Object.entries(metrics).map(([key, metric]: [string, any]) => (
          <Metric
            key={key}
            number={metric.value}
            label={metric.title}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="600">
        <p className="text-sm text-neutral-500">
          *Numbers based on user activity and successful job placements
        </p>
      </div>
    </div>
  );
};

export default Metrics;
