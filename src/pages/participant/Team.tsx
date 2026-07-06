// src/pages/dashboard/Dashboard.tsx
import { Link } from 'react-router-dom';

export default function Team() {
  return (
    <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">Team</h1>
        <p className="mb-6">Here you can manage your team.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/hackathons" className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow hover:bg-blue-600 transition-colors">
                Manage Hackathons
            </Link>
            <Link to="/teams" className="bg-green-500 text-white px-6 py-4 rounded-lg shadow hover:bg-green-600 transition-colors">
                Manage Teams
            </Link>
            <Link to="/submissions" className="bg-purple-500 text-white px-6 py-4 rounded-lg shadow hover:bg-purple-600 transition-colors">
                Manage Submissions
            </Link>
        </div>
    </div>
  );
}