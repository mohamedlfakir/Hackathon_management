// src/pages/public/Landing.tsx
import { Link } from 'react-router-dom';

// Mock data to visualize the design
const upcomingHackathons = [
  {
    id: '1',
    title: 'AI Innovators Challenge 2026',
    date: 'Aug 15 - Aug 17, 2026',
    prize: '$10,000',
    tags: ['Artificial Intelligence', 'Online'],
    participants: 450,
  },
  {
    id: '2',
    title: 'GreenTech Sustainability Jam',
    date: 'Sep 01 - Sep 03, 2026',
    prize: '$5,000',
    tags: ['Environment', 'In-Person'],
    participants: 120,
  },
  {
    id: '3',
    title: 'FinTech Future Hack',
    date: 'Oct 10 - Oct 12, 2026',
    prize: '$15,000',
    tags: ['Finance', 'Web3', 'Hybrid'],
    participants: 800,
  }
];

export default function Landing() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mb-8 border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Over 50+ Hackathons active this month
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-gray-900 leading-tight">
          Where brilliant ideas turn into <span className="text-gray-400">reality.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl">
          Join thousands of developers, designers, and creators building the next big thing. Form teams, submit projects, and win prizes in world-class hackathons.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/register" className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg">
            Find a Hackathon
          </Link>
          <a href="#organize" className="bg-white text-black px-8 py-4 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
            Organize an Event
          </a>
        </div>
      </section>

      {/* UPCOMING HACKATHONS SECTION */}
      <section id="hackathons" className="bg-gray-50 py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Upcoming Hackathons</h2>
              <p className="text-gray-500">Discover and register for the latest events globally.</p>
            </div>
            <Link to="/hackathons" className="text-sm font-medium text-black border-b border-black pb-0.5 hover:text-gray-600">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingHackathons.map((hackathon) => (
              <div key={hackathon.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex flex-wrap gap-2 mb-4">
                  {hackathon.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {hackathon.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {hackathon.date}
                </p>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Prize Pool</p>
                    <p className="text-lg font-bold text-gray-900">{hackathon.prize}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Joined</p>
                    <p className="text-sm font-medium text-gray-900">{hackathon.participants} hackers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES / ORGANIZER PITCH */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to innovate</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Built for organizers who demand control and participants who crave a seamless building experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>  
            <h3 className="text-xl font-bold mb-2">Team Formation</h3>
            <p className="text-gray-500 text-sm">Find teammates, create profiles, and manage your squad all in one centralized workspace.</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Integrated Submissions</h3>
            <p className="text-gray-500 text-sm">Submit GitHub repos, Figma mockups, and pitch decks directly through the platform.</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Fair Evaluation</h3>
            <p className="text-gray-500 text-sm">Dedicated portals for judges to evaluate projects on predefined criteria like Innovation and Tech.</p>
          </div>
        </div>
      </section>
    </div>
  );
}