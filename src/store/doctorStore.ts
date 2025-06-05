import { create } from 'zustand';
import { generateId } from '../lib/utils';
import { faker } from '@faker-js/faker';

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability: TimeSlot[];
  contact: string;
  location: string;
  photo?: string;
  credentials?: string[];
}

interface DoctorState {
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  removeDoctor: (id: string) => void;
  updateDoctor: (id: string, updates: Partial<Omit<Doctor, 'id'>>) => void;
  importDoctors: (doctors: Omit<Doctor, 'id'>[]) => void;
}

// Helper to generate random time slots for a week
const generateWeeklyAvailability = (): TimeSlot[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startTimes = ['08:00', '09:00', '10:00', '13:00', '14:00'];
  const endTimes = ['12:00', '13:00', '16:00', '17:00', '18:00'];
  
  return days.map((day) => {
    // Randomly select days to have available slots (approximately 70% chance)
    if (Math.random() > 0.3) {
      const startIdx = faker.number.int({ min: 0, max: startTimes.length - 1 });
      const endIdx = faker.number.int({ min: startIdx, max: endTimes.length - 1 });
      
      return {
        day,
        startTime: startTimes[startIdx],
        endTime: endTimes[endIdx],
      };
    }
    
    // Return empty slot for days off
    return {
      day,
      startTime: '',
      endTime: '',
    };
  }).filter(slot => slot.startTime && slot.endTime);
};

// Generate sample doctors
const generateSampleDoctors = (): Doctor[] => {
  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Internal Medicine',
    'Psychiatry',
    'Oncology',
    'Gastroenterology',
    'Endocrinology',
  ];
  
  const locations = [
    'Main Hospital - Floor 2',
    'East Wing - Suite 305',
    'Medical Arts Building - Room 210',
    'West Campus - Building C',
    'Downtown Clinic',
  ];
  
  return Array.from({ length: 8 }, () => {
    const gender = faker.person.sex() as "male" | "female";
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const specialization = faker.helpers.arrayElement(specializations);
    
    return {
      id: generateId(),
      name: `Dr. ${firstName} ${lastName}`,
      specialization,
      availability: generateWeeklyAvailability(),
      contact: faker.phone.number(),
      location: faker.helpers.arrayElement(locations),
      photo: faker.image.avatar(),
      credentials: Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        () => faker.helpers.arrayElement([
          'Board Certified',
          'MD - Harvard Medical School',
          'Fellowship - Mayo Clinic',
          'PhD - Johns Hopkins University',
          'Residency - Cleveland Clinic',
          'Member of American Medical Association',
          'Published Researcher',
        ])
      ),
    };
  });
};

export const useDoctorStore = create<DoctorState>((set) => ({
  doctors: generateSampleDoctors(),

  addDoctor: (doctor) => {
    set((state) => ({
      doctors: [...state.doctors, { ...doctor, id: generateId() }],
    }));
  },

  removeDoctor: (id) => {
    set((state) => ({
      doctors: state.doctors.filter((doctor) => doctor.id !== id),
    }));
  },

  updateDoctor: (id, updates) => {
    set((state) => ({
      doctors: state.doctors.map((doctor) =>
        doctor.id === id ? { ...doctor, ...updates } : doctor
      ),
    }));
  },

  importDoctors: (doctors) => {
    set((state) => ({
      doctors: [
        ...state.doctors,
        ...doctors.map((doctor) => ({ ...doctor, id: generateId() })),
      ],
    }));
  },
}));