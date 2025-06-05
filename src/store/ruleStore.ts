import { create } from 'zustand';
import { generateId } from '../lib/utils';

export type RuleStatus = 'active' | 'inactive';

export interface Rule {
  id: string;
  statement: string;
  status: RuleStatus;
  priority: number;
  weight: number;
}

interface RuleState {
  rules: Rule[];
  addRule: (statement: string, priority: number, weight: number) => void;
  removeRule: (id: string) => void;
  updateRule: (id: string, updates: Partial<Omit<Rule, 'id'>>) => void;
  toggleRuleStatus: (id: string) => void;
  moveRuleUp: (id: string) => void;
  moveRuleDown: (id: string) => void;
}

export const useRuleStore = create<RuleState>((set) => ({
  rules: [
    {
      id: generateId(),
      statement: 'Prioritize patients with urgent symptoms',
      status: 'active',
      priority: 1,
      weight: 0.9,
    },
    {
      id: generateId(),
      statement: 'Match patients to doctors with relevant specialization',
      status: 'active',
      priority: 2,
      weight: 0.8,
    },
    {
      id: generateId(),
      statement: 'Schedule patients within 7 days of their preferred date when possible',
      status: 'active',
      priority: 3,
      weight: 0.7,
    },
    {
      id: generateId(),
      statement: 'Limit doctors to maximum 8 patients per day',
      status: 'active',
      priority: 4,
      weight: 0.6,
    },
    {
      id: generateId(),
      statement: 'Distribute appointments evenly throughout the day',
      status: 'inactive',
      priority: 5,
      weight: 0.5,
    },
  ],

  addRule: (statement, priority, weight) => {
    set((state) => {
      const activeRules = state.rules.filter((rule) => rule.status === 'active');
      
      // Adjust priorities of existing rules if needed
      const updatedRules = state.rules.map((rule) => {
        if (rule.status === 'active' && rule.priority >= priority) {
          return { ...rule, priority: rule.priority + 1 };
        }
        return rule;
      });
      
      return {
        rules: [
          ...updatedRules,
          {
            id: generateId(),
            statement,
            status: 'active',
            priority,
            weight,
          },
        ],
      };
    });
  },

  removeRule: (id) => {
    set((state) => {
      // Remove the rule
      const filteredRules = state.rules.filter((rule) => rule.id !== id);
      
      // Recalculate priorities for active rules
      const activeRules = filteredRules.filter((rule) => rule.status === 'active');
      const inactiveRules = filteredRules.filter((rule) => rule.status === 'inactive');
      
      const updatedActiveRules = activeRules.map((rule, index) => ({
        ...rule,
        priority: index + 1,
      }));
      
      return { rules: [...updatedActiveRules, ...inactiveRules] };
    });
  },

  updateRule: (id, updates) => {
    set((state) => {
      const rule = state.rules.find((r) => r.id === id);
      if (!rule) return state;

      const oldPriority = rule.priority;
      const newPriority = updates.priority || oldPriority;

      // Update priorities of other rules if priority changed
      const updatedRules = state.rules.map((r) => {
        if (r.id === id) {
          return { ...r, ...updates };
        }
        
        if (r.status === 'active' && updates.priority) {
          if (oldPriority < newPriority) {
            // Moving down
            if (r.priority > oldPriority && r.priority <= newPriority) {
              return { ...r, priority: r.priority - 1 };
            }
          } else if (oldPriority > newPriority) {
            // Moving up
            if (r.priority >= newPriority && r.priority < oldPriority) {
              return { ...r, priority: r.priority + 1 };
            }
          }
        }
        
        return r;
      });

      return { rules: updatedRules };
    });
  },

  toggleRuleStatus: (id) => {
    set((state) => {
      const ruleToToggle = state.rules.find((rule) => rule.id === id);
      
      if (!ruleToToggle) return state;
      
      const otherRules = state.rules.filter((rule) => rule.id !== id);
      
      if (ruleToToggle.status === 'inactive') {
        const activeRules = otherRules.filter((rule) => rule.status === 'active');
        const inactiveRules = otherRules.filter((rule) => rule.status === 'inactive');
        
        const updatedRule = {
          ...ruleToToggle,
          status: 'active' as RuleStatus,
          priority: activeRules.length + 1,
        };
        
        return { rules: [...activeRules, updatedRule, ...inactiveRules] };
      }
      
      const activeRules = otherRules.filter((rule) => rule.status === 'active');
      const inactiveRules = otherRules.filter((rule) => rule.status === 'inactive');
      
      const updatedActiveRules = activeRules.map((rule, index) => ({
        ...rule,
        priority: index + 1,
      }));
      
      const updatedRule = {
        ...ruleToToggle,
        status: 'inactive' as RuleStatus,
      };
      
      return { rules: [...updatedActiveRules, ...inactiveRules, updatedRule] };
    });
  },

  moveRuleUp: (id) => {
    set((state) => {
      const ruleIndex = state.rules.findIndex((rule) => rule.id === id);
      if (ruleIndex <= 0) return state;
      
      const rule = state.rules[ruleIndex];
      if (rule.status !== 'active') return state;
      
      const prevRule = state.rules[ruleIndex - 1];
      if (prevRule.status !== 'active') return state;
      
      const updatedRules = [...state.rules];
      updatedRules[ruleIndex] = { ...rule, priority: prevRule.priority };
      updatedRules[ruleIndex - 1] = { ...prevRule, priority: rule.priority };
      
      const activeRules = updatedRules
        .filter((r) => r.status === 'active')
        .sort((a, b) => a.priority - b.priority);
      
      const inactiveRules = updatedRules.filter((r) => r.status === 'inactive');
      
      return { rules: [...activeRules, ...inactiveRules] };
    });
  },

  moveRuleDown: (id) => {
    set((state) => {
      const activeRules = state.rules.filter((rule) => rule.status === 'active');
      const ruleIndex = activeRules.findIndex((rule) => rule.id === id);
      
      if (ruleIndex === -1 || ruleIndex >= activeRules.length - 1) {
        return state;
      }
      
      const rule = activeRules[ruleIndex];
      const nextRule = activeRules[ruleIndex + 1];
      
      const updatedActiveRules = [...activeRules];
      updatedActiveRules[ruleIndex] = { ...rule, priority: nextRule.priority };
      updatedActiveRules[ruleIndex + 1] = { ...nextRule, priority: rule.priority };
      
      const sortedActiveRules = updatedActiveRules.sort((a, b) => a.priority - b.priority);
      const inactiveRules = state.rules.filter((rule) => rule.status === 'inactive');
      
      return { rules: [...sortedActiveRules, ...inactiveRules] };
    });
  },
}));