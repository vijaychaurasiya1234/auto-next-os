import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Eye, PlusCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Rule, RuleStatus, useRuleStore } from '../../store/ruleStore';
import { cn } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

const RuleSection: React.FC = () => {
  const { rules, addRule, toggleRuleStatus, moveRuleUp, moveRuleDown } = useRuleStore();
  const [newRuleStatement, setNewRuleStatement] = useState('');
  const [newRulePriority, setNewRulePriority] = useState(1);
  const [newRuleWeight, setNewRuleWeight] = useState(0.5);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVisualizeModalOpen, setIsVisualizeModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [editedRule, setEditedRule] = useState<Partial<Rule>>({});
  const { toast } = useToast();

  const handleAddRule = () => {
    if (newRuleStatement.trim()) {
      addRule(newRuleStatement.trim(), newRulePriority, newRuleWeight);
      setNewRuleStatement('');
      setNewRulePriority(1);
      setNewRuleWeight(0.5);
      toast({
        title: 'Rule added',
        description: 'The new rule has been added to the active rules.',
        variant: 'success',
      });
    }
  };

  // Get available priorities for editing
  const getAvailablePriorities = (currentPriority: number) => {
    const activeRules = rules.filter(r => r.status === 'active');
    const priorities = Array.from({ length: activeRules.length }, (_, i) => i + 1);
    return priorities;
  };

  const handleOpenEditModal = (rule: Rule) => {
    setSelectedRule(rule);
    setEditedRule({
      statement: rule.statement,
      weight: rule.weight,
      priority: rule.priority,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenVisualizeModal = (rule: Rule) => {
    setSelectedRule(rule);
    setIsVisualizeModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedRule && editedRule) {
      useRuleStore.getState().updateRule(selectedRule.id, editedRule);
      setIsEditModalOpen(false);
      toast({
        title: 'Rule updated',
        description: 'The rule has been successfully updated.',
        variant: 'success',
      });
    }
  };

  const handleToggleStatus = (rule: Rule) => {
    toggleRuleStatus(rule.id);
    toast({
      title: `Rule ${rule.status === 'active' ? 'deactivated' : 'activated'}`,
      description: `The rule has been ${rule.status === 'active' ? 'deactivated' : 'activated'}.`,
      variant: 'info',
    });
  };

  // Separate active and inactive rules
  const activeRules = rules.filter((rule) => rule.status === 'active');
  const inactiveRules = rules.filter((rule) => rule.status === 'inactive');

  return (
    <Card className="mb-6 animate-fade-in">
      <CardHeader className="flex flex-col items-center justify-center pb-2">
        <CardTitle className="mb-4">Rules Engine</CardTitle>
        <div className="flex flex-col items-center space-y-4 w-full max-w-2xl">
          <Input
            type="text"
            placeholder="Type a rule..."
            value={newRuleStatement}
            onChange={(e) => setNewRuleStatement(e.target.value)}
            className="w-full text-center"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddRule();
            }}
          />
          <div className="flex items-center space-x-4 w-full">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Priority
              </label>
              <select
                value={newRulePriority}
                onChange={(e) => setNewRulePriority(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                {Array.from({ length: activeRules.length + 1 }, (_, i) => i + 1).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Weight
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={newRuleWeight}
                onChange={(e) => setNewRuleWeight(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-neutral-600">
                {newRuleWeight.toFixed(1)}
              </div>
            </div>
          </div>
          <Button onClick={handleAddRule} disabled={!newRuleStatement.trim()}>
            <PlusCircle size={16} className="mr-1" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-neutral-200 text-left">
                <th className="pb-2 pt-2 pl-4 pr-2 font-medium text-neutral-700">Rule Statement</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700 w-[100px]">Status</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700 w-[100px]">Priority</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700 w-[180px]">Weight</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700 w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Active Rules */}
              {activeRules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  <td className="py-3 pl-4 pr-2 text-neutral-800">{rule.statement}</td>
                  <td className="py-3 px-2">
                    <Badge variant="active">Active</Badge>
                  </td>
                  <td className="py-3 px-2 text-center">{rule.priority}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center">
                      <div className="w-full bg-neutral-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${rule.weight * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-neutral-600 min-w-[40px]">
                        {rule.weight.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveRuleUp(rule.id)}
                        disabled={rule.priority === 1}
                        className="h-8 w-8 p-0"
                        title="Move Up"
                      >
                        <ChevronUp size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveRuleDown(rule.id)}
                        disabled={rule.priority === activeRules.length}
                        className="h-8 w-8 p-0"
                        title="Move Down"
                      >
                        <ChevronDown size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(rule)}
                        className="h-8 w-8 p-0"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(rule)}
                        className="h-8 w-8 p-0"
                        title="Deactivate"
                      >
                        <ToggleRight size={16} className="text-success-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenVisualizeModal(rule)}
                        className="h-8 w-8 p-0"
                        title="Visualize"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Inactive Rules */}
              {inactiveRules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors opacity-60"
                >
                  <td className="py-3 pl-4 pr-2 text-neutral-700">{rule.statement}</td>
                  <td className="py-3 px-2">
                    <Badge variant="inactive">Inactive</Badge>
                  </td>
                  <td className="py-3 px-2 text-center">-</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center">
                      <div className="w-full bg-neutral-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-neutral-400 h-2 rounded-full"
                          style={{ width: `${rule.weight * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-neutral-600 min-w-[40px]">
                        {rule.weight.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(rule)}
                        className="h-8 w-8 p-0"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(rule)}
                        className="h-8 w-8 p-0"
                        title="Activate"
                      >
                        <ToggleLeft size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenVisualizeModal(rule)}
                        className="h-8 w-8 p-0"
                        title="Visualize"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Edit Rule Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Rule"
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Rule Statement
            </label>
            <Input
              value={editedRule.statement || ''}
              onChange={(e) =>
                setEditedRule({ ...editedRule, statement: e.target.value })
              }
              className="w-full"
            />
          </div>
          {selectedRule?.status === 'active' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Priority
              </label>
              <select
                value={editedRule.priority}
                onChange={(e) =>
                  setEditedRule({
                    ...editedRule,
                    priority: Number(e.target.value),
                  })
                }
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                {getAvailablePriorities(selectedRule.priority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Weight (0.00 - 1.00)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={editedRule.weight || 0}
                onChange={(e) =>
                  setEditedRule({
                    ...editedRule,
                    weight: parseFloat(e.target.value),
                  })
                }
                className="w-full mr-4"
              />
              <span className="text-sm font-medium">
                {(editedRule.weight || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Visualize Rule Modal */}
      <Modal
        isOpen={isVisualizeModalOpen}
        onClose={() => setIsVisualizeModalOpen(false)}
        title="Rule Visualization"
      >
        <div className="p-6">
          {selectedRule && (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Rule Statement</h3>
                <p className="text-neutral-800 p-3 bg-neutral-50 rounded-md">
                  {selectedRule.statement}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-1">Status</h3>
                  <Badge
                    variant={selectedRule.status === 'active' ? 'active' : 'inactive'}
                    className="text-sm"
                  >
                    {selectedRule.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-1">Priority</h3>
                  <p className="text-neutral-800">
                    {selectedRule.status === 'active' ? (
                      <>
                        {selectedRule.priority} 
                        <span className="text-sm text-neutral-500 ml-1">
                          (Rules are executed in priority order, 1 being highest)
                        </span>
                      </>
                    ) : (
                      'N/A - Inactive'
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-1">Weight</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-neutral-200 rounded-full h-2 mr-2">
                      <div
                        className={cn(
                          "h-2 rounded-full",
                          selectedRule.status === 'active'
                            ? "bg-primary-500"
                            : "bg-neutral-400"
                        )}
                        style={{ width: `${selectedRule.weight * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-neutral-600">
                      {selectedRule.weight.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-700 mb-1">Rule Logic</h3>
                <div className="p-4 bg-neutral-50 rounded-md">
                  <p className="text-sm text-neutral-700 mb-2">
                    When this rule is active and applied to scheduling:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                    <li>
                      Priority {selectedRule.priority} in execution order
                      {selectedRule.priority === 1 && " (Highest priority)"}
                      {selectedRule.priority === activeRules.length && " (Lowest priority)"}
                    </li>
                    <li>
                      Influence strength of {(selectedRule.weight * 100).toFixed()}% on decisions
                    </li>
                    <li>
                      {selectedRule.statement.toLowerCase().includes('prioritize')
                        ? 'Affects patient ordering in the queue'
                        : selectedRule.statement.toLowerCase().includes('match')
                        ? 'Affects doctor selection algorithm'
                        : selectedRule.statement.toLowerCase().includes('limit')
                        ? 'Sets constraints on scheduling capacity'
                        : 'Influences general scheduling behavior'}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsVisualizeModalOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default RuleSection;