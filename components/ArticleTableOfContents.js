'use client';

import { useState, useEffect, useMemo } from 'react';

// Build hierarchical structure from flat headings
function buildHeadingTree(headings) {
  const tree = [];
  const stack = [{ level: 0, children: tree }];

  headings.forEach((heading) => {
    const node = { ...heading, children: [] };

    while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);
    stack.push(node);
  });

  return tree;
}

function MobileHeadingItem({ heading, activeId, onNavigate, depth = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);
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
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
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
          className={`flex-1 text-left py-2 text-sm transition-all ${
            !hasChildren ? 'ml-6' : ''
          } ${
            isActive
              ? 'text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {heading.text}
        </button>
      </div>

      {hasChildren && (
        <ul
          className={`ml-5 border-l-2 border-gray-200 pl-3 space-y-0.5 overflow-hidden transition-all duration-200 ${
            isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
          }`}
        >
          {heading.children.map((child, index) => (
            <MobileHeadingItem
              key={index}
              heading={child}
              activeId={activeId}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ArticleTableOfContents({ headings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

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

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Table of Contents
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[70vh] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="p-4 bg-gray-50 rounded-xl overflow-y-auto max-h-[65vh]">
          <ul className="space-y-1">
            {headingTree.map((heading, index) => (
              <MobileHeadingItem
                key={index}
                heading={heading}
                activeId={activeId}
                onNavigate={scrollToHeading}
              />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
