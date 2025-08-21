import React, { useState } from 'react';
import { Home, FileText, MessageSquare, Image, Users, Settings, Menu, X, Upload, Eye } from 'lucide-react';
import HomePage from './components/HomePage';
import NotesPage from './components/NotesPage';
import ComplaintsPage from './components/ComplaintsPage';
import GalleryPage from './components/GalleryPage';
import MembersPage from './components/MembersPage';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

type Page = 'home' | 'notes' | 'complaints' | 'gallery' | 'members' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const handlePageChange = (page: Page) => {
    if (page === 'admin' && !isAdminLoggedIn) {
      // Will show login form
    }
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'notes':
        return <NotesPage />;
      case 'complaints':
        return <ComplaintsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'members':
        return <MembersPage />;
      case 'admin':
        if (isAdminLoggedIn) {
          return <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />;
        } else {
          return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
        }
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-red-600 shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-xl">SFI</span>
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">SFI Unit</h1>
                <p className="text-red-100 text-sm hidden sm:block">Students' Federation of India</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id as Page)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-red-700 text-white'
                      : 'text-red-100 hover:bg-red-700 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-red-100 hover:bg-red-700 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-red-600 border-t border-red-500 shadow-lg">
              <nav className="flex flex-col">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id as Page)}
                    className={`flex items-center space-x-3 px-6 py-3 border-b border-red-500 transition-colors duration-200 ${
                      currentPage === item.id
                        ? 'bg-red-700 text-white'
                        : 'text-red-100 hover:bg-red-700 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SFI</span>
              </div>
              <h3 className="text-xl font-bold">Students' Federation of India</h3>
            </div>
            <p className="text-gray-400 mb-2">College Unit</p>
            <p className="text-sm text-gray-500">
              © 2025 SFI Unit. All rights reserved. Fighting for students' rights and quality education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;