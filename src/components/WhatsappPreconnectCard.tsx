import React from 'react';
import { AlertTriangle } from 'lucide-react';

type WhatsappPreconnectCardProps = {
  title?: string;
  warnings: string[];
  onContinue: () => void;
  onCancel?: () => void;
  continueLabel?: string;
  cancelLabel?: string;
};

const WhatsappPreconnectCard: React.FC<WhatsappPreconnectCardProps> = ({
  title = 'Antes de continuar',
  warnings,
  onContinue,
  onCancel,
  continueLabel = 'Continuar',
  cancelLabel = 'Cancelar',
}) => {
  return (
    <div className="bg-white border border-white/10 rounded-2xl p-6 text-left w-full max-w-xl">
      <h3 className="text-2xl font-bold text-black">
        {title}
      </h3>
      <p className="text-black text-sm  mt-2">
        Leia com atenção os avisos abaixo antes de conectar ao WhatsApp Web.
      </p>

      <ul className="mt-6 space-y-3">
        {warnings.map((warning, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-yellow-400 mt-0.5">
              <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <span className="text-sm text-black">
              {warning}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-4 py-2 text-white font-medium hover:bg-teal-400 transition-colors"
        >
          {continueLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-slate-300 font-medium hover:bg-white/10 transition-colors"
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default WhatsappPreconnectCard;


