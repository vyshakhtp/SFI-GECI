import React, { useState } from 'react';
import { Users, Mail, Phone, Linkedin, Star, Award, Calendar, MapPin } from 'lucide-react';

const MembersPage = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');

  const executiveMembers = [
    {
      id: 1,
      name: 'Arjun Kumar',
      position: 'President',
      year: 'Final Year',
      department: 'Computer Science',
      email: 'president@sfi.edu',
      phone: '+91 98765 43210',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      achievements: ['Led 15+ successful campaigns', 'Increased membership by 40%', 'Organized major cultural fest'],
      joinDate: '2022-08-15',
      quote: 'Fighting for students\' rights is not just our duty, but our passion.'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      position: 'Secretary',
      year: 'Third Year',
      department: 'Physics',
      email: 'secretary@sfi.edu',
      phone: '+91 98765 43211',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
      achievements: ['Streamlined administrative processes', 'Managed 20+ events', 'Student welfare initiatives'],
      joinDate: '2023-01-20',
      quote: 'Organization and dedication are the keys to meaningful change.'
    },
    {
      id: 3,
      name: 'Rahul Menon',
      position: 'Vice President',
      year: 'Final Year',
      department: 'Mechanical Engineering',
      email: 'vp@sfi.edu',
      phone: '+91 98765 43212',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      achievements: ['Infrastructure improvement campaigns', 'Sports facility upgrades', 'Inter-college collaborations'],
      joinDate: '2022-09-10',
      quote: 'Every student deserves quality education and proper facilities.'
    },
    {
      id: 4,
      name: 'Anjali Nair',
      position: 'Treasurer',
      year: 'Third Year',
      department: 'Commerce',
      email: 'treasurer@sfi.edu',
      phone: '+91 98765 43213',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300',
      achievements: ['Financial transparency initiatives', 'Scholarship programs', 'Budget optimization'],
      joinDate: '2023-02-05',
      quote: 'Financial integrity builds trust and enables greater impact.'
    }
  ];

  const departments = [
    {
      name: 'Media & Communications',
      head: 'Suresh Babu',
      members: 8,
      responsibilities: ['Social media management', 'Press releases', 'Event documentation']
    },
    {
      name: 'Cultural Affairs',
      head: 'Maya Iyer',
      members: 12,
      responsibilities: ['Event organization', 'Artist coordination', 'Cultural programs']
    },
    {
      name: 'Academic Affairs',
      head: 'Kiran Raj',
      members: 6,
      responsibilities: ['Study material coordination', 'Academic grievances', 'Research initiatives']
    },
    {
      name: 'Social Service',
      head: 'Deepa Thomas',
      members: 10,
      responsibilities: ['Community outreach', 'Volunteer coordination', 'Social awareness campaigns']
    },
    {
      name: 'Sports & Recreation',
      head: 'Arun Kumar',
      members: 7,
      responsibilities: ['Sports events', 'Fitness programs', 'Inter-college competitions']
    }
  ];

  const generalMembers = [
    { name: 'Vishnu Pillai', department: 'Computer Science', year: '2nd Year' },
    { name: 'Sreya Das', department: 'Physics', year: '1st Year' },
    { name: 'Aditya Sharma', department: 'Chemistry', year: '3rd Year' },
    { name: 'Kavya Menon', department: 'Mathematics', year: '2nd Year' },
    { name: 'Rohit Kumar', department: 'English', year: '1st Year' },
    { name: 'Nisha Nair', department: 'History', year: '3rd Year' }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated individuals working tirelessly for students' rights and welfare
          </p>
          
          {/* Year Selection */}
          <div className="mt-8 flex justify-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>
          </div>
        </div>

        {/* Executive Committee */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Executive Committee</h2>
            <p className="text-gray-600">The leadership team driving our vision forward</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {executiveMembers.map(member => (
              <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-red-300 font-semibold">{member.position}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2" />
                      <span>{member.department} • {member.year}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2" />
                      <span>Member since {new Date(member.joinDate).getFullYear()}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 italic">"{member.quote}"</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {member.achievements.slice(0, 2).map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <Award size={12} className="mr-1 mt-0.5 text-red-600 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Mail size={16} />
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Department Structure */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Department Structure</h2>
            <p className="text-gray-600">Specialized teams working on different aspects of student welfare</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                  <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    {dept.members} members
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Department Head:</p>
                  <p className="font-semibold text-gray-900">{dept.head}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Key Responsibilities:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {dept.responsibilities.map((responsibility, idx) => (
                      <li key={idx} className="flex items-start">
                        <Star size={12} className="mr-2 mt-0.5 text-red-600 flex-shrink-0" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* General Members */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Active Members</h2>
            <p className="text-gray-600">Dedicated students contributing to our cause</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalMembers.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Users className="text-red-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.department}</p>
                      <p className="text-xs text-red-600">{member.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Want to join our team?</p>
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200">
                Become a Member
              </button>
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Movement</h2>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Be part of the change you want to see. Together, we can build a stronger student community and fight for our rights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 font-semibold">
              Join as Member
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-red-600 transition-colors duration-200 font-semibold">
              Volunteer with Us
            </button>
          </div>
        </section>

        {/* Contact Committee */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Our Team</h2>
            <p className="text-gray-600">Have questions or suggestions? Reach out to us anytime</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Mail className="mx-auto text-red-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600">sfi@college.edu</p>
              </div>
              <div>
                <Phone className="mx-auto text-red-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
              <div>
                <MapPin className="mx-auto text-red-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600">Student Union Office<br />Main Building, Ground Floor</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MembersPage;