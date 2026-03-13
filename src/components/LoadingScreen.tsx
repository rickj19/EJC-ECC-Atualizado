import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingScreen({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
        <p className="text-stone-500 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}
