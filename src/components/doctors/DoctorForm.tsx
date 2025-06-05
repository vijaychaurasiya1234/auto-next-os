import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useDoctorStore, TimeSlot } from '../../store/doctorStore';
import { useToast } from '../ui/Toast';
import { X } from 'lucide-react';

interface DoctorFormProps {
  doctor?: any;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorForm: React.FC<DoctorFormProps> = ({
  doctor,
  onClose,
  mode,
}) => {
  const { addDoctor, updateDoctor } = useDoctorStore();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: doctor?.name || '',
    specialization: doctor?.specialization || '',
    contact: doctor?.contact || '',
    location: doctor?.location || '',
    photo: doctor?.photo || '',
    credentials: doctor?.credentials?.join(', ') || '',
  });

  const initialAvailability = doctor?.availability || [];
  const [availability, setAvailability] = useState<TimeSlot[]>(initialAvailability);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTimeSlot = () => {
    // Find first day not in the availability
    const availableDays = availability.map(slot => slot.day);
    const dayToAdd = DAYS_OF_WEEK.find(day => !availableDays.includes(day)) || DAYS_OF_WEEK[0];
    
    setAvailability([
      ...availability,
      { day: dayToAdd, startTime: '09:00', endTime: '17:00' }
    ]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleTimeSlotChange = (index: number, field: keyof TimeSlot, value: string) => {
    setAvailability(prev => 
      prev.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process form data
    const doctorData = {
      name: form.name,
      specialization: form.specialization,
      contact: form.contact,
      location: form.location,
      photo: form.photo,
      credentials: form.credentials.split(',').map(c => c.trim()).filter(c => c),
      availability,
    };
    
    if (mode === 'add') {
      addDoctor(doctorData);
      toast({
        title: 'Doctor added',
        description: 'The new doctor has been added successfully.',
        variant: 'success',
      });
    } else {
      updateDoctor(doctor.id, doctorData);
      toast({
        title: 'Doctor updated',
        description: 'The doctor information has been updated.',
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
            Doctor Name *
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
            Specialization *
          </label>
          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Specialization</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Internal Medicine">Internal Medicine</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="Oncology">Oncology</option>
            <option value="Gastroenterology">Gastroenterology</option>
            <option value="Endocrinology">Endocrinology</option>
          </select>
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
            Clinic Location *
          </label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Photo URL
          </label>
          <Input
            name="photo"
            value={form.photo}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Credentials
          </label>
          <Input
            name="credentials"
            value={form.credentials}
            onChange={handleChange}
            placeholder="Separate with commas"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-neutral-700">
            Weekly Availability
          </label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddTimeSlot}
          >
            Add Time Slot
          </Button>
        </div>
        
        {availability.length > 0 ? (
          <div className="space-y-3">
            {availability.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2">
                <select
                  value={slot.day}
                  onChange={(e) => handleTimeSlotChange(index, 'day', e.target.value)}
                  className="flex h-10 w-full max-w-[150px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-neutral-500">From</span>
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                  className="w-full max-w-[120px]"
                />
                <span className="text-sm text-neutral-500">To</span>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                  className="w-full max-w-[120px]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTimeSlot(index)}
                  className="h-8 w-8 p-0 text-neutral-500"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 italic">No availability slots added yet.</p>
        )}
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
          {mode === 'add' ? 'Add Doctor' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default DoctorForm;