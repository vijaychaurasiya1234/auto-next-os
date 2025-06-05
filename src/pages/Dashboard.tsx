import React from 'react';
import RuleSection from '../components/rules/RuleSection';
import PatientSection from '../components/patients/PatientSection';
import DoctorSection from '../components/doctors/DoctorSection';
import AutoScheduleButton from '../components/scheduling/AutoScheduleButton';
import AppointmentSection from '../components/appointments/AppointmentSection';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <RuleSection />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PatientSection />
        <DoctorSection />
      </div>
      
      <AutoScheduleButton />
      
      <AppointmentSection />
    </div>
  );
};

export default Dashboard;