// src/pages/shared/Hackathons.tsx
import { useAuth } from "../contexts/AuthContext";
import AdminHackathons from "./admin/hackathons/Hackathons";
import JudgeHackathons from "./judge/hackathons/Hackathons";
import Participanthackathons from "./participant/hackathons/Hackathons";

export default function Hackathons(): React.JSX.Element {

    const { user, loading } = useAuth();

    if (loading) {

        return <div>Loading...</div>;

    }

    switch (user?.role) {

        case "ADMIN":
            return <AdminHackathons />;

        case "JUDGE":
            return <JudgeHackathons />;

        case "PARTICIPANT":
            return <Participanthackathons />;

        case "ORGANIZER":
            return <AdminHackathons />;
        default:
            return <div>Unknown role</div>;

    }

}