// src/pages/shared/Hackathons.tsx
import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "./admin/dashboard/Dashboard";
import JudgeDashboard from "./judge/dashboard/Dashboard";
import ParticipantDashboard from "./participant/dashboard/Dashboard";
import OrganizerDashboard from "./manager/dashboard/Dashboard";

export default function Dashboard(): React.JSX.Element {

    const { user, loading } = useAuth();

    if (loading) {

        return <div>Loading...</div>;

    }

    switch (user?.role) {

        case "ADMIN":
            return <AdminDashboard />;
        case "JUDGE":
            return <JudgeDashboard />;

        case "PARTICIPANT":
            return <ParticipantDashboard />;

        case "ORGANIZER":
            return <OrganizerDashboard />;
        default:
            return <div>Unknown role</div>;

    }

}