import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Custom Card components to replace the imported ones
const Card = ({ children, className }) => (
  <div className={`rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

// Color palette with better contrast for data visualization
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#6366F1"];

// Updated text data - using standardized emotion categories
const textData = [
  { name: "Anxiety", value: 15 },
  { name: "Depression", value: 28 },
  { name: "Anger", value: 10 },
  { name: "Fear", value: 13 },
  { name: "Joy", value: 11 },
  { name: "Sadness", value: 17 },
  { name: "Neutral", value: 14 }
];

// Updated audio data
const audioData = [
  { name: "Anger", value: 14 },
  { name: "Disgust", value: 10 },
  { name: "Fear", value: 12 },
  { name: "Joy", value: 16 },
  { name: "Neutral", value: 20 },
  { name: "Surprise", value: 11 },
  { name: "Sadness", value: 17 }
];

// Updated video data
const videoData = [
  { name: "Anger", value: 12 },
  { name: "Contempt", value: 8 },
  { name: "Disgust", value: 9 },
  { name: "Fear", value: 11 },
  { name: "Joy", value: 14 },
  { name: "Neutral", value: 20 },
  { name: "Sadness", value: 15 },
  { name: "Surprise", value: 11 }
];

const ModalityCard = ({ title, pieData, info }) => {
  const [view, setView] = useState("pie");
  
  return (
    <Card className="w-full bg-zinc-800 text-white border border-zinc-700">
      <CardContent>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setView("pie")}
              className={"px-3 py-1 rounded text-sm"}
              style={(view === "pie") ? {backgroundColor : '#4949ec'} : {backgroundColor : 'black'} }
              >
              Pie
            </button>
            <button 
              onClick={() => setView("bar")}
              className={"px-3 py-1 rounded text-sm"}
              style={(view === "bar") ? {backgroundColor : '#4949ec'} : {backgroundColor : 'black'} }
            >
              Bar
            </button>
          </div>
        </div>
        
        <p className="text-sm text-zinc-400 mb-3">{info}</p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {view === "pie" ? (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                  labelLine={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: 0 }}
                />
              </PieChart>
            ) : (
              <BarChart data={pieData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                <YAxis tick={{ fill: '#ccc' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" name="Percentage" fill="#3B82F6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MultimodalDashboard() {
  return (
    <div className="h-full w-screen bg-zinc-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Multimodal Emotion Analytics Dashboard</h1>
          <p className="text-zinc-400">Analyzing emotional patterns across text, audio, and video data sources</p>
        </header>
        
        {/* Fixed grid layout to show 2 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ModalityCard
            title="Text Analysis"
            pieData={textData}
            info="Emotional content detected in text conversations and messages"
          />
          <ModalityCard
            title="Audio Analysis"
            pieData={audioData}
            info="Emotional tones detected in voice recordings and audio streams"
          />
        </div>
        
        {/* Separate row for the third card */}
        <div className="flex justify-center">
  <div className="w-full md:w-[50%]">
    <ModalityCard
      title="Video Analysis"
      pieData={videoData}
      info="Facial expressions and emotions detected in video content"
    />
  </div>
</div>

        
        {/* <footer className="mt-8 pt-4 border-t border-zinc-800 text-zinc-500 text-sm">
          <p>Last updated: April 18, 2025 | Total samples analyzed: 986</p>
        </footer> */}
      </div>
    </div>
  );
}