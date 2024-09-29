"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Image as ImageIcon, Mic, ChevronDown, User, Settings, HelpCircle, Trophy, MapPin } from 'lucide-react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

export default function Component() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [analysisStage, setAnalysisStage] = useState(0)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<google.maps.Map>()
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY"
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      // Simulate analysis process
      setTimeout(() => setAnalysisStage(1), 1000)
      setTimeout(() => setAnalysisStage(2), 2000)
      setTimeout(() => setAnalysisStage(3), 3000)
      setTimeout(() => setIsUploading(false), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F6] text-gray-900">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'h-16 bg-white/80 backdrop-blur-md shadow-md' : 'h-24'}`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-10 h-10 text-[#1E8449]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 12L10 15L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={`ml-2 font-bold text-xl transition-all duration-300 ${isScrolled ? 'text-[#1E8449]' : 'text-white'}`}>EcoSort</span>
          </div>
          <button className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${isScrolled ? 'bg-[#1E8449]/20' : ''}`}>
            <User className={`w-6 h-6 ${isScrolled ? 'text-[#1E8449]' : 'text-white'}`} />
          </button>
        </div>
      </header>

      <main className="pt-24">
        <div className="container mx-auto px-4">
          <section className="relative h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-center mb-8"
            >
              Revolutionize Your <br /> Waste Management
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md aspect-video bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <label
                htmlFor="file-upload"
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer border-4 border-dashed border-[#1E8449]/30 transition-all duration-300 hover:border-[#1E8449]"
              >
                <Upload className="w-12 h-12 text-[#1E8449] mb-4" />
                <span className="text-lg font-medium text-gray-600">Drop your image here or click to upload</span>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </motion.div>
          </section>

          <AnimatePresence>
            {isUploading && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="my-16"
              >
                <h2 className="text-2xl font-bold mb-8 text-center">AI Analysis in Progress</h2>
                <div className="flex justify-center items-center space-x-8">
                  {['Image Recognition', 'Trash Classification', 'Location Mapping'].map((stage, index) => (
                    <div key={stage} className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${index <= analysisStage ? 'bg-[#1E8449] text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {index === 0 && <ImageIcon className="w-8 h-8" />}
                        {index === 1 && <Upload className="w-8 h-8" />}
                        {index === 2 && <MapPin className="w-8 h-8" />}
                      </div>
                      <span className="mt-2 text-sm font-medium">{stage}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <section className="my-16">
            <h2 className="text-2xl font-bold mb-8">Analysis Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Trash Classification</h3>
                <div className="flex items-center justify-between mb-2">
                  <span>Burnable</span>
                  <span className="font-bold text-[#1E8449]">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#1E8449] h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Confidence Level</h3>
                <div className="flex items-center justify-between mb-2">
                  <span>Accuracy</span>
                  <span className="font-bold text-[#1E8449]">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#1E8449] h-2.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="my-16">
            <h2 className="text-2xl font-bold mb-8">Nearby Dumpsters</h2>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={{ lat: 35.6762, lng: 139.6503 }}
                zoom={14}
                onLoad={map => {
                  mapRef.current = map;
                  // 明示的に何も返さない
                }}
              >
                <Marker position={{ lat: 35.6762, lng: 139.6503 }} />
              </GoogleMap>
            ) : (
              <div>Loading map...</div>
            )}
          </section>
        </div>
      </main>

      <AnimatePresence>
        {isSidePanelOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50"
          >
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <ul className="space-y-2">
                <li>
                  <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </li>
                <li>
                  <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100">
                    <HelpCircle className="w-5 h-5" />
                    <span>Help & Support</span>
                  </button>
                </li>
                <li>
                  <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100">
                    <Trophy className="w-5 h-5" />
                    <span>Environmental Score</span>
                  </button>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-[#1E8449] rounded-full shadow-lg flex items-center justify-center text-white z-50"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </div>
  )
}