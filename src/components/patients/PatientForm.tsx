import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { usePatientStore } from '../../store/patientStore';
import { useToast } from '../ui/Toast';

interface PatientFormProps {
  patient?: any;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onClose,
  mode,
}) => {
  const { addPatient, updatePatient } = usePatientStore();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: patient?.name || '',
    patientId: patient?.patientId || '',
    age: patient?.age || '',
    gender: patient?.gender || '',
    symptoms: patient?.symptoms?.join(', ') || '',
    preferredDate: patient?.preferredDate 
      ? new Date(patient.preferredDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    contact: patient?.contact || '',
    insurance: patient?.insurance || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process form data
    const patientData = {
      name: form.name,
      patientId: form.patientId,
      age: Number(form.age),
      gender: form.gender,
      symptoms: form.symptoms.split(',').map((s) => s.trim()),
      preferredDate: new Date(form.preferredDate),
      contact: form.contact,
      insurance: form.insurance,
    };
    
    if (mode === 'add') {
      addPatient(patientData);
      toast({
        title: 'Patient added',
        description: 'The new patient has been added successfully.',
        variant: 'success',
      });
    } else {
      updatePatient(patient.id, patientData);
      toast({
        title: 'Patient updated',
        description: 'The patient information has been updated.',
        variant: 'success',
      });
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Full Name *
          </label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Patient ID *
          </label>
          <Input
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Age *
          </label>
          <Input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            min="0"
            max="120"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Gender *
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Symptoms *
          </label>
          <textarea
            name="symptoms"
            value={form.symptoms}
            onChange={handleChange}
            required
            rows={2}
            className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter symptoms separated by commas"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Preferred Date *
          </label>
          <Input
            name="preferredDate"
            type="date"
            value={form.preferredDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Contact Number *
          </label>
          <Input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Insurance Provider *
          </label>
          <Input
            name="insurance"
            value={form.insurance}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Upload Documents
          </label>
          <Input
            type="file"
            className="pt-1.5"
            multiple
          />
          <p className="text-xs text-neutral-500 mt-1">
            Upload medical history, lab results, or other relevant files
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-2 border-t border-neutral-200 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'add' ? 'Add Patient' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;