import React, { useState, useEffect } from 'react';
import { Users, BookOpen, MessageSquare, Award, ArrowRight, Calendar, Megaphone, Download, Search } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  subject: string;
  semester: string;
  department: string;
  type: string;
  downloads: number;
  createdAt: string;
  description: string;
  fileUrl: string;
  fileName: string;
}

const HomePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes?limit=6');
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || note.department === selectedDepartment;
    const matchesSem = selectedSemester === 'all' || note.semester === selectedSemester;
    return matchesSearch && matchesDept && matchesSem;
  });

  const departments = [...new Set(notes.map(note => note.department))];
  const semesters = [...new Set(notes.map(note => note.semester))].sort();

  const handleDownload = async (noteId: string, fileName: string) => {
    try {
      window.open(`http://localhost:5000/api/notes/${noteId}/download`, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-red-200">GECI SFI Unit</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Students' Federation of India - Fighting for students' rights, quality education, and social justice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('notes-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <BookOpen size={20} />
                <span>Access Notes</span>
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                <MessageSquare size={20} />
                <span>Submit Complaint</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-red-600" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-red-600" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{notes.length}+</h3>
              <p className="text-gray-600">Study Materials</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-red-600" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Events Organized</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-red-600" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100+</h3>
              <p className="text-gray-600">Issues Resolved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive support to students in their academic and personal growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Study Materials</h3>
              <p className="text-gray-600 mb-6">
                Access comprehensive notes, previous year papers, and study guides for all subjects
              </p>
              <button 
                onClick={() => document.getElementById('notes-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-red-600 font-semibold flex items-center space-x-2 hover:text-red-700"
              >
                <span>Access Notes</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Student Grievances</h3>
              <p className="text-gray-600 mb-6">
                Submit your complaints and concerns. We ensure every voice is heard and addressed
              </p>
              <button className="text-red-600 font-semibold flex items-center space-x-2 hover:text-red-700">
                <span>Submit Complaint</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Events & Activities</h3>
              <p className="text-gray-600 mb-6">
                Participate in cultural events, seminars, workshops, and social awareness programs
              </p>
              <button className="text-red-600 font-semibold flex items-center space-x-2 hover:text-red-700">
                <span>View Gallery</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <section id="notes-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Study Materials</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access comprehensive notes, previous year papers, and study guides for all subjects
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notes by title, subject, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="all">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {filteredNotes.slice(0, 6).map(note => (
                  <div key={note._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-red-600" size={24} />
                      </div>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        Sem {note.semester}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{note.description || 'No description available'}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{note.subject}</span>
                      <span>{note.department}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{note.downloads} downloads</span>
                      <button
                        onClick={() => handleDownload(note._id, note.fileName)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 text-sm"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredNotes.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedDepartment !== 'all' || selectedSemester !== 'all' 
                      ? 'Try changing your search filters.' 
                      : 'No notes available yet. Check back soon!'}
                  </p>
                </div>
              )}

              {filteredNotes.length > 6 && (
                <div className="text-center">
                  <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 mx-auto">
                    <BookOpen size={20} />
                    <span>View All Notes</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Updates</h2>
            <p className="text-xl text-gray-600">Stay informed about recent activities and announcements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <Megaphone className="text-red-600" size={20} />
                <span className="text-red-600 font-semibold text-sm">ANNOUNCEMENT</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">New Study Materials Added</h3>
              <p className="text-gray-700 text-sm mb-3">
                Fresh notes for Computer Science and Mathematics subjects are now available
              </p>
              <span className="text-xs text-red-600 font-medium">2 days ago</span>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="text-blue-600" size={20} />
                <span className="text-blue-600 font-semibold text-sm">ACHIEVEMENT</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Student Rights Seminar Success</h3>
              <p className="text-gray-700 text-sm mb-3">
                Over 300 students participated in our recent awareness seminar
              </p>
              <span className="text-xs text-blue-600 font-medium">5 days ago</span>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="text-green-600" size={20} />
                <span className="text-green-600 font-semibold text-sm">UPCOMING</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cultural Fest 2025</h3>
              <p className="text-gray-700 text-sm mb-3">
                Registration opens soon for our annual cultural festival
              </p>
              <span className="text-xs text-green-600 font-medium">Next week</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Our Movement</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Be part of the change. Together we can build a better future for students
          </p>
          <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2 mx-auto">
            <Users size={20} />
            <span>View Our Team</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;