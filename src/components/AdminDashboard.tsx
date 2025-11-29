import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Image, 
  Bell, 
  Users, 
  Download, 
  Eye, 
  Trash2, 
  Edit, 
  Plus,
  LogOut,
  Calendar,
  TrendingUp,
  Search
} from 'lucide-react';
import UploadNoteModal from './UploadNoteModal';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Note {
  _id: string;
  title: string;
  subject: string;
  semester: string;
  department: string;
  type: string;
  downloads: number;
  createdAt: string;
  fileUrl: string;
  fileName: string;
  description: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Total Notes', value: '156', change: '+12', trend: 'up' },
    { label: 'Pending Complaints', value: '8', change: '-3', trend: 'down' },
    { label: 'Gallery Items', value: '89', change: '+5', trend: 'up' },
    { label: 'Active Members', value: '524', change: '+18', trend: 'up' },
  ];

  const recentComplaints = [
    { id: 1, title: 'Library AC not working', category: 'Infrastructure', status: 'pending', date: '2024-12-15' },
    { id: 2, title: 'Unclear assignment guidelines', category: 'Academic', status: 'in-progress', date: '2024-12-14' },
    { id: 3, title: 'Canteen food quality', category: 'Food', status: 'resolved', date: '2024-12-13' },
  ];

  const recentNotes = [
    { id: 1, title: 'Data Structures Notes', subject: 'Computer Science', downloads: 45, date: '2024-12-12' },
    { id: 2, title: 'Calculus Chapter 5', subject: 'Mathematics', downloads: 23, date: '2024-12-10' },
    { id: 3, title: 'Organic Chemistry', subject: 'Chemistry', downloads: 67, date: '2024-12-08' },
  ];

  // Fetch notes
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/notes');
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'notes') {
      fetchNotes();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleUploadSuccess = () => {
    fetchNotes(); // Refresh the notes list
  };

  const handleViewNote = (noteId: string) => {
    window.open(`http://localhost:5000/api/notes/${noteId}/view`, '_blank');
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
        alert('Note deleted successfully');
      } else {
        const errorData = await response.json();
        alert('Failed to delete note: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note. Please try again.');
    }
  };

  // Filter notes based on search and filters
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(notes.map(note => note.subject))];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'members', label: 'Members', icon: Users },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={16} className={stat.trend === 'down' ? 'transform rotate-180' : ''} />
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h3>
          <div className="space-y-3">
            {recentComplaints.map(complaint => (
              <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{complaint.title}</p>
                  <p className="text-xs text-gray-500">{complaint.category}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{complaint.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Notes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Notes</h3>
          <div className="space-y-3">
            {recentNotes.map(note => (
              <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{note.title}</p>
                  <p className="text-xs text-gray-500">{note.subject}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{note.downloads}</p>
                  <p className="text-xs text-gray-500">downloads</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotesManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Notes Management</h2>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Upload Notes</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search notes by title, subject, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredNotes.length} of {notes.length} notes
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotes.map(note => (
                  <tr key={note._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{note.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sem {note.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.downloads}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a 
                          href={`http://localhost:5000${note.fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => handleViewNote(note._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Note"
                        >
                          <Eye size={16} />
                        </a>
                        <a
                          href={`http://localhost:5000/api/notes/${note._id}/download`}
                          className="text-green-600 hover:text-green-900"
                          title="Download Note"
                        >
                          <Download size={16} />
                        </a>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          title="Delete Note"
                          onClick={() => handleDeleteNote(note._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredNotes.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {notes.length === 0 ? (
                  <div>
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p>No notes uploaded yet. Upload your first note!</p>
                  </div>
                ) : (
                  <p>No notes found matching your search criteria.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <UploadNoteModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );

  const renderComplaintsManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentComplaints.map(complaint => (
                <tr key={complaint.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{complaint.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'notes':
        return renderNotesManagement();
      case 'complaints':
        return renderComplaintsManagement();
      case 'gallery':
        return <div className="text-center py-12 text-gray-500">Gallery management coming soon...</div>;
      case 'notifications':
        return <div className="text-center py-12 text-gray-500">Notifications management coming soon...</div>;
      case 'members':
        return <div className="text-center py-12 text-gray-500">Members management coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SFI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
  <div className="flex items-center space-x-2">
    <Calendar size={16} className="text-gray-400" />
    <span className="text-sm text-gray-600">{new Date().toLocaleDateString()}</span>
  </div>
  <div className="text-sm text-gray-600">
    Welcome, {user?.username || 'Admin'} (Role: {user?.role})
  </div>
  <button
    onClick={handleLogout}
    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
  >
    <LogOut size={16} />
    <span>Logout</span>
            </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-lg p-6 mr-6">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;