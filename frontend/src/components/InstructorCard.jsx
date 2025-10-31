import React from 'react';

function Star({ filled = false }) {
  return (
    <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.06 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.966z" />
    </svg>
  );
}

export default function InstructorCard({ instructor = {}, onView }) {
  const {
    id,
    name = 'Instructor Name',
    tagline = 'Passionate educator',
    fields = 'Mathematics | Data Science',
    students = 0,
    rating = 4.6,
    featured = false,
    image = null,
  } = instructor;

  const integerRating = Math.round(rating || 0);

  return (
    <article className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 rounded-2xl shadow-md transform transition hover:scale-[1.02] hover:shadow-lg relative">
      {featured && (
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">⭐ Featured</span>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0 w-full md:w-36 h-36 md:h-28 rounded-xl overflow-hidden bg-gray-100">
          {image ? (
            <img src={image} alt={`${name} profile`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-white to-blue-50">
              <svg className="w-14 h-14 text-blue-400 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 21v-1c0-2.21-3.58-4-8-4s-8 1.79-8 4v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
              <p className="text-sm text-slate-500">{tagline}</p>
              <p className="mt-2 text-sm text-sky-600 font-medium">{fields}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">{students.toLocaleString()} students</div>
              <div className="flex items-center justify-end mt-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < integerRating} />
                  ))}
                </div>
                <span className="ml-2 text-sm text-slate-600">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onView && onView(id)}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition"
            >
              View Profile
            </button>

            <button className="btn-outline text-sm px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">Contact</button>

            <button className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-slate-200 hover:shadow">Follow</button>
          </div>
        </div>
      </div>
    </article>
  );
}
