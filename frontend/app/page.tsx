import Link from "next/link";
import { BookOpen, Play, Award, Users, GraduationCap, Clock, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4 mr-2" />
              Start your learning journey today
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Master New Skills with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Structured Learning</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Professional video courses with sequential learning paths. Complete each lesson 
              to unlock the next and track your progress every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/subjects"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Courses
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900">4+</div>
              <div className="text-slate-500 mt-1">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">10+</div>
              <div className="text-slate-500 mt-1">Video Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">Free</div>
              <div className="text-slate-500 mt-1">Access</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">24/7</div>
              <div className="text-slate-500 mt-1">Learning</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Designed for learners who want a structured, professional learning experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Play className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Video Learning</h3>
              <p className="text-slate-600 leading-relaxed">
                High-quality video content from expert instructors to help you master new skills at your own pace.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Sequential Progress</h3>
              <p className="text-slate-600 leading-relaxed">
                Structured curriculum where you complete lessons in order for maximum knowledge retention.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Track Progress</h3>
              <p className="text-slate-600 leading-relaxed">
                Monitor your learning journey with detailed progress tracking and resume where you left off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of learners and start your journey today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
