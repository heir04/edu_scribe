'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Image from 'next/image';
import { 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  Languages, 
  Download, 
  Share2,
  Calendar,
  User,
  Clock,
  Globe,
  Copy,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  X
} from 'lucide-react';

function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { apiCall, isTeacher } = useAuth();
  
  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transcript');
  const [newTranslationLang, setNewTranslationLang] = useState('');
  const [creatingTranslation, setCreatingTranslation] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const availableLanguages = [
    { code: 'yo', name: 'Yoruba' },
    { code: 'ig', name: 'Igbo' }, 
    { code: 'ha', name: 'Hausa' }
  ];

  // Helper function to get language display name from code
  const getLanguageName = (code) => {
    const lang = availableLanguages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  // Show error message with auto-dismiss
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Show success message with auto-dismiss
  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  useEffect(() => {
    if (params.id) {
      fetchSessionData();
    }
  }, [params.id]);

  const fetchSessionData = async () => {
    try {
      // Fetch session details
      const sessionResult = await apiCall(`/Session/Get/${params.id}`);
      if (sessionResult && sessionResult.data.status) {
        setSession(sessionResult.data.data);
      } else if (sessionResult) {
        showError(sessionResult.data.message || 'Failed to load session details.');
      }

      // Fetch summary
      const summaryResult = await apiCall(`/Summary/Get/${params.id}`);
      if (summaryResult && summaryResult.data.status) {
        setSummary(summaryResult.data.data);
      } else if (summaryResult) {
        // Summary might not be ready yet, so don't show error for this
        console.log('Summary not ready yet:', summaryResult.data.message);
      }

      // Fetch available translations (list only)
      const translationsResult = await apiCall(`/SessionTranslation/GetAll/${params.id}`);
      if (translationsResult && translationsResult.data.status) {
        setTranslations(translationsResult.data.data || []);
      } else if (translationsResult) {
        showError(translationsResult.data.message || 'Failed to load translations.');
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      showError('Failed to load session data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTranslationContent = async (translationId) => {
    setLoadingTranslation(true);
    setError(null); // Clear any previous errors
    
    try {
      const result = await apiCall(`/SessionTranslation/GetById/${translationId}`);
      if (result && result.data.status) {
        setSelectedTranslation(result.data.data);
      } else {
        const errorMessage = result?.data?.message || 'Failed to load translation content.';
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching translation content:', error);
      showError('Network error. Failed to load translation content.');
    } finally {
      setLoadingTranslation(false);
    }
  };

  const handleCreateTranslation = async () => {
    if (!newTranslationLang) return;

    setCreatingTranslation(true);
    setError(null); // Clear any previous errors
    
    try {
      const result = await apiCall(`/SessionTranslation/Create/${params.id}`, {
        method: 'POST',
        body: JSON.stringify({ language: newTranslationLang })
      });

      if (result && result.data.status) {
        // Add the new translation to the list (without content initially)
        const newTranslation = {
          id: result.data.data.id,
          targetLanguage: result.data.data.language,
          sessionId: params.id
        };
        setTranslations([...translations, newTranslation]);
        setNewTranslationLang('');
        
        // Show success message
        showSuccess(`${getLanguageName(newTranslationLang)} translation created successfully!`);
        
        // Automatically fetch and display the new translation content
        setSelectedTranslation(result.data.data);
      } else {
        // Handle API response with status: false
        const errorMessage = result?.data?.message || 'Failed to create translation. Please try again.';
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Error creating translation:', error);
      showError('Network error. Please check your connection and try again.');
    } finally {
      setCreatingTranslation(false);
    }
  };

  const handleCopyText = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session not found</h2>
          <p className="text-gray-600 mb-4">The session you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-md">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-md">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm">{success}</p>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <Image 
                src="/image/logo.png" 
                alt="EduScribe Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {session.teacherName}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(session.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {session.language}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopyText(window.location.href, 'link')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copiedText === 'link' ? <CheckCircle className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                <span>{copiedText === 'link' ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transcript'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Transcript
              </button>
              
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'summary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="h-4 w-4 inline mr-2" />
                Summary
              </button>
              
              <button
                onClick={() => setActiveTab('translations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'translations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Languages className="h-4 w-4 inline mr-2" />
                Translations ({translations.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Transcript Tab */}
            {activeTab === 'transcript' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Full Transcript</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyText(session.content, 'transcript')}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    >
                      {copiedText === 'transcript' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>{copiedText === 'transcript' ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload(session.content, `${session.name}_transcript.txt`)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {session.content || 'Transcript is being processed...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Session Summary</h2>
                  {summary && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyText(summary.summaryText, 'summary')}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        {copiedText === 'summary' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copiedText === 'summary' ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => handleDownload(summary.summaryText, `${session.name}_summary.txt`)}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {summary ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {summary.summaryText}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">Summary being generated</h3>
                    <p className="text-yellow-700">
                      The AI is currently generating a summary for this session. Please check back in a few minutes.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Translations Tab */}
            {activeTab === 'translations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Available Translations</h2>
                  
                  {/* Add Translation */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={newTranslationLang}
                      onChange={(e) => setNewTranslationLang(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select language</option>
                      {availableLanguages.filter(lang => 
                        !translations.some(t => t.targetLanguage === lang.code)
                      ).map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleCreateTranslation}
                      disabled={!newTranslationLang || creatingTranslation}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingTranslation ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      <span>{creatingTranslation ? 'Creating...' : 'Add Translation'}</span>
                    </button>
                  </div>
                </div>
                
                {translations.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Translation List */}
                    <div className="lg:col-span-1">
                      <h3 className="text-md font-medium text-gray-900 mb-4">Available Languages</h3>
                      <div className="space-y-2">
                        {translations.map((translation) => (
                          <button
                            key={translation.id}
                            onClick={() => fetchTranslationContent(translation.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedTranslation?.id === translation.id
                                ? 'border-blue-500 bg-blue-50 text-blue-900'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Languages className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">{getLanguageName(translation.language)}</span>
                              </div>
                              {selectedTranslation?.id === translation.id && loadingTranslation && (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Translation Content */}
                    <div className="lg:col-span-2">
                      {selectedTranslation ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-md font-medium text-gray-900">
                              {getLanguageName(selectedTranslation.targetLanguage)} Translation
                            </h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCopyText(selectedTranslation.translatedContent, 'selected-translation')}
                                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                              >
                                {copiedText === 'selected-translation' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                <span>{copiedText === 'selected-translation' ? 'Copied!' : 'Copy'}</span>
                              </button>
                              <button
                                onClick={() => handleDownload(
                                  selectedTranslation.translatedContent, 
                                  `${session.name}_${getLanguageName(selectedTranslation.targetLanguage)}.txt`
                                )}
                                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                          
                          {loadingTranslation ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                              <p className="text-gray-600">Loading translation...</p>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-6">
                              <div className="prose max-w-none">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                  {selectedTranslation.translatedText}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                          <Languages className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Translation</h3>
                          <p className="text-gray-500">
                            Choose a language from the left to view the translated content.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                    <Languages className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-blue-800 mb-2">No translations yet</h3>
                    <p className="text-blue-700 mb-4">
                      Create translations to make this content accessible in multiple languages including Nigerian local languages.
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <select
                        value={newTranslationLang}
                        onChange={(e) => setNewTranslationLang(e.target.value)}
                        className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select language</option>
                        {availableLanguages.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleCreateTranslation}
                        disabled={!newTranslationLang || creatingTranslation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creatingTranslation ? 'Creating...' : 'Create First Translation'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Word Count</p>
                <p className="text-lg font-semibold text-gray-900">
                  {session.content ? session.content.split(' ').length.toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Duration</p>
                <p className="text-lg font-semibold text-gray-900">
                  {session.content ? Math.ceil(session.content.split(' ').length / 150) : '0'} min
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <Languages className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Languages</p>
                <p className="text-lg font-semibold text-gray-900">
                  {translations.length + 1} {/* +1 for original language */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleDownload(session.content, `${session.name}_full_content.txt`)}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Download All Content</span>
            </button>
            
            <button
              onClick={() => handleCopyText(window.location.href, 'share')}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copiedText === 'share' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Share2 className="h-5 w-5 text-gray-600" />}
              <span className="text-gray-700">{copiedText === 'share' ? 'Link Copied!' : 'Share Session'}</span>
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Print Content</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProtectedSessionDetailPage() {
  return (
    <ProtectedRoute>
      <SessionDetailPage />
    </ProtectedRoute>
  );
}