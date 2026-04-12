import { RouteObject } from "react-router-dom";
import AuthPage from "@/pages/auth/page";
import IntakePage from "@/pages/intake/page";
import ProfileSummaryPage from "@/pages/profile-summary/page";
import SmartMatchPage from "@/pages/smart-match/page";
import SessionDashboardPage from "@/pages/session-dashboard/page";
import MeetingLobbyPage from "@/pages/meeting-lobby/page";
import VideoRoomPage from "@/pages/video-room/page";
import SessionSummaryPage from "@/pages/session-summary/page";
import DashboardPage from "@/pages/dashboard/page";
import TaskDashboardPage from "@/pages/task-dashboard/page";
import TutorPage from "@/pages/tutor/page";
import FindMentorPage from "@/pages/find-mentor/page";
import ResourcesPage from "@/pages/resources/page";
import ProfilePage from "@/pages/profile/page";
import AchievementsPage from "@/pages/achievements/page";
import NotFound from "@/pages/NotFound";

const routes: RouteObject[] = [
  { path: "/", element: <AuthPage /> },
  { path: "/intake", element: <IntakePage /> },
  { path: "/profile-summary", element: <ProfileSummaryPage /> },
  { path: "/smart-match", element: <SmartMatchPage /> },
  { path: "/session-dashboard", element: <SessionDashboardPage /> },
  { path: "/meeting-lobby", element: <MeetingLobbyPage /> },
  { path: "/video-room", element: <VideoRoomPage /> },
  { path: "/session-summary", element: <SessionSummaryPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/task-dashboard", element: <TaskDashboardPage /> },
  { path: "/tutor", element: <TutorPage /> },
  { path: "/find-mentor", element: <FindMentorPage /> },
  { path: "/resources", element: <ResourcesPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/achievements", element: <AchievementsPage /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
