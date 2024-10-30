import React from 'react';
import { ClipboardCheck, ClipboardList, Calendar, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const HomePage = () => {
  const statsData = [
    {
      title: "Total Completed Surveys",
      value: "2,465",
      icon: ClipboardCheck,
      color: "blue"
    },
    {
      title: "Total Pending Surveys",
      value: "145",
      icon: ClipboardList,
      color: "red"
    },
    {
      title: "Monthly Survey Count",
      value: "856",
      icon: Calendar,
      color: "green"
    },
    {
      title: "Last 7 Days Surveys",
      value: "234",
      icon: Clock,
      color: "orange"
    }
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: {
        bg: "bg-blue-600",
        light: "bg-blue-50",
      },
      red: {
        bg: "bg-red-600",
        light: "bg-red-50",
      },
      green: {
        bg: "bg-green-600",
        light: "bg-green-50",
      },
      orange: {
        bg: "bg-orange-600",
        light: "bg-orange-50",
      }
    };
    return classes[color];
  };


  const latestSurveys = [
    { name: "Public Healthcare Survey 2024", date: "28 Oct 2024" },
    { name: "Education Infrastructure Assessment", date: "27 Oct 2024" },
    { name: "Rural Development Survey", date: "26 Oct 2024" },
    { name: "Urban Transportation Survey", date: "25 Oct 2024" },
    { name: "Water Resources Management", date: "24 Oct 2024" }
  ];

  const completionStatus = [
    { name: "Education Service Survey", status: "Complete" },
    { name: "Healthcare Assessment 2024", status: "Complete" },
    { name: "Rural Infrastructure Review", status: "Complete" },
    { name: "Urban Development Plan", status: "Complete" },
    { name: "Water Resource Survey", status: "Complete" }
  ];

  const dailySurveyData = [
    { day: "Monday", count: 15 },
    { day: "Tuesday", count: 15 },
    { day: "Wednesday", count: 20 },
    { day: "Thursday", count: 20 },
    { day: "Friday", count: 10 },
    { day: "Saturday", count: 10 },
    { day: "Sunday", count: 10 }
  ];

  const barColors = {
    Monday: '#ff0000',    // Red
    Tuesday: '#ff7f00',   // Orange
    Wednesday: '#ffff00', // Yellow
    Thursday: '#00ff00',  // Green
    Friday: '#0000ff',    // Blue
    Saturday: '#4B0082',  // Indigo
    Sunday: '#8B00FF'     // Violet
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Latest Surveys and Completion Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Latest Surveys */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Latest Surveys
            </h2>
            <div className="space-y-3">
              {latestSurveys.map((survey, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{survey.name}</span>
                  <span className="text-sm text-gray-500">{survey.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Completion Status
            </h2>
            <div className="space-y-3">
              {completionStatus.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Daily Survey Count
          </h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySurveyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {dailySurveyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[entry.day]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;