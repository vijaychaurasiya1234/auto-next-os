import { create } from 'zustand';
import { generateId } from '../lib/utils';
import { faker } from '@faker-js/faker';

export interface Patient {
  id: string;
  name: string;
  patientId: string;
  age: number;
  gender: string;
  symptoms: string[];
  preferredDate: Date;
  contact: string;
  insurance: string;
  documents?: string[];
}

interface PatientState {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  removePatient: (id: string) => void;
  updatePatient: (id: string, updates: Partial<Omit<Patient, 'id'>>) => void;
  importPatients: (patients: Omit<Patient, 'id'>[]) => void;
}

// Generate sample patients
const generateSamplePatients = (): Patient[] => {
  return Array.from({ length: 10 }, () => {
    const gender = faker.person.sex() as string;
    const firstName = faker.person.firstName(gender as "male" | "female");
    const lastName = faker.person.lastName();
    
    return {
      id: generateId(),
      name: `${firstName} ${lastName}`,
      patientId: faker.string.alphanumeric(8).toUpperCase(),
      age: faker.number.int({ min: 18, max: 85 }),
      gender: gender,
      symptoms: [
        faker.helpers.arrayElement([
          'Headache',
          'Chest Pain',
          'Fatigue',
          'Back Pain',
          'Shortness of Breath',
          'Dizziness',
          'Abdominal Pain',
          'Joint Pain',
          'Fever',
          'Rash',
        ]),
        faker.helpers.arrayElement([
          'Nausea',
          'Cough',
          'Insomnia',
          'Anxiety',
          'Depression',
          'Weight Loss',
          'Swelling',
          'Numbness',
          'Blurred Vision',
          'Hearing Loss',
        ]),
      ],
      preferredDate: faker.date.future({ years: 0.2 }),
      contact: faker.phone.number(),
      insurance: faker.helpers.arrayElement([
        'Medicare',
        'Aetna',
        'Cigna',
        'UnitedHealthcare',
        'Blue Cross',
        'Humana',
        'Kaiser',
      ]),
      documents: faker.number.int({ min: 0, max: 3 }) > 0
        ? Array.from(
            { length: faker.number.int({ min: 1, max: 3 }) },
            () => faker.helpers.arrayElement([
              'Medical History.pdf',
              'Lab Results.pdf',
              'Insurance Card.jpg',
              'Previous Diagnosis.pdf',
              'Imaging Results.jpg',
              'Prescription.pdf',
            ])
          )
        : [],
    };
  });
};

export const usePatientStore = create<PatientState>((set) => ({
  patients: generateSamplePatients(),

  addPatient: (patient) => {
    set((state) => ({
      patients: [...state.patients, { ...patient, id: generateId() }],
    }));
  },

  removePatient: (id) => {
    set((state) => ({
      patients: state.patients.filter((patient) => patient.id !== id),
    }));
  },

  updatePatient: (id, updates) => {
    set((state) => ({
      patients: state.patients.map((patient) =>
        patient.id === id ? { ...patient, ...updates } : patient
      ),
    }));
  },

  importPatients: (patients) => {
    set((state) => ({
      patients: [
        ...state.patients,
        ...patients.map((patient) => ({ ...patient, id: generateId() })),
      ],
    }));
  },
}));