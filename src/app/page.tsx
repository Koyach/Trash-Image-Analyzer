"use client"

import { useState, ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Menu, Upload, Image as ImageIcon, Trash2, MapPin, Moon, Sun } from 'lucide-react'

interface PostImageResponse {
  error_codes: number[];
  threshold?: number;
  classification?: string;
}

const API_URL = 'http://localhost:8000'

// Custom Switch component
const Switch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
  <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)} // 修正箇所
      disabled={disabled}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
)

const translations = {
  en: {
    title: "Trash Image Analyzer",
    tagline: "AI-powered waste sorting for a cleaner future",
    uploadText: "Drag and drop your image here, or click to select a file",
    supportedFormats: "Supported formats: JPG, PNG, GIF (max 5MB)",
    imageRecognition: "Image Recognition",
    imageRecognitionDesc: "Advanced AI image analysis",
    trashClassification: "Trash Classification",
    trashClassificationDesc: "Burnable vs Non-burnable",
    nearbyDumpsters: "Nearby Dumpsters",
    nearbyDumpstersDesc: "Find closest disposal locations",
    recentAnalyses: "Recent Analyses",
    pastPhotos: "Past Photos",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
  },
  ja: {
    title: "ゴミ画像分析AI",
    tagline: "AIを活用したゴミ分別で、よりクリーンな未来へ",
    uploadText: "ここに画像をドラッグ＆ドロップするか、クリックしてファイルを選択してください",
    supportedFormats: "対応フォーマット：JPG、PNG、GIF（最大5MB）",
    imageRecognition: "画像認識",
    imageRecognitionDesc: "高度なAI画像分析",
    trashClassification: "ゴミ分類",
    trashClassificationDesc: "燃えるゴミ vs 燃えないゴミ",
    nearbyDumpsters: "近くのゴミ箱",
    nearbyDumpstersDesc: "最寄りの廃棄場所を探す",
    recentAnalyses: "最近の分析",
    pastPhotos: "過去の写真",
    privacyPolicy: "プライバシーポリシー",
    termsOfUse: "利用規約",
  },
}

export default function Component() {
  const [image, setImage] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<PostImageResponse | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')
  const [recentAnalyses, setRecentAnalyses] = useState<string[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-green-50 text-gray-900'
  }, [isDarkMode])

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
      
    if (file) {
      setImage(file)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const postResponse = await axios.post<PostImageResponse>(`${API_URL}/post_image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log(postResponse);
        
        const file_path = file.name
        router.push(`/result?${file_path}`);
  
        if (postResponse.data.error_codes.length === 0) {
          setAnalysis(postResponse.data);
          setRecentAnalyses(prev => [file_path, ...prev.slice(0, 4)])
          router.push(`/result?${file_path}`);
        } else {
          console.error("Error uploading image:", postResponse.data.error_codes)
        }
      } catch (error) {
        console.error("Error handling image upload:", error)
      }
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-green-50 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center">
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
          {isMenuOpen && (
            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
              <div className="py-1" role="none">
                <a href="#" className="text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" tabIndex={-1} id="menu-item-0">{t.pastPhotos}</a>
              </div>
            </div>
          )}
        </div>
        <h1 className="text-5xl font-bold text-center text-black rounded-lg shadow-lg p-4" style={{ transform: 'translateX(2px)' }}>
  {t.title}
</h1>

        <div className="flex items-center space-x-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
          >
            <option value="en">EN</option>
            <option value="ja">JA</option>
          </select>
          <Switch
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <p className="text-center mb-8">{t.tagline}</p>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">{t.uploadText}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.supportedFormats}
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <ImageIcon className="mx-auto h-8 w-8 text-blue-500" />
            <h3 className="mt-2 font-semibold">{t.imageRecognition}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t.imageRecognitionDesc}</p>
          </div>
          <div>
            <Trash2 className="mx-auto h-8 w-8 text-green-500" />
            <h3 className="mt-2 font-semibold">{t.trashClassification}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t.trashClassificationDesc}</p>
          </div>
          <div>
            <MapPin className="mx-auto h-8 w-8 text-red-500" />
            <h3 className="mt-2 font-semibold">{t.nearbyDumpsters}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t.nearbyDumpstersDesc}</p>
          </div>
        </div>

        {recentAnalyses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">{t.recentAnalyses}</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {recentAnalyses.map((analysis, index) => (
                <div key={index} className="flex-shrink-0 w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 bg-gray-100 dark:bg-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
            <a href="#" className="hover:underline">{t.privacyPolicy}</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:underline">{t.termsOfUse}</a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}