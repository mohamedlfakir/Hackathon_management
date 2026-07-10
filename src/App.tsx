import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import MySpaceLayout from "./layouts/MySpaceLayout";

import LandingPage from "./pages/public/LandingPage";
import AuthPage from "./pages/public/AuthPage";

import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Hackathons from "./pages/Hackathons";
import Settings from "./pages/shared/Settings";

//import Team from "./pages/participant/Team";
import Team from "./pages/admin/teams/Teams";

import Submission from "./pages/participant/submissions/Submission";

import Evaluations from "./pages/judge/evaluations/Evaluations";

import Users from "./pages/admin/users/Users";
import HackathonDetailsPage from "./pages//HackathonDetailsPage";
import SubmissionDetailsPage from "./pages/SubmissionDetailsPage";
import ProfilePage from "./pages/shared/Profil";


export default function App(): React.JSX.Element {

    return (

        <BrowserRouter>

            <Routes>

                {/* ---------------- Public ---------------- */}

                <Route element={<PublicLayout />}>

                    <Route index element={<LandingPage />} />

                    <Route path="login" element={<AuthPage />} />

                    <Route path="register" element={<AuthPage />} />

                </Route>

                {/* ---------------- Protected ---------------- */}

                <Route
                    path="/myspace"
                    element={
                        <ProtectedRoute>
                            <MySpaceLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* /myspace */}
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    {/* /myspace/dashboard */}
                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                    {/* Shared */}
                    <Route
                        path="hackathons"
                        element={<Hackathons />}
                    >
                        
                    </Route>
                    <Route
                            path="hackathons/:id"
                            element={<HackathonDetailsPage />}
                        />
                    <Route
                        path="settings"
                        element={<Settings />}
                    />

                    <Route
                        path="profil"
                        element={<ProfilePage />}
                    />
                    {/* Participant */}
                    

                    <Route
                        path="submissions"
                        element={
                            <ProtectedRoute roles={[ "ADMIN", "MANAGER","JUDGE"]}>
                                <Submission />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                            path="submissions/:submissionId"
                            element={
                            <ProtectedRoute roles={["JUDGE", "ADMIN"]}>
                                <SubmissionDetailsPage />
                            </ProtectedRoute>}
                        />
                    {/* Judge */}
                    <Route
                        path="evaluations"
                        element={
                            <ProtectedRoute roles={["JUDGE", "ADMIN"]}>
                                <Evaluations />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin */}
                    <Route
                        path="teams"
                        element={
                            <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                                <Team />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="users"
                        element={
                            <ProtectedRoute roles={["ADMIN"]}>
                                <Users />
                            </ProtectedRoute>
                        }
                    />
                <Route
                    path="/myspace/*"
                    element={<Navigate to="/myspace" replace />}
                  />
                </Route>

                {/* 404 */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}