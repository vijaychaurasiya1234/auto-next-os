import React, { useState } from 'react';
import { Edit, Eye, Import, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Doctor, useDoctorStore } from '../../store/doctorStore';
import { Modal } from '../ui/Modal';
import DoctorForm from './DoctorForm';
import { useToast } from '../ui/Toast';

const DoctorSection: React.FC = () => {
  const { doctors, removeDoctor } = useDoctorStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = (doctorId: string) => {
    if (confirm('Are you sure you want to delete this doctor? This will remove all associated appointments.')) {
      removeDoctor(doctorId);
      toast({
        title: 'Doctor deleted',
        description: 'The doctor has been removed from the system.',
        variant: 'info',
      });
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  const handleView = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  return (
    <Card className="h-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Doctors</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Import size={16} className="mr-1" />
            Import
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} className="mr-1" />
            Add Doctor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-left">
                <th className="pb-2 pt-2 pl-4 pr-2 font-medium text-neutral-700">Doctor Name</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Specialization</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Availability</th>
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
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                      )}
                      <span className="font-medium text-neutral-800">{doctor.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {doctor.specialization}
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-sm text-neutral-600">
                      {doctor.availability.length > 0 ? (
                        <span>
                          {doctor.availability.length} day{doctor.availability.length !== 1 ? 's' : ''} available
                        </span>
                      ) : (
                        <span className="text-warning-600">No availability set</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(doctor)}
                        className="h-8 w-8 p-0"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(doctor)}
                        className="h-8 w-8 p-0"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doctor.id)}
                        className="h-8 w-8 p-0 text-error-500 hover:text-error-600 hover:bg-error-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Doctor"
        size="lg"
      >
        <DoctorForm
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Doctor"
        size="lg"
      >
        {selectedDoctor && (
          <DoctorForm
            doctor={selectedDoctor}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
          />
        )}
      </Modal>

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

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Doctors"
      >
        <div className="p-6">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center mb-6">
            <div className="mb-4">
              <Import size={36} className="mx-auto text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Doctor Data</h3>
            <p className="text-neutral-500 mb-4">
              Drag and drop a CSV or Excel file, or click to browse
            </p>
            <Button>Browse Files</Button>
          </div>
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Expected Format</h4>
            <p className="text-sm text-neutral-500 mb-2">
              Your file should include the following columns:
            </p>
            <div className="bg-neutral-50 p-3 rounded-md text-sm">
              <code>Name, Specialization, Contact, Location, Availability (JSON format)</code>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsImportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              setIsImportModalOpen(false);
              toast({
                title: 'Import successful',
                description: 'Doctor data has been imported successfully.',
                variant: 'success',
              });
            }}>
              Import
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default DoctorSection;