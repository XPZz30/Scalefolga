import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Employee } from '../App';

interface ScheduleTableProps {
  employees: Employee[];
  dateRange: string[];
  onToggleDayOff: (employeeId: string, date: string) => void;
}

export default function ScheduleTable({
  employees,
  dateRange,
  onToggleDayOff
}: ScheduleTableProps) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    // Ajuste para fuso horário local
    const adjustedDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getDayOfWeek = (date: string) => {
    const d = new Date(date);
    // Ajuste para fuso horário local
    const adjustedDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[adjustedDate.getDay()];
  };

  const isWeekend = (date: string) => {
    const d = new Date(date);
    // Ajuste para fuso horário local
    const adjustedDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    return adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-800">
          Escala de Folgas
        </h2>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {dateRange.length} dias
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white border-r border-slate-300 p-3 text-left font-semibold text-slate-700 min-w-[160px]">
                Funcionário
              </th>
              {dateRange.map((date) => (
                <th
                  key={date}
                  className={`border border-slate-300 p-2 text-center font-medium text-xs min-w-[70px] ${isWeekend(date) ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'
                    }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500">
                      {getDayOfWeek(date)}
                    </span>
                    <span>
                      {formatDate(date)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="sticky left-0 bg-white border-r border-slate-300 p-3 font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">
                        {employee.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="truncate">{employee.name}</span>
                  </div>
                </td>
                {dateRange.map((date) => (
                  <td
                    key={date}
                    className={`border border-slate-300 p-1 text-center ${isWeekend(date) ? 'bg-red-50/30' : ''
                      }`}
                  >
                    <button
                      onClick={() => onToggleDayOff(employee.id, date)}
                      className={`w-full h-10 rounded-md font-medium text-xs transition-all duration-200 ${employee.dayOffs.includes(date)
                          ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
                          : 'bg-transparent hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                    >
                      {employee.dayOffs.includes(date) ? (
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>FOLGA</span>
                        </div>
                      ) : (
                        '+'
                      )}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length > 0 && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-700 mb-2">Legenda:</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-slate-600">Dia de folga</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-slate-600">Fim de semana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-slate-200 rounded"></div>
              <span className="text-slate-600">Dia de trabalho</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}