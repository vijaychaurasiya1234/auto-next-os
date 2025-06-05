import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Doctor, useDoctorStore } from '../../store/doctorStore';
import { Modal } from '../ui/Modal';

const DoctorSection: React.FC = () => {
  const { doctors } = useDoctorStore();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleView = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  return (
    <Card className="h-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Doctors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-neutral-200 text-left">
                <th className="pb-2 pt-2 pl-4 pr-2 font-medium text-neutral-700">Doctor Name</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Specialization</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Available Slots</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Available Days</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  <td className="py-3 pl-4 pr-2">
                    <div className="flex items-center">
                      {doctor.photo && (
                        <img
                          src={doctor.photo}
                          alt={doctor.name}
                          className="w-8 h-8 rounded-full mr-3  object-cover"
                        />
                      )}
                      <span className="font-medium text-neutral-800">{doctor.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {doctor.specialization}
                  </td>
                  <td className="py-3 px-2">
                    {doctor.availability.map(slot => `${slot.startTime}-${slot.endTime}`).join(', ')}
                  </td>
                  <td className="py-3 px-2">
                    {doctor.availability.map(slot => slot.day).join(', ')}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(doctor)}
                      className="h-8 w-8 p-0"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* View Doctor Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Doctor Details"
        size="lg"
      >
        {selectedDoctor && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  {selectedDoctor.photo && (
                    <img
                      src={selectedDoctor.photo}
                      alt={selectedDoctor.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{selectedDoctor.name}</h3>
                    <p className="text-primary-600">{selectedDoctor.specialization}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Contact</p>
                    <p className="font-medium">{selectedDoctor.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Location</p>
                    <p className="font-medium">{selectedDoctor.location}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-base font-medium mb-2">Credentials</h4>
                  {selectedDoctor.credentials && selectedDoctor.credentials.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedDoctor.credentials.map((credential, idx) => (
                        <li key={idx} className="text-sm">{credential}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-500">No credentials listed</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium mb-2">Weekly Availability</h4>
                {selectedDoctor.availability && selectedDoctor.availability.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDoctor.availability.map((slot, idx) => (
                      <div key={idx} className="flex items-center p-2 bg-neutral-50 rounded-md">
                        <div className="w-24 font-medium">{slot.day}</div>
                        <div>
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">No availability set</p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default DoctorSection;