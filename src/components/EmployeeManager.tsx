import React, { useState } from 'react';
import { Plus, Trash2, Edit2, User, Save, X } from 'lucide-react';
import { Employee } from '../App';

interface EmployeeManagerProps {
  employees: Employee[];
  onAddEmployee: (name: string) => void;
  onUpdateEmployee: (id: string, name: string) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function EmployeeManager({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee
}: EmployeeManagerProps) {
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newEmployeeName.trim();
    if (trimmedName && trimmedName.length > 0) {
      onAddEmployee(trimmedName);
      setNewEmployeeName('');
    }
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdateEmployee(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-800">
          Gerenciar Funcionários
        </h2>
      </div>

      {/* Add Employee Form */}
      <form onSubmit={handleAdd} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="Nome do funcionário"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={!newEmployeeName.trim()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
              newEmployeeName.trim() 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </div>
      </form>

      {/* Employee List */}
      {employees.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            Nenhum funcionário cadastrado
          </h3>
          <p className="text-slate-500">
            Adicione o primeiro funcionário usando o formulário acima
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
            >
              {editingId === employee.id ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors duration-200"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-slate-500 hover:bg-slate-200 rounded-md transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {employee.dayOffs.length} folgas marcadas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(employee.id, employee.name)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(employee.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}