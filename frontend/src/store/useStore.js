import {create} from 'zustand'

const useStore = create((set) => ({
    textPredictionsArray: [],
    audioPredictionsArray: [],
    videoPredictionsArray: [],
    setTextPredictions: (newArray) => set({textPredictionsArray: newArray}),
    setAudioPredictions: (newPrediction) => set((state)=>({
        audioPredictionsArray : [...state.audioPredictionsArray, newPrediction]
    })),
    setVideoPredictions: (newPrediction) => set((state)=>({
        videoPredictionsArray : [...state.videoPredictionsArray, newPrediction]
    })),
    resetArrays: () => set({textPredictionsArray:[], audioPredictionsArray:[], videoPredictionsArray:[]})
}))

export default useStore;