'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Image from 'next/image';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  User, 
  Languages,
  FileText,
  Clock,
  Eye,
  Download,
  Play,
  Settings,
  LogOut,
  Filter
} from 'lucide-react';

// Session card for students
const SessionCard = ({ session, onView }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <User className="h-4 w-4 mr-1" />
          {session.teacherName}
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(session.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Languages className="h-4 w-4 mr-1" />
          {session.language}
        </div>
      </div>
    </div>
    
    <div className="border-t pt-4">
      <p className="text-sm text-gray-700 line-clamp-3 mb-4">
        {session.content ? session.content.substring(0, 150) + '...' : 'Transcript available'}
      </p>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FileText className="h-3 w-3 mr-1" />
          Transcript
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <BookOpen className="h-3 w-3 mr-1" />
          Summary
        </span>
      </div>
      <button
        onClick={() => onView(session)}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </button>
    </div>
  </div>
);

// Stats card for students
const StatsCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

function StudentDashboard() {
  const { user, logout, apiCall } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  // Fetch all sessions on component mount
  useEffect(() => {
    fetchAllSessions();
  }, []);

  const fetchAllSessions = async () => {
    try {
      const result = await apiCall('/Session/GetAll');
      if (result && result.data.status) {
        setSessions(result.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSession = (session) => {
    // Navigate to session details page
    window.location.href = `/student/session/${session.id}`;
  };

  // Get unique teachers and languages for filtering
  const uniqueTeachers = [...new Set(sessions.map(s => s.teacherName))];
  const uniqueLanguages = [...new Set(sessions.map(s => s.language))];

  // Filter sessions based on search and filters
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeacher = !filterTeacher || session.teacherName === filterTeacher;
    const matchesLanguage = !filterLanguage || session.language === filterLanguage;
    
    return matchesSearch && matchesTeacher && matchesLanguage;
  });

  const stats = [
    {
      icon: BookOpen,
      title: 'Available Sessions',
      value: sessions.length,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: 'Transcripts Read',
      value: Math.floor(sessions.length * 0.7), // Simulate viewed sessions
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      icon: Languages,
      title: 'Languages Available',
      value: uniqueLanguages.length,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Hours of Content',
      value: Math.floor(sessions.length * 1.2),
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600">Loading sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image 
                src="/image/logo.png" 
                alt="EduScribe Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Student'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions or teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Teacher Filter */}
            <select
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Teachers</option>
              {uniqueTeachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              {uniqueLanguages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {(filterTeacher || filterLanguage || searchTerm) && (
              <button
                onClick={() => {
                  setFilterTeacher('');
                  setFilterLanguage('');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Available Sessions</h2>
            <span className="text-sm text-gray-600">
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-100">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {sessions.length === 0 ? 'No sessions available yet' : 'No sessions match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {sessions.length === 0 
                  ? 'Check back later when teachers upload new content.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {sessions.length > 0 && (
                <button
                  onClick={() => {
                    setFilterTeacher('');
                    setFilterLanguage('');
                    setSearchTerm('');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Show All Sessions
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onView={handleViewSession}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Added</h2>
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => handleViewSession(session)}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{session.name}</p>
                  <p className="text-xs text-gray-600">
                    by {session.teacherName} • {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {sessions.length === 0 && (
              <p className="text-center text-gray-500 py-8">No sessions available</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <FileText className="h-8 w-8 mb-3" />
            <h3 className="font-semibold mb-2">Browse Transcripts</h3>
            <p className="text-sm opacity-90 mb-4">
              Access complete transcripts of all available sessions
            </p>
            <button className="text-sm font-medium underline hover:no-underline">
              View All →
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <Languages className="h-8 w-8 mb-3" />
            <h3 className="font-semibold mb-2">Translations</h3>
            <p className="text-sm opacity-90 mb-4">
              Get content translated to your preferred language
            </p>
            <button className="text-sm font-medium underline hover:no-underline">
              Explore →
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <BookOpen className="h-8 w-8 mb-3" />
            <h3 className="font-semibold mb-2">Summaries</h3>
            <p className="text-sm opacity-90 mb-4">
              Quick summaries to help you review key concepts
            </p>
            <button className="text-sm font-medium underline hover:no-underline">
              Read Now →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProtectedStudentDashboard() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  );
}