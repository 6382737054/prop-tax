import React from 'react';
import { ClipboardCheck, ClipboardList, Calendar, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import surveyData from './surveyData.json';

const HomePage = () => {
  // Calculate total surveys
  const totalSurveys = surveyData.stats.totalCompleted + surveyData.stats.totalPending;
  
  const statsData = [
    {
      title: "Total Surveys",
      value: totalSurveys.toLocaleString(),
      icon: CheckCircle,
      color: "purple",
      subStats: [
        {
          label: "Completed",
          value: surveyData.stats.totalCompleted.toLocaleString(),
          percentage: ((surveyData.stats.totalCompleted / totalSurveys) * 100).toFixed(1)
        },
        {
          label: "Pending",
          value: surveyData.stats.totalPending.toLocaleString(),
          percentage: ((surveyData.stats.totalPending / totalSurveys) * 100).toFixed(1)
        }
      ]
    },
    {
      title: "Monthly Survey Count",
      value: surveyData.stats.monthlySurveys.toLocaleString(),
      icon: Calendar,
      color: "blue"
    },
    {
      title: "Last 7 Days Surveys",
      value: surveyData.stats.lastSevenDays.toLocaleString(),
      icon: Clock,
      color: "cyan"
    }
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: {
        bg: "bg-blue-600",
        light: "bg-blue-50",
        text: "text-blue-600"
      },
      purple: {
        bg: "bg-purple-600",
        light: "bg-purple-50",
        text: "text-purple-600"
      },
      cyan: {
        bg: "bg-cyan-600",
        light: "bg-cyan-50",
        text: "text-cyan-600"
      }
    };
    return classes[color];
  };

  // Pastel blue colors for the bar chart
  const barColors = [
    '#E3F2FD', // Lightest blue
    '#BBDEFB',
    '#90CAF9',
    '#64B5F6',
    '#42A5F5',
    '#2196F3',
    '#1E88E5'  // Darkest blue
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Survey Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of all survey activities and metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {statsData.map((stat, index) => {
            const colorClasses = getColorClasses(stat.color);
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className={`h-1 ${colorClasses.bg}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${colorClasses.light}`}>
                      <Icon className={`h-6 w-6 ${colorClasses.bg} text-white`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  
                  {/* Sub-stats for Total Surveys */}
                  {stat.subStats && (
                    <div className="mt-4 space-y-3">
                      {stat.subStats.map((subStat, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {idx === 0 ? (
                              <ClipboardCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <ClipboardList className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-600">{subStat.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-700">{subStat.value}</span>
                            <span className="ml-2 text-xs text-gray-500">({subStat.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Completed Surveys and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Completed Surveys
            </h2>
            <div className="space-y-4">
              {surveyData.districtData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-700">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Daily Survey Count
            </h2>
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={surveyData.dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickSize={6} tickFormatter={(value) => value.slice(0, 3)} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {surveyData.dailyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;