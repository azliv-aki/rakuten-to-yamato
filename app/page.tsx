'use client';

import { useState, DragEvent, ChangeEvent } from 'react';
import { convertRakutenToYamato } from '@/lib/rakutenToYamato';
import { generateShippedCSV } from '@/lib/shippedData';
import { format } from 'date-fns';

export default function Home() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    const filename = file.name;

    try {
      setErrorMessage(null);

      if (filename.startsWith('RB')) {
        // 👉 RBファイルはAPI経由で.xlsx出力
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', filename);

        const response = await fetch('/api/download', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('ファイル変換に失敗しました');

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `rakuten-${format(new Date(), 'yyyyMMdd')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }

      if (filename.includes('発行済')) {
        // 👉 発行済データファイルは .csv(Shift-JIS) 出力
        const { filename: outputFilename, csvBuffer } = await generateShippedCSV(file);

        const blob = new Blob([csvBuffer], {
          type: 'text/csv;charset=shift_jis'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = outputFilename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      throw new Error('対応していないファイル形式です');
    } catch (err: any) {
      setErrorMessage(err.message || 'エラーが発生しました');
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center py-24 px-4">
      <div className="max-w-4xl">
         <h1 className="text-2xl font-bold text-center text-gray-600 mb-8">
          楽天送り状データ → ヤマトCSV 変換ツール
        </h1>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 max-w-2xl text-center bg-white shadow-md hover:bg-gray-50 transition"
        >
          <p className="text-lg text-gray-700 mb-4">
            CSVファイルをここにドロップするか、クリックして選択
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="cursor-pointer text-gray-600 mb-2"
          />
          {errorMessage && (
            <p className="text-red-600 font-semibold mt-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
