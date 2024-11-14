import React from 'react';
import { ShiftRule, Skill } from '../types';

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

  const toggleFridaySkill = (id: number, skill: Skill) => {
    setRules(
      rules.map((rule) => {
        if (rule.id === id) {
          const currentSkills = rule.requiredSkills?.friday || [];
          const newSkills = currentSkills.includes(skill)
            ? currentSkills.filter(s => s !== skill)
            : [...currentSkills, skill];
          
          return {
            ...rule,
            requiredSkills: {
              ...rule.requiredSkills,
              friday: newSkills
            }
          };
        }
        return rule;
      })
    );
  };

  const skillOptions: { value: Skill; label: string }[] = [
    { value: 'hall', label: 'ホール' },
    { value: 'kitchen', label: 'キッチン' },
    { value: 'leader', label: 'リーダー' },
  ];

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div key={rule.id} className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">
            {rule.dayType === 'weekday' ? '平日' : '週末'}のルール
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
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

          {rule.dayType === 'weekday' && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">金曜日に必要なスキル:</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleFridaySkill(rule.id, value)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      rule.requiredSkills?.friday?.includes(value)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-indigo-600 text-indigo-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShiftRules;