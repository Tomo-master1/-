import React, { useState } from 'react';
import { Plus, Trash2, User, Calendar } from 'lucide-react';
import { Staff, Skill } from '../types';

interface StaffListProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
}

const StaffList: React.FC<StaffListProps> = ({ staff, setStaff }) => {
  const [newStaffName, setNewStaffName] = useState('');
  const [newMaxShifts, setNewMaxShifts] = useState(5);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  
  const skillOptions: { value: Skill; label: string }[] = [
    { value: 'hall', label: 'ホール' },
    { value: 'kitchen', label: 'キッチン' },
    { value: 'leader', label: 'リーダー' },
  ];

  const addStaff = () => {
    if (newStaffName.trim()) {
      setStaff([
        ...staff,
        {
          id: Date.now(),
          name: newStaffName,
          maxShifts: newMaxShifts,
          skills: [],
          unavailableDays: [],
          preferences: {
            preferredDays: [],
            preferredShiftsCount: newMaxShifts
          }
        },
      ]);
      setNewStaffName('');
      setNewMaxShifts(5);
    }
  };

  const removeStaff = (id: number) => {
    setStaff(staff.filter((s) => s.id !== id));
    if (selectedStaff === id) {
      setSelectedStaff(null);
    }
  };

  const togglePreferredDay = (staffId: number, day: number) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const newPreferredDays = s.preferences.preferredDays.includes(day)
          ? s.preferences.preferredDays.filter(d => d !== day)
          : [...s.preferences.preferredDays, day];
        
        return {
          ...s,
          preferences: {
            ...s.preferences,
            preferredDays: newPreferredDays
          }
        };
      }
      return s;
    }));
  };

  const toggleSkill = (staffId: number, skill: Skill) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const newSkills = s.skills.includes(skill)
          ? s.skills.filter(sk => sk !== skill)
          : [...s.skills, skill];
        return { ...s, skills: newSkills };
      }
      return s;
    }));
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newStaffName}
          onChange={(e) => setNewStaffName(e.target.value)}
          placeholder="スタッフ名"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          value={newMaxShifts}
          onChange={(e) => setNewMaxShifts(parseInt(e.target.value))}
          min="1"
          max="31"
          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addStaff}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className={`p-4 rounded-md transition-colors ${
              selectedStaff === member.id ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <span className="font-medium">{member.name}</span>
                <span className="ml-2 text-sm text-gray-500">
                  (希望 {member.preferences.preferredDays.length} シフト)
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStaff(selectedStaff === member.id ? null : member.id)}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                </button>
                <button
                  onClick={() => removeStaff(member.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {skillOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleSkill(member.id, value)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    member.skills.includes(value)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-indigo-600 text-indigo-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {selectedStaff === member.id && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">シフト希望日を選択:</h4>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => togglePreferredDay(member.id, day)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        member.preferences.preferredDays.includes(day)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffList;