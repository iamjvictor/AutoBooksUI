// src/components/onboarding/PdfUpload.tsx
"use client";

import React, { useState } from "react";
import { Check,UploadCloud, FileText, X } from "lucide-react";

interface PdfUploadProps {
  onComplete: () => void;
}

const MAX_FILES = 3;

export default function PdfUpload({ onComplete }: PdfUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (selectedFiles.length + newFiles.length > MAX_FILES) {
      alert(`Você pode enviar no máximo ${MAX_FILES} arquivos.`);
      return;
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert("Por favor, selecione pelo menos um arquivo PDF.");
      return;
    }

    // --- LÓGICA DE UPLOAD PARA O BACKEND ENTRA AQUI ---
    // Você fará um loop ou enviará todos os arquivos de uma vez
    console.log("Arquivos a serem enviados:", selectedFiles);

    onComplete();
  };

  return (
    <div className="text-center">
      <Check className="mx-auto h-12 w-12 text-teal-600" />
      <h1 className="text-2xl font-bold text-gray-900">Pagamento Aprovado!</h1>
      <p className="mt-1 text-gray-600 mb-8">
        Envie até 3 PDFs com as informações do seu negócio (cardápio, regras, etc).
      </p>

      {/* Lista de Arquivos Selecionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 mb-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                <span className="text-sm text-gray-800">{file.name}</span>
              </div>
              <button onClick={() => handleRemoveFile(index)} className="p-1 text-red-600 hover:text-red-500 rounded-full hover:bg-red-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Área de Upload (Dropzone) */}
      {selectedFiles.length < MAX_FILES && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mt-4 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${
            isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-900/25'
          }`}
        >
          <div className="text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-300" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-500">
                <span>Selecione os arquivos</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" multiple />
              </label>
              <p className="pl-1">ou arraste e solte aqui</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              {MAX_FILES - selectedFiles.length} {MAX_FILES - selectedFiles.length > 1 ? 'arquivos restantes' : 'arquivo restante'}.
            </p>
          </div>
        </div>
      )}

      {/* Botão de Finalizar */}
      <button
        onClick={handleSubmit}
        disabled={selectedFiles.length === 0}
        className="w-full flex justify-center py-3 px-4 mt-8 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed"
      >
        Avançar
      </button>
    </div>
  );
}