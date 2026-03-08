'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Section, Progress } from '@/types';
import { ChevronDown, ChevronRight, CheckCircle, Lock, PlayCircle } from 'lucide-react';

interface SidebarProps {
  subjectId: string;
  sections: Section[];
  currentVideoId: string;
  progress: Progress | null;
}

export function Sidebar({ subjectId, sections, currentVideoId, progress }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // Expand all sections by default
    return new Set(sections.map((s) => s.id));
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Progress Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Course Progress</h3>
        {progress && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{progress.percent_complete}% complete</span>
              <span>
                {progress.completed_videos}/{progress.total_videos} videos
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress.percent_complete}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="divide-y divide-gray-100">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 text-left">{section.title}</span>
              {expandedSections.has(section.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.has(section.id) && (
              <div className="bg-gray-50">
                {section.videos.map((video) => {
                  const isCurrent = video.id === currentVideoId;
                  const isLocked = video.locked;
                  const isCompleted = video.is_completed;

                  return (
                    <Link
                      key={video.id}
                      href={isLocked ? '#' : `/learn/${subjectId}/video/${video.id}`}
                      className={`flex items-center px-4 py-3 text-sm transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 border-l-4 border-blue-600'
                          : 'hover:bg-gray-100 border-l-4 border-transparent'
                      } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                      onClick={(e) => {
                        if (isLocked) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span className="mr-3">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </span>
                      <span
                        className={`flex-1 ${
                          isCurrent ? 'text-blue-900 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {video.title}
                      </span>
                      {video.duration_seconds && (
                        <span className="text-xs text-gray-500 ml-2">
                          {Math.floor(video.duration_seconds / 60)}:
                          {String(video.duration_seconds % 60).padStart(2, '0')}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
