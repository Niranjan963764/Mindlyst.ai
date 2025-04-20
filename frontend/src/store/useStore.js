import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
    persist(
        (set) => ({
            textPredictionsArray: [],
            audioPredictionsArray: [],
            videoPredictionsArray: [],
            setTextPredictions: (newArray) => set({ textPredictionsArray: newArray }),
            setAudioPredictions: (newPrediction) => set((state) => ({
                audioPredictionsArray: [...state.audioPredictionsArray, newPrediction]
            })),
            setVideoPredictions: (newPrediction) => set((state) => ({
                videoPredictionsArray: [...state.videoPredictionsArray, newPrediction]
            })),
            resetArrays: () => {
                set({
                    textPredictionsArray: [],
                    audioPredictionsArray: [],
                    videoPredictionsArray: []
                }), 
                sessionStorage.removeItem('test-session')}
        }), {
        name: 'test-session',
        getStorage: () => sessionStorage,
    }
    ))

export default useStore;