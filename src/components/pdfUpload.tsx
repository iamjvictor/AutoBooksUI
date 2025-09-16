// src/components/onboarding/PdfUpload.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Check,UploadCloud, FileText, X } from "lucide-react";
import { createClient } from "@/clients/supabaseClient";



interface PdfUploadProps {
  onComplete: () => void;
}

interface UploadedFile {
  id: number;
  name: string;
  file_name: string;
  storage_path: string;
  created_at: string;
  user_id: string;
}

const MAX_FILES = 3;

export default function PdfUpload({ onComplete }: PdfUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<(File | UploadedFile)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    console.log(selectedFiles)
      async function fetchPdfs() {
        setIsLoading(true);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error("Usuário não autenticado.");
  
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/getdocuments`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` },
          });
  
          if (!response.ok) throw new Error("Falha ao buscar os quartos cadastrados.");
          
          const result = await response.json()
          console.log(result.data);
          setSelectedFiles(result.data || []);
        } catch (error) {
          console.error("Erro ao carregar quartos:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchPdfs();
    }, [supabase]); 

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

  const handleRemoveFile = async (indexToRemove: number) => {
    const fileToRemove = selectedFiles[indexToRemove];
    console.log("🗑️ [REMOVER ARQUIVO] Arquivo selecionado:", fileToRemove);
    
    // Verificar se é um arquivo enviado (UploadedFile) com ID
    if (!('id' in fileToRemove) || !fileToRemove.id) {
      console.error("❌ [ERRO] Arquivo inválido ou ID do arquivo não encontrado.");
      alert("Erro: Arquivo inválido ou ID não encontrado.");
      return;
    }

    const fileId = fileToRemove.id;
    const fileName = fileToRemove.file_name;
    console.log(`🗑️ [REMOVER ARQUIVO] ID: ${fileId}, Nome: ${fileName}`);

    // Remoção direta sem confirmação

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Usuário não autenticado.");        
      }

      console.log(`🔄 [REMOVER ARQUIVO] Enviando requisição DELETE para: ${process.env.NEXT_PUBLIC_API_URL}/uploads/document/${fileId}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/document/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Falha ao deletar o arquivo. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ [SUCESSO] Arquivo removido com sucesso:", result);

      // Atualiza o estado somente após a confirmação da API
      setSelectedFiles(prevFiles => {
        const newFiles = prevFiles.filter(file => !('id' in file) || file.id !== fileId);
        console.log(`📝 [ATUALIZAÇÃO] Lista atualizada: ${prevFiles.length} → ${newFiles.length} arquivos`);
        return newFiles;
      });

      // Arquivo removido com sucesso (sem alert)

    } catch (error) {
      console.error("❌ [ERRO] Falha ao deletar o arquivo:", error);
      alert(`❌ Erro ao deletar o arquivo "${fileName}":\n\n${error instanceof Error ? error.message : "Erro desconhecido. Tente novamente."}`);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert("Por favor, selecione pelo menos um arquivo PDF.");
      return;
    }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Usuário não autenticado.");

    const formData = new FormData();
    // Adiciona apenas arquivos do tipo File (não enviados ainda) ao FormData
    const filesToUpload = selectedFiles.filter((file): file is File => 'name' in file && !('id' in file));
    
    filesToUpload.forEach(file => {
        formData.append('pdfFile', file); 
    });

    // A URL do endpoint também foi para o plural
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/document`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
        body: formData,
    });

    if (!response.ok) {
          const errorData = await response.json();
          console.error('API retornou um erro:', errorData);
          // Lança um erro para ser pego pelo bloco 'catch'
          throw new Error(errorData.message || "Falha no upload do PDF.");
      }
      
      // Se chegamos aqui, o upload foi um sucesso!
    const successData = await response.json();

    console.log('--- 5. Upload bem-sucedido! ---', successData);
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
          {selectedFiles.map((file, index) => {
            const fileName = 'name' in file ? file.name : (file as UploadedFile).file_name;
            const canRemove = 'id' in file; // Só pode remover arquivos que já foram enviados (têm ID)
            
            return (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <span className="text-sm text-gray-800">{fileName}</span>
                  {!canRemove && <span className="text-xs text-gray-500">(Novo)</span>}
                </div>
                {canRemove ? (
                  <button onClick={() => handleRemoveFile(index)} className="p-1 text-red-600 hover:text-red-500 rounded-full hover:bg-red-100">
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
                    }} 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                    title="Remover arquivo não enviado"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
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