// components/UploadNoteModal.tsx
import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

interface UploadNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadNoteModal: React.FC<UploadNoteModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    semester: '',
    department: '',
    type: 'notes',
    description: '',
    tags: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics', 'Civil', 'Mechanical'];
  const subjects = ['Data Structures', 'Algorithms', 'Calculus', 'Linear Algebra', 'Digital Electronics', 'Programming'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

// components/UploadNoteModal.tsx - Update the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!file) {
    setError('Please select a file');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    console.log('🔐 Token from localStorage:', token);

    if (!token) {
      throw new Error('Please log in again. Token missing.');
    }

    // Test the token first
    console.log('🧪 Testing token...');
    const testResponse = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('🔍 Token test response status:', testResponse.status);
    
    if (!testResponse.ok) {
      const errorData = await testResponse.json().catch(() => ({}));
      console.error('❌ Token test failed:', errorData);
      throw new Error(`Authentication failed: ${testResponse.status} - ${errorData.message || 'Please log in again'}`);
    }

    const userData = await testResponse.json();
    console.log('✅ Token is valid. User:', userData.user);

    // Now proceed with upload
    console.log('📤 Starting file upload...');
    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('semester', formData.semester);
    formDataToSend.append('department', formData.department);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('tags', formData.tags);

    console.log('📝 Form data prepared');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`  ${key}:`, value);
    }

    const response = await fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - let browser set it automatically
      },
      body: formDataToSend,
    });

    console.log('📨 Upload response status:', response.status);
    console.log('📨 Upload response headers:', response.headers);

    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('❌ Upload error details:', errorData);
      } catch (parseError) {
        const errorText = await response.text();
        console.error('❌ Upload error text:', errorText);
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Upload successful:', result);

    onUploadSuccess();
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      subject: '',
      semester: '',
      department: '',
      type: 'notes',
      description: '',
      tags: ''
    });
    setFile(null);
    
  } catch (err: any) {
    console.error('💥 Upload error:', err);
    setError(err.message || 'Failed to upload note. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload New Notes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter note title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
              <select
                required
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter note description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <FileText size={24} />
                    <span>{file.name}</span>
                    <span className="text-sm text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload file</span>
                    <span className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, PPTX, TXT (Max 10MB)</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload Note</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadNoteModal;