'use client';

import { useState, useEffect, useMemo } from 'react';

// Build hierarchical structure from flat headings
function buildHeadingTree(headings) {
  const tree = [];
  const stack = [{ level: 0, children: tree }];

  headings.forEach((heading) => {
    const node = { ...heading, children: [] };

    // Find the correct parent
    while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);
    stack.push(node);
  });

  return tree;
}

function HeadingItem({ heading, activeId, onNavigate, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = heading.children && heading.children.length > 0;

  // Auto-expand if active heading is within this section
  useEffect(() => {
    if (hasChildren) {
      const isActiveInChildren = (node) => {
        if (node.id === activeId) return true;
        return node.children?.some(isActiveInChildren) || false;
      };
      if (heading.id === activeId || heading.children.some(isActiveInChildren)) {
        setIsExpanded(true);
      }
    }
  }, [activeId, heading, hasChildren]);

  const isActive = heading.id === activeId;

  return (
    <li>
      <div className="flex items-center gap-1">
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onNavigate(heading.id)}
          className={`flex-1 text-left py-1 text-sm transition-all duration-200 truncate ${
            !hasChildren ? 'ml-5' : ''
          } ${
            isActive
              ? 'text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          title={heading.text}
        >
          {heading.text}
        </button>
      </div>

      {hasChildren && (
        <ul
          className={`ml-4 border-l border-gray-200 pl-2 space-y-1 overflow-hidden transition-all duration-200 ${
            isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
          }`}
        >
          {heading.children.map((child, index) => (
            <HeadingItem
              key={index}
              heading={child}
              activeId={activeId}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ArticleSidebar({ headings }) {
  const [activeId, setActiveId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const headingTree = useMemo(() => buildHeadingTree(headings), [headings]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0,
      }
    );

    const timer = setTimeout(() => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [headings]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              On this page
            </h4>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? 'max-h-0' : 'max-h-[60vh]'
            }`}
          >
            <nav className="px-4 pb-4 overflow-y-auto max-h-[55vh]">
              {headingTree.length > 0 ? (
                <ul className="space-y-1">
                  {headingTree.map((heading, index) => (
                    <HeadingItem
                      key={index}
                      heading={heading}
                      activeId={activeId}
                      onNavigate={scrollToHeading}
                      defaultExpanded={index === 0}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">No sections</p>
              )}
            </nav>
          </div>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="w-full flex items-center justify-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Back to top
        </button>
      </div>
    </aside>
  );
}
