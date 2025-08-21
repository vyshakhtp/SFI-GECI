import React, { useState } from 'react';
import { Calendar, Users, Award, Camera, Filter, Search, X, ExternalLink } from 'lucide-react';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const categories = ['All', 'Cultural Events', 'Seminars', 'Protests', 'Social Activities', 'Awards', 'Workshops'];

  const galleryItems = [
    {
      id: 1,
      title: 'Annual Cultural Fest 2024',
      category: 'Cultural Events',
      date: '2024-12-01',
      participants: 500,
      description: 'A vibrant celebration of arts, culture, and student talent',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Dance Competition', 'Music Concert', 'Drama Performance']
    },
    {
      id: 2,
      title: 'Student Rights Awareness Seminar',
      category: 'Seminars',
      date: '2024-11-25',
      participants: 300,
      description: 'Educational seminar on student rights and responsibilities',
      image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Legal Rights Workshop', 'Q&A Session', 'Resource Distribution']
    },
    {
      id: 3,
      title: 'Climate Action Rally',
      category: 'Protests',
      date: '2024-11-20',
      participants: 800,
      description: 'Peaceful protest demanding climate action from authorities',
      image: 'https://images.pexels.com/photos/9324071/pexels-photo-9324071.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Banner Display', 'Speeches', 'Media Coverage']
    },
    {
      id: 4,
      title: 'Blood Donation Camp',
      category: 'Social Activities',
      date: '2024-11-15',
      participants: 150,
      description: 'Community service initiative to help save lives',
      image: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['200+ Donors', 'Medical Team', 'Refreshments']
    },
    {
      id: 5,
      title: 'Excellence in Leadership Award',
      category: 'Awards',
      date: '2024-11-10',
      participants: 50,
      description: 'Recognition ceremony for outstanding student leaders',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Award Ceremony', 'Guest Speakers', 'Networking']
    },
    {
      id: 6,
      title: 'Digital Skills Workshop',
      category: 'Workshops',
      date: '2024-11-05',
      participants: 120,
      description: 'Hands-on training in modern digital skills',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Coding Basics', 'Digital Marketing', 'Design Tools']
    },
    {
      id: 7,
      title: 'Traditional Day Celebration',
      category: 'Cultural Events',
      date: '2024-10-30',
      participants: 400,
      description: 'Celebrating our rich cultural heritage and traditions',
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Traditional Attire', 'Folk Dance', 'Cultural Exhibition']
    },
    {
      id: 8,
      title: 'Education Policy Debate',
      category: 'Seminars',
      date: '2024-10-25',
      participants: 200,
      description: 'Open debate on current education policies and reforms',
      image: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Expert Panel', 'Student Participation', 'Policy Discussion']
    }
  ];

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our journey through images - capturing moments of activism, celebration, and community building
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category.toLowerCase()
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredItems.length} of {galleryItems.length} events
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(item)}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </div>
                <button 
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  onClick={() => setSelectedImage(item)}
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{item.participants}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1">
                  {item.highlights.slice(0, 2).map((highlight, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {highlight}
                    </span>
                  ))}
                  {item.highlights.length > 2 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{item.highlights.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Camera className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full max-h-full overflow-auto">
              <div className="relative">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                >
                  <X size={24} />
                </button>
                
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto rounded-lg"
                />
                
                <div className="bg-white rounded-lg p-6 mt-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
                      <p className="text-gray-600">{selectedImage.description}</p>
                    </div>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImage.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>{new Date(selectedImage.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={16} />
                      <span>{selectedImage.participants} participants</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Highlights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.highlights.map((highlight: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8 border border-red-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-red-600">50+</div>
                <div className="text-gray-700">Events Organized</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">2500+</div>
                <div className="text-gray-700">Students Reached</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">15+</div>
                <div className="text-gray-700">Awards Won</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">3</div>
                <div className="text-gray-700">Years Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;