'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { BookOpen, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">LMS</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-1">
              <Link
                href="/subjects"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Courses
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center text-sm text-slate-600">
                  <User className="w-4 h-4 mr-2 text-slate-400" />
                  {user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
