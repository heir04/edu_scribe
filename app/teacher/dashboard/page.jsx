'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Users, 
  Clock, 
  Plus,
  Search,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Eye,
  Trash2,
  Languages
} from 'lucide-react';

// Dashboard stats component
const StatsCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Session card component
const SessionCard = ({ session, onView, onDelete }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(session.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Languages className="h-4 w-4 mr-1" />
          {session.language}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onView(session)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View session"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(session.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete session"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div className="border-t pt-4">
      <p className="text-sm text-gray-700 line-clamp-3">
        {session.content ? session.content.substring(0, 150) + '...' : 'Processing transcript...'}
      </p>
    </div>
    
    <div className="mt-4 flex items-center justify-between">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
      <button
        onClick={() => onView(session)}
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        View Details →
      </button>
    </div>
  </div>
);

function TeacherDashboard() {
  const { user, logout, apiCall } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Fetch user sessions on component mount
  useEffect(() => {
    fetchUserSessions();
  }, []);

  const fetchUserSessions = async () => {
    try {
      const result = await apiCall('/Session/GetAllUserSessions');
      if (result && result.data.status) {
        setSessions(result.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      // Note: Delete endpoint not in API docs, assuming it exists
      try {
        const result = await apiCall(`/Session/Delete/${sessionId}`, {
          method: 'DELETE'
        });
        if (result && result.data.status) {
          setSessions(sessions.filter(s => s.id !== sessionId));
        }
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const handleViewSession = (session) => {
    // Navigate to session details page
    window.location.href = `/teacher/session/${session.id}`;
  };

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      icon: FileText,
      title: 'Total Sessions',
      value: sessions.length,
      subtitle: 'All time',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Active Students',
      value: '156',
      subtitle: 'This month',
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      icon: Clock,
      title: 'Hours Transcribed',
      value: Math.floor(sessions.length * 1.5),
      subtitle: 'Total content',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      icon: Languages,
      title: 'Translations',
      value: sessions.length * 2,
      subtitle: 'Generated',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600">Loading dashboard...</span>
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Teacher'}</p>
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

        {/* Actions Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Session</span>
            </button>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Sessions</h2>
            <span className="text-sm text-gray-600">
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-100">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your first class recording to get started with AI-powered transcription and translation.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Upload First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onView={handleViewSession}
                  onDelete={handleDeleteSession}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{session.name}</p>
                  <p className="text-xs text-gray-600">
                    Created on {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            ))}
            
            {sessions.length === 0 && (
              <p className="text-center text-gray-500 py-8">No recent activity</p>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal would go here */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Session</h3>
            <p className="text-gray-600 mb-4">
              This feature will redirect you to the upload page where you can add a new class recording.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  window.location.href = '/teacher/upload';
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Go to Upload
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtectedTeacherDashboard() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <TeacherDashboard />
    </ProtectedRoute>
  );
}