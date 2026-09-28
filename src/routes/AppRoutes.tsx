import React, { useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { UploadScan } from '../pages/UploadScan';
import { MaterialsIHave } from '../pages/MaterialsIHave';
import { ExploreIdeas } from '../pages/ExploreIdeas';
import { CraftDetail } from '../pages/CraftDetail';
import { Community } from '../pages/Community';
import { CreatePost } from '../pages/CreatePost';
import { WeeklyContest } from '../pages/WeeklyContest';
import { Profile } from '../pages/Profile';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { NotFound } from '../pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';

// ── Page-name → URL path ────────────────────────────────────
function pageToPath(page: string, params: Record<string, unknown> = {}): string {
  switch (page) {
    case 'home':
      return '/';
    case 'scan':
      return '/scan';
    case 'materials':
      return '/materials';
    case 'explore':
      return '/explore';
    case 'craft-detail': {
      const id =
        (params.project as { id?: string })?.id || (params.projectId as string) || '';
      return id ? `/craft/${id}` : '/craft';
    }
    case 'community':
      return '/community';
    case 'create-post':
      return '/create';
    case 'contest':
      return '/contest';
    case 'profile': {
      const uid = params.userId as string | undefined;
      return uid ? `/profile/${uid}` : '/profile';
    }
    case 'login':
      return '/login';
    case 'signup':
      return '/signup';
    default:
      return '/';
  }
}

// ── URL path → active tab name (for Navbar highlighting) ────
function pathToPage(pathname: string): string {
  if (pathname === '/') return 'home';
  const segment = pathname.split('/')[1];
  const map: Record<string, string> = {
    scan: 'scan',
    materials: 'materials',
    explore: 'explore',
    craft: 'craft-detail',
    community: 'community',
    create: 'create-post',
    contest: 'contest',
    profile: 'profile',
    login: 'login',
    signup: 'signup',
  };
  return map[segment] || 'home';
}

// ── Inner shell that renders all non-auth pages inside MainLayout ──
const AppShell: React.FC<{
  navigate: (page: string, params?: Record<string, unknown>) => void;
}> = ({ navigate }) => {
  const location = useLocation();
  const activePage = pathToPage(location.pathname);
  const navParams = (location.state || {}) as Record<string, unknown>;

  return (
    <MainLayout activeTab={activePage} onNavigate={navigate}>
      <Routes>
        <Route index element={<Home onNavigate={navigate} />} />

        <Route
          path="scan"
          element={
            <ProtectedRoute>
              <UploadScan onNavigate={navigate} />
            </ProtectedRoute>
          }
        />

        <Route
          path="materials"
          element={
            <ProtectedRoute>
              <MaterialsIHave onNavigate={navigate} />
            </ProtectedRoute>
          }
        />

        <Route
          path="explore"
          element={
            <ExploreIdeas
              onNavigate={navigate}
              initialMaterial={navParams.material as string | undefined}
              initialMaterials={navParams.initialMaterials as string[] | undefined}
            />
          }
        />

        <Route
          path="craft/:projectId?"
          element={<CraftDetailRoute navigate={navigate} />}
        />

        <Route
          path="community"
          element={
            <ProtectedRoute>
              <Community onNavigate={navigate} />
            </ProtectedRoute>
          }
        />

        <Route
          path="create"
          element={
            <ProtectedRoute>
              <CreatePost
                onNavigate={navigate}
                isContestEntryInitial={Boolean(navParams.isContestEntry)}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="contest"
          element={
            <ProtectedRoute>
              <WeeklyContest onNavigate={navigate} />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile/:userId?"
          element={<ProfileRoute navigate={navigate} />}
        />

        <Route path="*" element={<NotFound onNavigateHome={() => navigate('home')} />} />
      </Routes>
    </MainLayout>
  );
};

// ── Route wrapper for CraftDetail (extracts project from location state) ──
const CraftDetailRoute: React.FC<{
  navigate: (page: string, params?: Record<string, unknown>) => void;
}> = ({ navigate }) => {
  const location = useLocation();
  const navParams = (location.state || {}) as Record<string, unknown>;
  const project = navParams.project as import('../types/project').Project | undefined;

  if (!project) {
    // No project in state (e.g. direct URL access or page refresh) — redirect to explore
    return <Navigate to="/explore" replace />;
  }

  return (
    <CraftDetail
      project={project}
      onBack={() => navigate('explore')}
      onNavigate={navigate}
    />
  );
};

// ── Route wrapper for Profile (extracts userId from URL params) ──
const ProfileRoute: React.FC<{
  navigate: (page: string, params?: Record<string, unknown>) => void;
}> = ({ navigate }) => {
  return (
    <ProtectedRoute>
      <ProfileRouteInner navigate={navigate} />
    </ProtectedRoute>
  );
};

const ProfileRouteInner: React.FC<{
  navigate: (page: string, params?: Record<string, unknown>) => void;
}> = ({ navigate }) => {
  const { userId } = useParams<{ userId?: string }>();
  return <Profile onNavigate={navigate} userId={userId} />;
};

// ── Top-level Routes ────────────────────────────────────────
export const AppRoutes: React.FC = () => {
  const routerNavigate = useNavigate();

  const navigate = useCallback(
    (page: string, params: Record<string, unknown> = {}) => {
      const path = pageToPath(page, params);
      routerNavigate(path, { state: params });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [routerNavigate],
  );

  return (
    <Routes>
      {/* Auth pages — rendered without MainLayout */}
      <Route
        path="/login"
        element={
          <Login
            onSuccess={() => navigate('home')}
            onNavigateToSignup={() => navigate('signup')}
            onNavigateHome={() => navigate('home')}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <Signup
            onSuccess={() => navigate('home')}
            onNavigateToLogin={() => navigate('login')}
            onNavigateHome={() => navigate('home')}
          />
        }
      />

      {/* All other pages — inside MainLayout */}
      <Route path="/*" element={<AppShell navigate={navigate} />} />
    </Routes>
  );
};
