"use client";

import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  // useEffect para fechar o toast automaticamente após 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // 2 segundos

    // Função de limpeza para cancelar o timer se o componente for desmontado
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const isError = type === 'error';

  // Estilização para garantir que ele flutue sobre todo o conteúdo
  const baseStyle = "fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 mb-4 w-full max-w-xs text-white rounded-lg shadow-lg";
  const colorStyle = isError ? 'bg-red-600' : 'bg-green-500';

  return (
    <div className={`${baseStyle} ${colorStyle}`} role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-white/20">
        {isError ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <CheckCircle className="w-5 h-5" />
        )}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-white/30 inline-flex items-center justify-center h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  );
}

