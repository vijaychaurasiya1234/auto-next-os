import { create } from 'zustand';
import { generateId, formatDateTime } from '../lib/utils';
import { Patient } from './patientStore';
import { Doctor } from './doctorStore';
import { Rule } from './ruleStore';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface AppliedRule {
  id: string;
  statement: string;
  priority: number;
  weight: number;
  explanation: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: Date;
  status: AppointmentStatus;
  rulesApplied: AppliedRule[];
  notes?: string;
  createdAt: Date;
}

interface AppointmentState {
  appointments: Appointment[];
  isScheduling: boolean;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => string;
  removeAppointment: (id: string) => void;
  updateAppointment: (id: string, updates: Partial<Omit<Appointment, 'id' | 'createdAt'>>) => void;
  generateAppointments: (patients: Patient[], doctors: Doctor[], rules: Rule[]) => Promise<void>;
}

// Sample applied rules explanations
const ruleExplanations = [
  'Patient symptoms match doctor specialization',
  'Scheduled within 3 days of preferred date',
  'Patient has urgent symptoms requiring priority',
  'Doctor has availability on preferred date',
  'Patient insurance covers this specialist',
  'Scheduled during doctor\'s less busy hours',
  'Patient previously saw this doctor',
];

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  isScheduling: false,

  addAppointment: (appointment) => {
    const id = generateId();
    
    set((state) => ({
      appointments: [
        ...state.appointments,
        { 
          ...appointment,
          id,
          createdAt: new Date(),
        },
      ],
    }));
    
    return id;
  },

  removeAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.filter((appointment) => appointment.id !== id),
    }));
  },

  updateAppointment: (id, updates) => {
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, ...updates } : appointment
      ),
    }));
  },

  generateAppointments: async (patients, doctors, rules) => {
    // Set scheduling flag to show loading indicator
    set({ isScheduling: true });
    
    // Simulate processing time for auto-scheduling
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get active rules
    const activeRules = rules.filter(rule => rule.status === 'active');
    
    // Generate appointments for each patient
    const newAppointments = patients.map(patient => {
      // Find a matching doctor based on symptoms
      const matchingDoctors = doctors.filter(doctor => {
        // Simplified matching logic for demo
        const symptomLower = patient.symptoms.join(' ').toLowerCase();
        const specializationLower = doctor.specialization.toLowerCase();
        
        // Check if any symptom keywords match specialization
        return symptomLower.includes(specializationLower) || 
               specializationLower.includes(symptomLower);
      });
      
      // If no specific match, use a random doctor
      const assignedDoctor = matchingDoctors.length > 0
        ? matchingDoctors[Math.floor(Math.random() * matchingDoctors.length)]
        : doctors[Math.floor(Math.random() * doctors.length)];
      
      // Calculate appointment date based on preferred date
      const preferredDate = new Date(patient.preferredDate);
      const appointmentDate = new Date(preferredDate);
      
      // Add random offset of -2 to +5 days to simulate scheduling constraints
      const dayOffset = Math.floor(Math.random() * 8) - 2;
      appointmentDate.setDate(appointmentDate.getDate() + dayOffset);
      
      // Set hour based on doctor availability
      if (assignedDoctor.availability.length > 0) {
        const randomAvailability = assignedDoctor.availability[
          Math.floor(Math.random() * assignedDoctor.availability.length)
        ];
        
        const startHour = parseInt(randomAvailability.startTime.split(':')[0]);
        const endHour = parseInt(randomAvailability.endTime.split(':')[0]);
        
        // Random hour within availability
        const appointmentHour = startHour + Math.floor(Math.random() * (endHour - startHour));
        const appointmentMinute = Math.random() > 0.5 ? 0 : 30; // Either :00 or :30
        
        appointmentDate.setHours(appointmentHour, appointmentMinute);
      }
      
      // Generate applied rules
      const appliedRules: AppliedRule[] = activeRules
        .slice(0, Math.floor(Math.random() * 3) + 1) // Random number of rules applied (1-3)
        .map((rule) => ({
          id: rule.id,
          statement: rule.statement,
          priority: rule.priority,
          weight: rule.weight,
          explanation: ruleExplanations[Math.floor(Math.random() * ruleExplanations.length)],
        }));
      
      return {
        id: generateId(),
        patientId: patient.id,
        doctorId: assignedDoctor.id,
        dateTime: appointmentDate,
        status: Math.random() > 0.3 ? 'confirmed' : 'pending', // 70% confirmed, 30% pending
        rulesApplied: appliedRules,
        createdAt: new Date(),
      };
    });
    
    // Update state with new appointments
    set((state) => ({
      appointments: [...state.appointments, ...newAppointments],
      isScheduling: false,
    }));
  },
}));