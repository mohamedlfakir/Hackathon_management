// src/pages/shared/Hackathons.tsx
import { useAuth } from "../../contexts/AuthContext";
import AdminDashboard from "./admin/AdminDashboard";
import JudgeDashboard from "./judge/JudgeDashboard";
import ParticipantDashboard from "./participant/ParticipantDashboard";
import OrganizerDashboard from "./organizer/OrganizerDashboard";

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