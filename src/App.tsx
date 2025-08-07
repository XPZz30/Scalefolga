import React, { useState, useMemo } from 'react';
import { Calendar, Users, Download, Plus, Trash2, Edit2, Save, FolderOpen } from 'lucide-react';
import EmployeeManager from './components/EmployeeManager';
import ScheduleTable from './components/ScheduleTable';
import DateRangePicker from './components/DateRangePicker';

export interface Employee {
  id: string;
  name: string;
  dayOffs: string[]; // Array de datas no formato 'YYYY-MM-DD'
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [];
  });
  const [startDate, setStartDate] = useState<string>(
    localStorage.getItem('startDate') || new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    localStorage.getItem('endDate') || new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'employees' | 'schedule'>('employees');

  const dateRange = useMemo(() => {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  }, [startDate, endDate]);

  const addEmployee = (name: string) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name,
      dayOffs: []
    };
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const updateEmployee = (id: string, name: string) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === id ? { ...emp, name } : emp
    );
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const deleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const toggleDayOff = (employeeId: string, date: string) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        const dayOffs = emp.dayOffs.includes(date)
          ? emp.dayOffs.filter(d => d !== date)
          : [...emp.dayOffs, date];
        return { ...emp, dayOffs };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const exportToCSV = () => {
    let csv = 'Funcionário,' + dateRange.map(date => 
      new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    ).join(',') + '\n';
    
    employees.forEach(employee => {
      csv += employee.name + ',' + dateRange.map(date => 
        employee.dayOffs.includes(date) ? 'FOLGA' : ''
      ).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'escala_folgas.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const saveSchedule = () => {
    const scheduleData = {
      employees,
      startDate,
      endDate,
      savedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(scheduleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `escala_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadSchedule = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const scheduleData = JSON.parse(e.target?.result as string);
        if (scheduleData.employees && scheduleData.startDate && scheduleData.endDate) {
          setEmployees(scheduleData.employees);
          setStartDate(scheduleData.startDate);
          setEndDate(scheduleData.endDate);
          localStorage.setItem('employees', JSON.stringify(scheduleData.employees));
          localStorage.setItem('startDate', scheduleData.startDate);
          localStorage.setItem('endDate', scheduleData.endDate);
          alert('Escala carregada com sucesso!');
        } else {
          alert('Arquivo inválido!');
        }
      } catch (error) {
        alert('Erro ao carregar arquivo!');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    localStorage.setItem('startDate', date);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    localStorage.setItem('endDate', date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800">
              Escala de Folgas
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Gerencie as folgas da sua equipe de forma simples e organizada
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="mb-8">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'employees'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Users className="h-4 w-4" />
              Funcionários
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Escala
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {activeTab === 'schedule' && employees.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            )}
            
            <button
              onClick={saveSchedule}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Save className="h-4 w-4" />
              Salvar Escala
            </button>
            
            <label className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
              <FolderOpen className="h-4 w-4" />
              Carregar Escala
              <input
                type="file"
                accept=".json"
                onChange={loadSchedule}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {activeTab === 'employees' ? (
            <EmployeeManager
              employees={employees}
              onAddEmployee={addEmployee}
              onUpdateEmployee={updateEmployee}
              onDeleteEmployee={deleteEmployee}
            />
          ) : (
            <ScheduleTable
              employees={employees}
              dateRange={dateRange}
              onToggleDayOff={toggleDayOff}
            />
          )}
        </div>

        {activeTab === 'schedule' && employees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              Nenhum funcionário cadastrado
            </h3>
            <p className="text-slate-500 mb-6">
              Adicione funcionários na aba "Funcionários" para começar a gerenciar a escala
            </p>
            <button
              onClick={() => setActiveTab('employees')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              Cadastrar Funcionários
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;