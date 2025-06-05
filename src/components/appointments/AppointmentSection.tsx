import React, { useState } from 'react';
import { Calendar, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAppointmentStore } from '../../store/appointmentStore';
import { formatDateTime } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { usePatientStore } from '../../store/patientStore';
import { useDoctorStore } from '../../store/doctorStore';

const AppointmentSection: React.FC = () => {
  const { appointments, updateAppointment, removeAppointment } = useAppointmentStore();
  const { patients } = usePatientStore();
  const { doctors } = useDoctorStore();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const { toast } = useToast();

  // Helper function to get patient and doctor names
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const getDoctorSpecialization = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.specialization : 'Unknown';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleViewRules = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsRulesModalOpen(true);
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      updateAppointment(id, { status: 'cancelled' });
      toast({
        title: 'Appointment cancelled',
        description: 'The appointment has been cancelled.',
        variant: 'info',
      });
    }
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateAppointment(id, { status: status as any });
    setIsEditModalOpen(false);
    toast({
      title: 'Status updated',
      description: `Appointment status changed to ${status}.`,
      variant: 'success',
    });
  };

  const handleRemoveAppointment = (id: string) => {
    if (confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      removeAppointment(id);
      setIsViewModalOpen(false);
      toast({
        title: 'Appointment deleted',
        description: 'The appointment has been permanently removed.',
        variant: 'info',
      });
    }
  };

  // Sort appointments by date (newest first)
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  return (
    <Card className="mb-8 animate-fade-in" id="appointments-section">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Appointments</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar size={16} className="mr-1" />
            Calendar View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-left">
                <th className="pb-2 pt-2 pl-4 pr-2 font-medium text-neutral-700">Sr No.</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Patient</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Doctor</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Specialization</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Date & Time</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Rules Used</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Status</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.length > 0 ? (
                sortedAppointments.map((appointment, index) => (
                  <tr
                    key={appointment.id}
                    className={`border-b border-neutral-200 hover:bg-neutral-50 transition-colors ${
                      index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 pl-4 pr-2 text-neutral-600">{index + 1}</td>
                    <td className="py-3 px-2 font-medium text-neutral-800">
                      {getPatientName(appointment.patientId)}
                    </td>
                    <td className="py-3 px-2 text-neutral-700">
                      {getDoctorName(appointment.doctorId)}
                    </td>
                    <td className="py-3 px-2 text-neutral-600">
                      {getDoctorSpecialization(appointment.doctorId)}
                    </td>
                    <td className="py-3 px-2 text-neutral-600">
                      {formatDateTime(new Date(appointment.dateTime))}
                    </td>
                    <td className="py-3 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs underline text-primary-500 hover:text-primary-600 p-0"
                        onClick={() => handleViewRules(appointment)}
                      >
                        {appointment.rulesApplied.length} rules
                      </Button>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={getStatusBadgeVariant(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAppointment(appointment)}
                          className="h-8 w-8 p-0"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAppointment(appointment)}
                          className="h-8 w-8 p-0"
                          title="Edit Appointment"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={appointment.status === 'cancelled'}
                          className="h-8 w-8 p-0 text-error-500 hover:text-error-600 hover:bg-error-50"
                          title="Cancel Appointment"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No appointments found. Use the Auto-Schedule button to generate appointments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* View Appointment Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-base font-medium mb-2">Patient Information</h3>
                <div className="bg-neutral-50 p-4 rounded-md">
                  <p className="font-medium text-lg mb-1">
                    {getPatientName(selectedAppointment.patientId)}
                  </p>
                  <p className="text-neutral-600 mb-3">
                    ID: {patients.find(p => p.id === selectedAppointment.patientId)?.patientId}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-neutral-500">Age/Gender</p>
                      <p>
                        {patients.find(p => p.id === selectedAppointment.patientId)?.age} / 
                        {patients.find(p => p.id === selectedAppointment.patientId)?.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Contact</p>
                      <p>{patients.find(p => p.id === selectedAppointment.patientId)?.contact}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Doctor Information</h3>
                <div className="bg-neutral-50 p-4 rounded-md">
                  <p className="font-medium text-lg mb-1">
                    {getDoctorName(selectedAppointment.doctorId)}
                  </p>
                  <p className="text-primary-600 mb-3">
                    {getDoctorSpecialization(selectedAppointment.doctorId)}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-neutral-500">Location</p>
                      <p>{doctors.find(d => d.id === selectedAppointment.doctorId)?.location}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Contact</p>
                      <p>{doctors.find(d => d.id === selectedAppointment.doctorId)?.contact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Appointment Details</h3>
              <div className="bg-neutral-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-neutral-500 text-sm">Date & Time</p>
                    <p className="font-medium">
                      {formatDateTime(new Date(selectedAppointment.dateTime))}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Status</p>
                    <Badge variant={getStatusBadgeVariant(selectedAppointment.status)}>
                      {selectedAppointment.status.charAt(0).toUpperCase() + 
                       selectedAppointment.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Created</p>
                    <p>{formatDateTime(new Date(selectedAppointment.createdAt))}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Rules Applied</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs underline text-primary-500 hover:text-primary-600 p-0"
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setIsRulesModalOpen(true);
                      }}
                    >
                      View {selectedAppointment.rulesApplied.length} rules
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Notes</h3>
              <div className="bg-neutral-50 p-4 rounded-md min-h-24">
                {selectedAppointment.notes ? (
                  <p>{selectedAppointment.notes}</p>
                ) : (
                  <p className="text-neutral-500 italic">No notes for this appointment.</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={() => handleRemoveAppointment(selectedAppointment.id)}
              >
                Delete Appointment
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit Appointment
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Appointment"
        size="lg"
      >
        {selectedAppointment && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Patient
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  value={selectedAppointment.patientId}
                  onChange={(e) => {
                    setSelectedAppointment({
                      ...selectedAppointment,
                      patientId: e.target.value,
                    });
                  }}
                >
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Doctor
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  value={selectedAppointment.doctorId}
                  onChange={(e) => {
                    setSelectedAppointment({
                      ...selectedAppointment,
                      doctorId: e.target.value,
                    });
                  }}
                >
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  value={new Date(selectedAppointment.dateTime).toISOString().split('T')[0]}
                  onChange={(e) => {
                    const date = new Date(selectedAppointment.dateTime);
                    const newDate = new Date(e.target.value);
                    date.setFullYear(newDate.getFullYear());
                    date.setMonth(newDate.getMonth());
                    date.setDate(newDate.getDate());
                    
                    setSelectedAppointment({
                      ...selectedAppointment,
                      dateTime: date.toISOString(),
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  value={new Date(selectedAppointment.dateTime)
                    .toTimeString()
                    .split(' ')[0]
                    .substring(0, 5)}
                  onChange={(e) => {
                    const date = new Date(selectedAppointment.dateTime);
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    date.setHours(hours);
                    date.setMinutes(minutes);
                    
                    setSelectedAppointment({
                      ...selectedAppointment,
                      dateTime: date.toISOString(),
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={selectedAppointment.status === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    type="button"
                    variant={selectedAppointment.status === 'confirmed' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'confirmed')}
                  >
                    Confirmed
                  </Button>
                  <Button
                    type="button"
                    variant={selectedAppointment.status === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'completed')}
                  >
                    Completed
                  </Button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent min-h-[100px]"
                  value={selectedAppointment.notes || ''}
                  onChange={(e) => {
                    setSelectedAppointment({
                      ...selectedAppointment,
                      notes: e.target.value,
                    });
                  }}
                  placeholder="Add notes about this appointment..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 border-t border-neutral-200 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateAppointment(selectedAppointment.id, {
                    patientId: selectedAppointment.patientId,
                    doctorId: selectedAppointment.doctorId,
                    dateTime: new Date(selectedAppointment.dateTime),
                    status: selectedAppointment.status,
                    notes: selectedAppointment.notes,
                  });
                  setIsEditModalOpen(false);
                  toast({
                    title: 'Appointment updated',
                    description: 'The appointment has been updated successfully.',
                    variant: 'success',
                  });
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Rules Applied Modal */}
      <Modal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        title="Rules Applied"
      >
        {selectedAppointment && (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">
              Rules Applied to This Appointment
            </h3>
            
            {selectedAppointment.rulesApplied.length > 0 ? (
              <div className="space-y-4">
                {selectedAppointment.rulesApplied.map((rule: any, index: number) => (
                  <div
                    key={index}
                    className="border border-neutral-200 rounded-md p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-neutral-800">
                          {rule.statement}
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">
                          {rule.explanation}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <span className="text-xs text-neutral-500 mr-2">Priority:</span>
                          <Badge variant="outline">{rule.priority}</Badge>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-neutral-500 mr-2">Weight:</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-neutral-200 rounded-full h-1.5 mr-1">
                              <div
                                className="bg-primary-500 h-1.5 rounded-full"
                                style={{ width: `${rule.weight * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-neutral-600">
                              {rule.weight.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 italic">
                No rules were applied to this appointment.
              </p>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setIsRulesModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default AppointmentSection;