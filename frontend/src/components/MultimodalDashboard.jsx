import React, { useState, useEffect } from "react";
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
import useStore from '../store/useStore'; // Import your store
import { useNavigate } from 'react-router-dom';
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

// Static data kept for reference but commented out
/*
const textData = [
  { name: "Anxiety", value: 15 },
  { name: "Depression", value: 28 },
  { name: "Anger", value: 10 },
  { name: "Fear", value: 13 },
  { name: "Joy", value: 11 },
  { name: "Sadness", value: 17 },
  { name: "Neutral", value: 14 }
];

const audioData = [
  { name: "Anger", value: 14 },
  { name: "Disgust", value: 10 },
  { name: "Fear", value: 12 },
  { name: "Joy", value: 16 },
  { name: "Neutral", value: 20 },
  { name: "Surprise", value: 11 },
  { name: "Sadness", value: 17 }
];

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
*/

// use effect - when either we start a new test clear storage
// useEffect(()=>{},[])



// Helper function to count occurrences and convert to percentage
const processEmotionData = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return [];
  
  // Count occurrences of each emotion
  const counts = dataArray.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});
  
  // Convert to percentage
  const total = dataArray.length;
  const result = Object.entries(counts).map(([name, count]) => ({
    name,
    value: Math.round((count / total) * 100) // Converting to percentage
  }));
  
  return result;
};

const ModalityCard = ({ title, pieData, info, emptyMessage }) => {
  const [view, setView] = useState("pie");
  
  if (!pieData || pieData.length === 0) {
    return (
      <Card className="w-full bg-zinc-800 text-white border border-zinc-700">
        <CardContent>
          <h2 className="text-xl font-bold mb-3">{title}</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-zinc-400">{emptyMessage || "No data available"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
  // Get data from Zustand store
  const textPredictionsArray = useStore((state) => state.textPredictionsArray);
  const audioPredictionsArray = useStore((state) => state.audioPredictionsArray);
  const videoPredictionsArray = useStore((state) => state.videoPredictionsArray);
  const resetArrays = useStore((state) => state.resetArrays)
  
  // Process data for visualization
  const [processedTextData, setProcessedTextData] = useState([]);
  const [processedAudioData, setProcessedAudioData] = useState([]);
  const [processedVideoData, setProcessedVideoData] = useState([]);
  
  // Process store data whenever it changes
  useEffect(() => {
    setProcessedTextData(processEmotionData(textPredictionsArray));
    setProcessedAudioData(processEmotionData(audioPredictionsArray));
    setProcessedVideoData(processEmotionData(videoPredictionsArray));
  }, [textPredictionsArray, audioPredictionsArray, videoPredictionsArray]);
  
  // Use fallback data if store data is empty (optional)
  const fallbackToStaticData = false; // Set to true to use static data when store is empty
  
  const textData = processedTextData.length > 0 ? processedTextData : 
    (fallbackToStaticData ? [
      { name: "Anxiety", value: 15 },
      { name: "Depression", value: 28 },
      { name: "Anger", value: 10 },
      { name: "Fear", value: 13 },
      { name: "Joy", value: 11 },
      { name: "Sadness", value: 17 },
      { name: "Neutral", value: 14 }
    ] : []);
    
  const audioData = processedAudioData.length > 0 ? processedAudioData : 
    (fallbackToStaticData ? [
      { name: "Anger", value: 14 },
      { name: "Disgust", value: 10 },
      { name: "Fear", value: 12 },
      { name: "Joy", value: 16 },
      { name: "Neutral", value: 20 },
      { name: "Surprise", value: 11 },
      { name: "Sadness", value: 17 }
    ] : []);
    
  const videoData = processedVideoData.length > 0 ? processedVideoData : 
    (fallbackToStaticData ? [
      { name: "Anger", value: 12 },
      { name: "Contempt", value: 8 },
      { name: "Disgust", value: 9 },
      { name: "Fear", value: 11 },
      { name: "Joy", value: 14 },
      { name: "Neutral", value: 20 },
      { name: "Sadness", value: 15 },
      { name: "Surprise", value: 11 }
    ] : []);

      const navigate = useNavigate();

    const routeToNextPage = () => {
      resetArrays()
      navigate('/test')
  }

  return (
    <div className="h-full w-screen bg-zinc-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Multimodal Emotion Analytics Dashboard</h1>
          <p className="text-zinc-400">Analyzing emotional patterns across text, audio, and video data sources</p>
          <p className="text-sm text-zinc-500 mt-2">
            Samples analyzed: Text ({textPredictionsArray.length}), 
            Audio ({audioPredictionsArray.length}), 
            Video ({videoPredictionsArray.length})
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ModalityCard
            title="Text Analysis"
            pieData={textData}
            info="Emotional content detected in text conversations and messages"
            emptyMessage="No text emotion data available yet"
          />
          <ModalityCard
            title="Audio Analysis"
            pieData={audioData}
            info="Emotional tones detected in voice recordings and audio streams"
            emptyMessage="No audio emotion data available yet"
          />
        </div>
        
        <div className="flex justify-center">
          <div className="w-full md:w-[50%]">
            <ModalityCard
              title="Video Analysis"
              pieData={videoData}
              info="Facial expressions and emotions detected in video content"
              emptyMessage="No video emotion data available yet"
            />
          </div>
        </div>

        <div className="flex justify-center mb-10">
    <button
      onClick={routeToNextPage}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition mt-24"
    >
      Retake the Test
    </button>
  </div>
        
        <footer className="mt-8 pt-4 border-t border-zinc-800 text-zinc-500 text-sm">
          <p>Data updated in real-time | Session recording time: {new Date().toLocaleTimeString()}</p>
        </footer>
      </div>
    </div>
  );
}