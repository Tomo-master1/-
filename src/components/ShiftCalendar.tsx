import React from 'react';
import { Staff } from '../types';

interface ShiftCalendarProps {
  staff: Staff[];
  assignments: {[key: string]: number[]};
}

const ShiftCalendar: React.FC<ShiftCalendarProps> = ({ staff, assignments }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const getDayOfWeek = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return new Intl.DateTimeFormat('ja-JP', { weekday: 'short' }).format(date);
  };

  const isWeekend = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isAssigned = (staffId: number, day: number) => {
    return assignments[staffId]?.includes(day) || false;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-gray-50">日付</th>
            {staff.map((member) => (
              <th key={member.id} className="p-2 border bg-gray-50">
                {member.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className={`p-2 border ${isWeekend(day) ? 'bg-red-50' : ''}`}>
                {day}日 ({getDayOfWeek(day)})
              </td>
              {staff.map((member) => (
                <td
                  key={member.id}
                  className={`p-2 border text-center ${isWeekend(day) ? 'bg-red-50' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isAssigned(member.id, day)}
                    onChange={() => {}} // Add empty onChange handler for controlled input
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-not-allowed"
                    disabled // Add disabled since it's read-only
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftCalendar;