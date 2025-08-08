import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangePickerProps) {
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    // Ajuste para o fuso horário local
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDayCount = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Ajuste para o fuso horário
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const setPresetRange = (days: number) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + days - 1);

    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-800">
          Período da Escala
        </h3>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {getDayCount()} dias
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-end justify-center sm:px-2">
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                min={startDate}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Período selecionado:</strong><br />
              {formatDateForDisplay(startDate)} até {formatDateForDisplay(endDate)}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Períodos Pré-definidos
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPresetRange(7)}
              className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors duration-200 border border-slate-300"
            >
              Esta Semana
            </button>
            <button
              onClick={() => setPresetRange(14)}
              className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors duration-200 border border-slate-300"
            >
              2 Semanas
            </button>
            <button
              onClick={() => setPresetRange(30)}
              className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors duration-200 border border-slate-300"
            >
              Este Mês
            </button>
            <button
              onClick={() => setPresetRange(60)}
              className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors duration-200 border border-slate-300"
            >
              2 Meses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}