Instructors React + Tailwind UI

Files created:
- `src/components/Instructors.jsx` - Page wrapper component: heading, search, sort, featured carousel, grid.
- `src/components/InstructorCard.jsx` - Reusable card component with rating, students, buttons, featured badge.
- `src/data/instructorsData.js` - Sample data so the components render out-of-the-box.

Quick notes & integration

1) Add Tailwind to your project
- If you're using Create React App, Vite, or Next.js, follow Tailwind's docs to install Tailwind CSS and add the `@tailwind` directives to your CSS.

2) Example CSS entry (e.g., `src/index.css`):

@tailwind base;
@tailwind components;
@tailwind utilities;

3) Using the components
- Import and use in any route or page:

import Instructors from './components/Instructors';

function Page() {
  return <Instructors fetchUrl="/api/instructors/" />; // optional fetchUrl for live data
}

4) Using local images
- Replace `image: null` in `instructorsData` with an imported image path or remote URL.

5) Loading from API
- Pass `fetchUrl` prop to `Instructors` (e.g., `/api/instructors/`). The component will `fetch()` and replace sample data.

6) Customization
- Tweak Tailwind utility classes (colors, spacings) to match your site's theme. The components use soft blue accents and rounded cards by default.

Accessibility
- Inputs and buttons include basic aria-labels. For production, ensure keyboard focus styles and ARIA roles for carousels if you add more controls.

Extending
- You can wire `onView` to open a modal or navigate via React Router.
- `Follow` is a placeholder; add a click handler to post follow/unfollow to your backend.

If you'd like, I can:
- Convert these to TypeScript.
- Add a Storybook story for the components.
- Create an SSR-friendly Next.js page version.

