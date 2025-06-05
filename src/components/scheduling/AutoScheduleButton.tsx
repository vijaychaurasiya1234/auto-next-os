import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Calendar, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePatientStore } from '../../store/patientStore';
import { useDoctorStore } from '../../store/doctorStore';
import { useRuleStore } from '../../store/ruleStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useToast } from '../ui/Toast';

const AutoScheduleButton: React.FC = () => {
  const { patients } = usePatientStore();
  const { doctors } = useDoctorStore();
  const { rules } = useRuleStore();
  const { generateAppointments, isScheduling } = useAppointmentStore();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleAutoSchedule = async () => {
    if (patients.length === 0 || doctors.length === 0) {
      toast({
        title: 'Cannot auto-schedule',
        description: patients.length === 0 
          ? 'Please add patients before scheduling.' 
          : 'Please add doctors before scheduling.',
        variant: 'warning',
      });
      return;
    }

    toast({
      title: 'Auto-scheduling in progress',
      description: 'Generating optimal appointments based on rules...',
      variant: 'info',
    });

    try {
      await generateAppointments(patients, doctors, rules);
      
      toast({
        title: 'Auto-scheduling complete',
        description: 'Appointments have been generated successfully.',
        variant: 'success',
      });
      
      // Scroll to appointments section
      const appointmentsSection = document.getElementById('appointments-section');
      if (appointmentsSection) {
        appointmentsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      toast({
        title: 'Auto-scheduling failed',
        description: 'There was an error generating appointments.',
        variant: 'error',
      });
    }
  };

  return (
    <div className="flex justify-center my-6 relative">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ 
          scale: isHovered ? 1.05 : 1,
          boxShadow: isHovered 
            ? '0 8px 30px rgba(15, 98, 254, 0.2)' 
            : '0 4px 6px rgba(15, 98, 254, 0.1)'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="relative overflow-hidden rounded-full"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Button 
          size="lg" 
          className="px-8 py-6 text-base font-medium rounded-full relative overflow-hidden"
          onClick={handleAutoSchedule}
          disabled={isScheduling}
        >
          {isScheduling ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Auto-Scheduling...
            </>
          ) : (
            <>
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                <Wand2 size={18} className="mr-2" />
                Auto-Schedule
              </div>
            </>
          )}
        </Button>
      </motion.div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute -z-10 w-36 h-36 rounded-full bg-primary-100 opacity-60"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          left: 'calc(50% - 6rem)',
          top: 'calc(50% - 6rem)',
        }}
      />
    </div>
  );
};

export default AutoScheduleButton;