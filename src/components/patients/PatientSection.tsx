import React, { useState } from 'react';
import { Edit, Eye, FileText, Import, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Patient, usePatientStore } from '../../store/patientStore';
import { formatDate } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import PatientForm from './PatientForm';
import { useToast } from '../ui/Toast';

const PatientSection: React.FC = () => {
  const { patients, removePatient } = usePatientStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient? This will remove all appointments.')) {
      removePatient(patientId);
      toast({
        title: 'Patient deleted',
        description: 'The patient has been removed from the system.',
        variant: 'info',
      });
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  return (
    <Card className="h-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Patients</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Import size={16} className="mr-1" />
            Import
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} className="mr-1" />
            Add Patient
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-left">
                <th className="pb-2 pt-2 pl-4 pr-2 font-medium text-neutral-700">Name</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">ID</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Age/Gender</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Symptoms</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700">Preferred Date</th>
                <th className="pb-2 pt-2 px-2 font-medium text-neutral-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  <td className="py-3 pl-4 pr-2 text-neutral-800 font-medium">
                    {patient.name}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {patient.patientId}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {patient.age} / {patient.gender}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {patient.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {formatDate(patient.preferredDate)}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(patient)}
                        className="h-8 w-8 p-0"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(patient)}
                        className="h-8 w-8 p-0"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(patient.id)}
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

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Patient"
        size="lg"
      >
        <PatientForm
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient"
        size="lg"
      >
        {selectedPatient && (
          <PatientForm
            patient={selectedPatient}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
          />
        )}
      </Modal>

      {/* View Patient Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Patient Details"
        size="lg"
      >
        {selectedPatient && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{selectedPatient.name}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Patient ID</p>
                    <p className="font-medium">{selectedPatient.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Age / Gender</p>
                    <p className="font-medium">{selectedPatient.age} / {selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Contact</p>
                    <p className="font-medium">{selectedPatient.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Insurance</p>
                    <p className="font-medium">{selectedPatient.insurance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Preferred Date</p>
                    <p className="font-medium">{formatDate(selectedPatient.preferredDate)}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-medium mb-2">Symptoms</h3>
                <div className="bg-neutral-50 p-3 rounded-md mb-4">
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedPatient.symptoms.map((symptom, idx) => (
                      <li key={idx}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                
                <h3 className="text-base font-medium mb-2">Documents</h3>
                {selectedPatient.documents && selectedPatient.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPatient.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center p-2 bg-neutral-50 rounded-md">
                        <FileText size={16} className="text-primary-500 mr-2" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">No documents available</p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Patients"
      >
        <div className="p-6">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center mb-6">
            <div className="mb-4">
              <Import size={36} className="mx-auto text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Patient Data</h3>
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
              <code>Name, ID, Age, Gender, Symptoms, Preferred Date, Contact, Insurance</code>
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
                description: 'Patient data has been imported successfully.',
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

export default PatientSection;