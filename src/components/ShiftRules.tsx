import React from 'react';
import { ShiftRule } from '../types';

interface ShiftRulesProps {
  rules: ShiftRule[];
  setRules: React.Dispatch<React.SetStateAction<ShiftRule[]>>;
}

const ShiftRules: React.FC<ShiftRulesProps> = ({ rules, setRules }) => {
  const updateRule = (id: number, field: keyof ShiftRule, value: number | string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, [field]: typeof value === 'string' ? value : parseInt(value.toString()) } : rule
      )
    );
  };

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div key={rule.id} className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">
            {rule.dayType === 'weekday' ? '平日' : '週末'}のルール
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">最小人数</label>
              <input
                type="number"
                value={rule.minStaff}
                onChange={(e) => updateRule(rule.id, 'minStaff', e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">最大人数</label>
              <input
                type="number"
                value={rule.maxStaff}
                onChange={(e) => updateRule(rule.id, 'maxStaff', e.target.value)}
                min={rule.minStaff}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShiftRules;