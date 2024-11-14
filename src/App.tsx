import React, { useState } from 'react';
import { Calendar, Users, Clock, Save } from 'lucide-react';
import StaffList from './components/StaffList';
import ShiftCalendar from './components/ShiftCalendar';
import ShiftRules from './components/ShiftRules';
import { Staff, ShiftRule } from './types';
import { generateShifts, generateAlternativeShifts } from './utils/shiftGenerator';

function App() {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: 1,
      name: '山田太郎',
      maxShifts: 5,
      skills: ['hall', 'leader'],
      unavailableDays: [],
      preferences: { preferredDays: [], preferredShiftsCount: 5 }
    },
    {
      id: 2,
      name: '佐藤花子',
      maxShifts: 4,
      skills: ['kitchen'],
      unavailableDays: [],
      preferences: { preferredDays: [], preferredShiftsCount: 4 }
    },
    {
      id: 3,
      name: '鈴木一郎',
      maxShifts: 3,
      skills: ['hall', 'kitchen'],
      unavailableDays: [],
      preferences: { preferredDays: [], preferredShiftsCount: 3 }
    },
  ]);

  const [rules, setRules] = useState<ShiftRule[]>([
    {
      id: 1,
      minStaff: 2,
      maxStaff: 4,
      dayType: 'weekday',
      requiredSkills: {
        friday: ['leader']
      }
    },
    {
      id: 2,
      minStaff: 3,
      maxStaff: 5,
      dayType: 'weekend'
    },
  ]);

  const [assignments, setAssignments] = useState<{[key: string]: number[]}>({});
  const [alternativeAssignments, setAlternativeAssignments] = useState<{[key: string]: number[]}>({});

  const handleGenerateShifts = () => {
    const today = new Date();
    const generatedAssignments = generateShifts(
      staff,
      rules,
      today.getFullYear(),
      today.getMonth()
    );
    setAssignments(generatedAssignments);

    const alternativeGeneratedAssignments = generateAlternativeShifts(
      staff,
      rules,
      today.getFullYear(),
      today.getMonth()
    );
    setAlternativeAssignments(alternativeGeneratedAssignments);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">シフトマスター</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
                <h2 className="ml-2 text-xl font-semibold text-gray-800">スタッフ管理</h2>
              </div>
              <StaffList staff={staff} setStaff={setStaff} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
                <h2 className="ml-2 text-xl font-semibold text-gray-800">シフトルール</h2>
              </div>
              <ShiftRules rules={rules} setRules={setRules} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">シフトカレンダー（通常）</h2>
                <button
                  onClick={handleGenerateShifts}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Save className="h-5 w-5 mr-2" />
                  シフト生成
                </button>
              </div>
              <ShiftCalendar staff={staff} assignments={assignments} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">シフトカレンダー（代替案）</h2>
              </div>
              <ShiftCalendar staff={staff} assignments={alternativeAssignments} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;