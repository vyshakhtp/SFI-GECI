import React, { useState } from 'react';
import { MessageSquare, Send, AlertCircle, CheckCircle, Clock, User, Calendar } from 'lucide-react';

const ComplaintsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    department: '',
    semester: '',
    category: '',
    subject: '',
    description: '',
    anonymous: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Complaint submitted:', formData);
    setIsSubmitted(true);
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
      <div className="py-16">
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
              <p className="text-blue-800 font-medium">Complaint ID: #SFI2024{Math.floor(Math.random() * 1000)}</p>
              <p className="text-blue-600 text-sm mt-1">Save this ID for future reference</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Submit Another Complaint
              </button>
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
                    anonymous: false
                  });
                }}
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
    <div className="py-8">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      required={!formData.anonymous}
                      disabled={formData.anonymous}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      required={!formData.anonymous}
                      disabled={formData.anonymous}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      required={!formData.anonymous}
                      disabled={formData.anonymous}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                    required
                  ></textarea>
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="anonymous"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Submit this complaint anonymously
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Send size={20} />
                  <span>Submit Complaint</span>
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