// src/pages/shared/Hackathons.tsx
import { useAuth } from "../contexts/AuthContext";
import AdminSubmissionDetailPage from "./admin/submissions/AdminSubmissionDetailsPage";
import JudgeSubmissionDetailPage from "./judge/submissions/JudgeSubmissionDetailsPage";

export default function HackathonDetailsPage(): React.JSX.Element {

    const { user, loading } = useAuth();

    if (loading) {

        return <div>Loading...</div>;

    }

    switch (user?.role) {

        case "ADMIN":
            return <AdminSubmissionDetailPage />;

       case "JUDGE":
            return <JudgeSubmissionDetailPage />;

        default:
            return <div>Unknown role</div>;

    }

}