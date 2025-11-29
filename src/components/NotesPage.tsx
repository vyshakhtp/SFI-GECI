import React, { useState, useEffect } from 'react';
import { Search, Download, BookOpen, Filter, Calendar, FileText, Star } from 'lucide-react';

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

const NotesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);

  // Fetch notes from API
  useEffect(() => {
    fetchNotes();
    fetchMetadata();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/notes?limit=50');
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [subjectsRes, semestersRes] = await Promise.all([
        fetch('http://localhost:5000/api/notes/meta/subjects'),
        fetch('http://localhost:5000/api/notes/meta/semesters')
      ]);
      
      const subjectsData = await subjectsRes.json();
      const semestersData = await semestersRes.json();
      
      setSubjects(subjectsData || []);
      setSemesters(semestersData || []);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const handleDownload = async (noteId: string, fileName: string) => {
    try {
      window.open(`http://localhost:5000/api/notes/${noteId}/download`, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleViewNote = (noteId: string) => {
  // Open PDF in new tab
  window.open(`http://localhost:5000/api/notes/${noteId}/view`, '_blank');
};




  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.description && note.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    const matchesSemester = selectedSemester === 'all' || note.semester === selectedSemester;
    
    return matchesSearch && matchesSubject && matchesSemester;
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Materials</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive notes, previous papers, and study guides contributed by our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notes by title, subject, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="all">All Semesters</option>
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester} Semester</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredNotes.length} of {notes.length} study materials
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map(note => (
                <div key={note._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="text-red-600" size={24} />
                        </div>
                      
                      </div>
                       <div>
                          <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-full">
                            {note.semester} SEM
                          </span>
                        </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
                    <p className="text-red-600 font-medium text-sm mb-1">{note.subject}</p>
                    <p className="text-gray-500 text-sm mb-4">{note.type}</p>

                    {/* Description */}
                    {note.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {note.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span>{note.downloads} downloads</span>
                      </div>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleDownload(note._id, note.fileName)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                      <button   onClick={() => handleViewNote(note._id)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <BookOpen size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredNotes.length === 0 && notes.length > 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Empty State */}
            {notes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes available yet</h3>
                <p className="text-gray-600">Check back later for study materials</p>
              </div>
            )}
          </>
        )}

        {/* Upload Request */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8 border border-red-200">
          <div className="text-center">
            <BookOpen className="mx-auto text-red-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Can't Find What You're Looking For?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              If you have notes to share or need specific study materials, reach out to us. 
              Together we can build a comprehensive resource library for all students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200">
                Request Notes
              </button>
              <button className="border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200">
                Contribute Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;