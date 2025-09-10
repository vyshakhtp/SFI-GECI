// src/components/ComplaintsPage.tsx
import React, { useState } from 'react';
import { MessageSquare, Send, AlertCircle, CheckCircle, Clock, Calendar, Loader } from 'lucide-react';
import { complaintsAPI } from '../services/api.js';

interface ComplaintFormData {
  name: string;
  studentId: string;
  email: string;
  department: string;
  semester: string;
  category: string;
  subject: string;
  description: string;
  isAnonymous: boolean;
}

const ComplaintsPage = () => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    name: '',
    studentId: '',
    email: '',
    department: '',
    semester: '',
    category: '',
    subject: '',
    description: '',
    isAnonymous: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [complaintId, setComplaintId] = useState('');

  const categories = [
    'Academic Issues',
    'Infrastructure Problems',
    'Faculty Related',
    'Examination Issues',
    'Hostel Problems',
    'Library Issues',
    'Canteen/Food Related',
    'Discrimination/Harassment',
    'Financial Issues',
    'Other'
  ];

  const departments = [
    'Computer Science',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Physics',
    'Chemistry',
    'Mathematics',
    'English',
    'History',
    'Commerce'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): string | null => {
    if (!formData.department) return 'Department is required';
    if (!formData.semester) return 'Semester is required';
    if (!formData.category) return 'Category is required';
    if (!formData.subject.trim()) return 'Subject is required';
    if (formData.subject.trim().length < 5) return 'Subject must be at least 5 characters long';
    if (!formData.description.trim()) return 'Description is required';
    if (formData.description.trim().length < 20) return 'Description must be at least 20 characters long';
    
    if (!formData.isAnonymous) {
      if (!formData.name.trim()) return 'Name is required for non-anonymous complaints';
      if (!formData.studentId.trim()) return 'Student ID is required for non-anonymous complaints';
      if (!formData.email.trim()) return 'Email is required for non-anonymous complaints';
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
    }
    
    return null;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    return;
  }

  setIsSubmitting(true);
  setError('');

  try {
    // ✅ FIXED: Use complaintsAPI.submit instead of complaintsAPI.submitComplaint
    const response = await complaintsAPI.submit(formData);
    
    if (response.data.complaintId) {
      setComplaintId(response.data.complaintId);
      setIsSubmitted(true);
    }
  } catch (err: any) {
    console.error('Error submitting complaint:', err);
    setError(err.response?.data?.message || 'Failed to submit complaint. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};
  const recentComplaints = [
    {
      id: 1,
      category: 'Infrastructure Problems',
      subject: 'Broken AC in Computer Lab',
      status: 'resolved',
      date: '2024-12-10',
      department: 'Computer Science'
    },
    {
      id: 2,
      category: 'Library Issues',
      subject: 'Insufficient Study Materials',
      status: 'in-progress',
      date: '2024-12-12',
      department: 'Mathematics'
    },
    {
      id: 3,
      category: 'Academic Issues',
      subject: 'Unclear Assignment Guidelines',
      status: 'pending',
      date: '2024-12-15',
      department: 'Physics'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complaint Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for bringing this to our attention. We have received your complaint and it will be reviewed by our team within 24-48 hours.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">Complaint ID: #{complaintId}</p>
              <p className="text-blue-600 text-sm mt-1">Save this ID for future reference</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    studentId: '',
                    email: '',
                    department: '',
                    semester: '',
                    category: '',
                    subject: '',
                    description: '',
                    isAnonymous: false
                  });
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Submit Another Complaint
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Go Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Complaint</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your voice matters. Submit your concerns and we'll ensure they're addressed promptly and fairly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Complaint Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <MessageSquare className="text-red-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Complaint Form</h2>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                  <AlertCircle className="mr-2" size={20} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      required={!formData.isAnonymous}
                      disabled={formData.isAnonymous}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID *
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      required={!formData.isAnonymous}
                      disabled={formData.isAnonymous}
                      placeholder="Enter your student ID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      required={!formData.isAnonymous}
                      disabled={formData.isAnonymous}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester *
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      required
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={`${sem}`}>{sem}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your complaint"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Please provide detailed information about your complaint..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition-colors"
                    required
                  ></textarea>
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    id="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isAnonymous" className="text-sm text-gray-700">
                    Submit this complaint anonymously
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="text-blue-600" size={24} />
                <h3 className="text-lg font-bold text-blue-900">Guidelines</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Be specific and clear about your complaint</li>
                <li>• Provide all relevant details and context</li>
                <li>• Use respectful language</li>
                <li>• Include any supporting evidence if available</li>
                <li>• Allow 24-48 hours for initial response</li>
              </ul>
            </div>

            {/* Recent Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Complaints</h3>
              <div className="space-y-4">
                {recentComplaints.map(complaint => (
                  <div key={complaint.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm line-clamp-2">{complaint.subject}</p>
                        <p className="text-xs text-gray-500">{complaint.category}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {complaint.status === 'resolved' && <CheckCircle size={12} className="inline mr-1" />}
                        {complaint.status === 'in-progress' && <Clock size={12} className="inline mr-1" />}
                        {complaint.status === 'pending' && <AlertCircle size={12} className="inline mr-1" />}
                        {complaint.status}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <Calendar size={12} />
                      <span>{new Date(complaint.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>For urgent matters, contact us directly:</p>
                <p><strong>Email:</strong> sfi@college.edu</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Office Hours:</strong> 9 AM - 5 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;