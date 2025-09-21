import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Languages, 
  Clock, 
  Play,
  CheckCircle,
  ArrowRight,
  Users,
  Globe,
  Zap,
  Star
} from 'lucide-react';

// Header Component
const Header = () => (
  <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-2">
          <Image 
            src="/image/logo.png" 
            alt="EduScribe Logo" 
            width={32} 
            height={32} 
            className="rounded-lg"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EduScribe
          </span>
        </div>
        <nav className="hidden md:flex space-x-8 ml-auto mr-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <button className="hidden sm:block text-gray-600 hover:text-gray-900 transition-colors">Sign In</button>
          </Link>
          <Link href="/register/teacher">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  </header>
);

// Hero Section
const Hero = () => (
  <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
        <div className="mb-16 lg:mb-0">
          {/* <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered Education
            </span>
          </div> */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Transform
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Lectures </span>
            into Learning
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Upload once, access forever. EduScribe automatically transcribes, summarizes, and translates 
            your recorded classes into multiple languages including Nigerian local languages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/register/teacher">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-200 flex items-center justify-center w-full">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            {/* <button className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-300 hover:shadow-md transition-all duration-200 flex items-center justify-center">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </button> */}
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-semibold text-gray-900">4.9</span>
              <span className="ml-1">rating</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-1" />
              <span>100+ teachers</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-1" />
              <span>3 languages</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Physics Lecture - Wave Motion</h3>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Processing Complete</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Transcription Progress</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Audio transcribed to text
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Summary generated
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Translated to Yoruba, Igbo, Hausa
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl transform -rotate-3 scale-110 opacity-10"></div>
        </div>
      </div>
    </div>
  </section>
);

// Features Section
const Features = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Once, Access Forever",
      description: "Teachers can easily upload recorded classes and lectures. Our platform stores them securely for unlimited access.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "Automatic Transcription",
      description: "Advanced AI converts speech to accurate text transcripts, giving students complete written records of every lecture.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BookOpen,
      title: "Smart Summarization",
      description: "Generate easy-to-digest summaries of class content, highlighting key concepts and important takeaways.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Languages,
      title: "Multi-Language Translation",
      description: "Translate transcripts into preferred languages, including Nigerian local languages like Yoruba, Igbo, and Hausa.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Anytime Learning",
      description: "Students who miss class can catch up easily with complete transcripts, summaries, and translations available 24/7.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modern Education</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            EduScribe combines cutting-edge AI technology with educational expertise to create 
            the perfect learning companion for teachers and students.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Upload Your Lecture",
      description: "Simply drag and drop your recorded class files. We support all major audio and video formats.",
      icon: Upload
    },
    {
      step: "02", 
      title: "AI Processing",
      description: "Our advanced AI automatically transcribes speech to text and generates intelligent summaries.",
      icon: Zap
    },
    {
      step: "03",
      title: "Multi-Language Access",
      description: "Students access transcripts and summaries in their preferred language, including local Nigerian languages.",
      icon: Languages
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How EduScribe Works</h2>
          <p className="text-xl text-gray-600">Simple, powerful, and designed for educators</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {step.step}
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTA = () => (
  <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-white mb-6">
        Ready to Transform Your Teaching?
      </h2>
      <p className="text-xl text-blue-100 mb-8">
        Join thousands of educators who are making learning more accessible 
        with EduScribe's AI-powered transcription and translation.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/register/teacher">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-200">
            Get Started
          </button>
        </Link>
        {/* <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
          Schedule Demo
        </button> */}
      </div>
      {/* <p className="text-blue-200 text-sm mt-6">No credit card required • 14-day free trial • Cancel anytime</p> */}
    </div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <Image 
              src="/image/logo.png" 
              alt="EduScribe Logo" 
              width={32} 
              height={32}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-white">EduScribe</span>
          </div>
          <p className="text-gray-400">
            Making education accessible through AI-powered transcription and translation.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 EduScribe. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Main Page Component
export default function EduScribeLanding() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}