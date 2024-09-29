"use client";
import { Button } from "@/components/ui/button"
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import Map from '../api'; // '.tsx'を削除

const API_URL = 'http://localhost:8000'

interface AnalyzeRequest {
  file_path: string;
}

interface contains_moeru {
  class_name: string;
  bbox: number[];
}
interface DetectedObject {
  class_name: string;
  bbox: number[];
}

interface AnalyzeReturnValue {
  data: string;  // Base64エンコードされた画像データ
  contains_moeru: boolean;
  contains_moenai: boolean;

}


export default function ResultPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [containsMoeru, setContainsMoeru] = useState<boolean>(false);
  const [containsMoenai, setContainsMoenai] = useState<boolean>(false);
  const [analyzeResult, setAnalyzeResult] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const name = (searchParams.toString() ? `?${searchParams.toString()}` : '').replace(/[?=]/g, '');
    setResult(name)
    if (name) {
      setFileName(name);
      analyzeImage(name);
    }
  }, [searchParams]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/analyze/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setAnalyzeResult(result.analyzeResult);
            } else {
                console.error('Failed to analyze image');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

const analyzeImage = async (name: string) => {
  try {
    const response = await axios.post<AnalyzeReturnValue>(
      `${API_URL}/analyze`, 
      {
        file_path: "images/" + name
      } as AnalyzeRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    setImageData(`data:image/png;base64,${response.data.data}`);
    setContainsMoeru(response.data.contains_moeru);
    setContainsMoenai(response.data.contains_moenai);
    // もし API が検出されたオブジェクトの詳細情報を返す場合、それを設定します
    // 今回は簡略化のため、検出された場合に dummy データを設定します
    setDetectedObjects(response.data.contains_moeru || response.data.contains_moenai
      ? [{ class_name: "detected_object", bbox: [0, 0, 100, 100] }]
      : []);
    setResult('Image analysis completed successfully.');
  } catch (error) {
    console.error('Error analyzing image:', error);
    setResult('Failed to analyze the image. Please try again.');
  }
};

  const handleRedo = () => {
    if (fileName) {
      setResult(fileName);
      analyzeImage(fileName);
    }
  };

  const handleNext = () => {
    router.push('/');
  };

  return (
    
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-8 py-12">
      <div className="bg-background rounded-lg border p-4 w-full">
        <div className="aspect-video overflow-hidden rounded-md">
          {imageData ? (
            <img
              src={imageData}
              alt="Analyzed Image"
              width={600}
              height={400}
              className="object-contain w-full h-full"
            />
          ) : (
            <img
              src="/image/Download.jpg"
              alt="Placeholder Image"
              width={1200}
              height={900}
              className="object-contain w-full h-full"
            />
          )}
        </div>
      </div>
      <div className="bg-background rounded-lg border p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Result</h2>
        <div className="prose text-muted-foreground">
  <p>{result}</p>
  <p>Contains Moeru: {containsMoeru ? 'Yes' : 'No'}</p>
  <p>Contains Moenai: {containsMoenai ? 'Yes' : 'No'}</p>
  {
    <div className="flex justify-between w-full">
  <div className={`w-1/2 p-4 border-4 ${containsMoeru ? 'border-red-500 opacity-100' : 'border-red-200 opacity-20'}`}>
    <img
      src="/image/moeru.jpeg"
      alt="Moeru Trash"
      className="w-full h-64 object-contain" // サイズを調整
    />
    <p className="text-center mt-2 text-2xl font-bold">
      {containsMoeru ? 'Detection' : 'Not Detection'}
    </p>
  </div>
  <div className={`w-1/2 p-4 border-4 ${containsMoenai ? 'border-blue-500 opacity-100' : 'border-blue-200 opacity-50'}`}>
    <img
      src="/image/moenai.jpg"
      alt="Moenai Trash"
      className="w-full h-64 object-contain" // サイズを調整
    />
    <p className="text-center mt-2 text-2xl font-bold">
      {containsMoenai ? 'Detection' : 'Not Detection'}
    </p>
  </div>
</div>
}
</div>
{/* Google Maps */}
<div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Nearest Trash Bins</h2>
      <Map />
    </div>
  <div className="flex justify-between w-full">
  
  {detectedObjects.length > 0 && (
    <div>
      {/* <h3 className="text-xl font-semibold mt-4 mb-2">Detected Objects:</h3> */}
      {detectedObjects.map((obj, index) => (
        <div key={index}>
          {/* <p>{`Class: ${obj.class_name}, Bbox: [${obj.bbox.join(', ')}]`}</p> */}
        </div>
      ))}
    </div>
  )}
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={handleRedo}>Redo</Button>
          <Button onClick={handleNext}>Retry</Button>
        </div>
      </div>
    </div>
  );
}