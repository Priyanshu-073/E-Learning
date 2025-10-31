import React, { useMemo, useState, useEffect } from 'react';
import InstructorCard from './InstructorCard';
import sampleInstructors from '../data/instructorsData';

export default function Instructors({ fetchUrl = null }) {
  const [instructors, setInstructors] = useState(sampleInstructors);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popular');

  useEffect(() => {
    if (!fetchUrl) return;
    let mounted = true;
    fetch(fetchUrl)
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setInstructors(data);
      })
      .catch((e) => console.warn('Failed to fetch instructors', e));
    return () => (mounted = false);
  }, [fetchUrl]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = instructors.slice();
    if (q) {
      list = list.filter((ins) => {
        return (
          ins.name.toLowerCase().includes(q) ||
          ins.fields.toLowerCase().includes(q) ||
          (ins.tagline || '').toLowerCase().includes(q)
        );
      });
    }

    if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'new') list.sort((a, b) => new Date(b.joined || 0) - new Date(a.joined || 0));
    else list.sort((a, b) => (b.students || 0) - (a.students || 0));

    return list;
  }, [instructors, query, sort]);

  function handleView(id) {
    // stub — integrate with router or modal in your app
    console.log('View profile', id);
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Meet Our Instructors</h2>
            <p className="mt-1 text-slate-500">Learn from experienced educators across various domains</p>
          </div>

          <div className="w-full md:w-auto flex items-center gap-3">
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-100 px-3 py-2 gap-2">
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <input
                aria-label="Search instructors"
                className="outline-none text-sm text-slate-600 placeholder-slate-400 w-64"
                placeholder="Search instructors or subjects"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <select
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="popular">Sort: Popularity</option>
              <option value="rating">Sort: Rating</option>
              <option value="new">Sort: New</option>
            </select>
          </div>
        </div>

        {/* Featured carousel */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Featured Instructors</h4>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {instructors.filter(i => i.featured).map(i => (
              <div key={i.id} className="min-w-[260px]">
                <InstructorCard instructor={i} onView={handleView} />
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((ins) => (
            <InstructorCard key={ins.id} instructor={ins} onView={handleView} />
          ))}
        </div>

        {/* Optional: faint wave */}
        <div className="mt-12">
          <svg viewBox="0 0 1440 120" className="w-full h-20 text-blue-50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32 C360,120 1080,0 1440,64 L1440,120 L0,120 Z" fill="currentColor" opacity="0.6"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}
