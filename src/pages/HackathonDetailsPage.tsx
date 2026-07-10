// src/pages/shared/Hackathons.tsx
import { useAuth } from "../contexts/AuthContext";
import AdminHackathonsDetailPage from "./admin/hackathons/HackathonDetailsPage";
import JudgeHackathonsDetailPage from "./judge/hackathons/HackathonDetailsPage";
import ParticipanthackathonsDetailPage from "./participant/hackathons/HackathonDetailsPage";

export default function HackathonDetailsPage(): React.JSX.Element {

    const { user, loading } = useAuth();

    if (loading) {

        return <div>Loading...</div>;

    }

    switch (user?.role) {

        case "ADMIN":
            return <AdminHackathonsDetailPage />;

       case "JUDGE":
            return <JudgeHackathonsDetailPage />;

        case "PARTICIPANT":
            return <ParticipanthackathonsDetailPage />;

        case "ORGANIZER":
            return <AdminHackathonsDetailPage />;
        default:
            return <div>Unknown role</div>;

    }

}