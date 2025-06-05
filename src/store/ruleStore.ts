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
  addRule: (statement: string) => void;
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

  addRule: (statement) => {
    set((state) => {
      const activeRules = state.rules.filter((rule) => rule.status === 'active');
      const newPriority = activeRules.length + 1;
      
      return {
        rules: [
          ...state.rules,
          {
            id: generateId(),
            statement,
            status: 'active',
            priority: newPriority,
            weight: 0.5, // Default weight
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
    set((state) => ({
      rules: state.rules.map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      ),
    }));
  },

  toggleRuleStatus: (id) => {
    set((state) => {
      // Get the rule to toggle
      const ruleToToggle = state.rules.find((rule) => rule.id === id);
      
      if (!ruleToToggle) return state;
      
      // Get other rules, excluding the one to toggle
      const otherRules = state.rules.filter((rule) => rule.id !== id);
      
      // If activating a rule
      if (ruleToToggle.status === 'inactive') {
        const activeRules = otherRules.filter((rule) => rule.status === 'active');
        const inactiveRules = otherRules.filter((rule) => rule.status === 'inactive');
        
        const updatedRule = {
          ...ruleToToggle,
          status: 'active' as RuleStatus,
          priority: activeRules.length + 1, // Add to end of active rules
        };
        
        return { rules: [...activeRules, updatedRule, ...inactiveRules] };
      }
      
      // If deactivating a rule
      const activeRules = otherRules.filter((rule) => rule.status === 'active');
      const inactiveRules = otherRules.filter((rule) => rule.status === 'inactive');
      
      // Recalculate priorities for active rules
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
      if (ruleIndex <= 0) return state; // Already at the top or not found
      
      const rule = state.rules[ruleIndex];
      if (rule.status !== 'active') return state; // Only active rules can be moved
      
      const prevRule = state.rules[ruleIndex - 1];
      if (prevRule.status !== 'active') return state; // Can't swap with inactive rule
      
      // Swap priorities
      const updatedRules = [...state.rules];
      updatedRules[ruleIndex] = { ...rule, priority: prevRule.priority };
      updatedRules[ruleIndex - 1] = { ...prevRule, priority: rule.priority };
      
      // Sort rules by priority for active rules
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
        return state; // Not found or already at the bottom
      }
      
      const rule = activeRules[ruleIndex];
      const nextRule = activeRules[ruleIndex + 1];
      
      // Swap priorities
      const updatedActiveRules = [...activeRules];
      updatedActiveRules[ruleIndex] = { ...rule, priority: nextRule.priority };
      updatedActiveRules[ruleIndex + 1] = { ...nextRule, priority: rule.priority };
      
      // Sort rules by priority
      const sortedActiveRules = updatedActiveRules.sort((a, b) => a.priority - b.priority);
      const inactiveRules = state.rules.filter((rule) => rule.status === 'inactive');
      
      return { rules: [...sortedActiveRules, ...inactiveRules] };
    });
  },
}));