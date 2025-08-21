import React from 'react';
import { Users, BookOpen, MessageSquare, Award, ArrowRight, Calendar, Megaphone } from 'lucide-react';

const HomePage = () => {
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
              <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2">
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
              <h3 className="text-3xl font-bold text-gray-900 mb-2">200+</h3>
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
              <button className="text-red-600 font-semibold flex items-center space-x-2 hover:text-red-700">
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