import React, { useState, useEffect } from 'react';
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
import { Project } from '../types/project';
import mockProjectsData from '../data/mockProjects.json';

export const AppRoutes: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [navParams, setNavParams] = useState<any>({});

  const navigate = (page: string, params: any = {}) => {
    setActivePage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current active project if navigating to craft-detail
  let currentProject: Project = navParams.project;
  if (!currentProject && navParams.projectId) {
    currentProject = (mockProjectsData as unknown as Project[]).find(
      (p) => p.id === navParams.projectId
    ) || (mockProjectsData as unknown as Project[])[0];
  } else if (!currentProject && activePage === 'craft-detail') {
    currentProject = (mockProjectsData as unknown as Project[])[0];
  }

  // Handle dedicated Auth pages
  if (activePage === 'login') {
    return (
      <Login
        onSuccess={() => navigate('home')}
        onNavigateToSignup={() => navigate('signup')}
        onNavigateHome={() => navigate('home')}
      />
    );
  }

  if (activePage === 'signup') {
    return (
      <Signup
        onSuccess={() => navigate('home')}
        onNavigateToLogin={() => navigate('login')}
        onNavigateHome={() => navigate('home')}
      />
    );
  }

  const renderPageContent = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={navigate} />;

      case 'scan':
        return (
          <ProtectedRoute>
            <UploadScan onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'materials':
        return (
          <ProtectedRoute>
            <MaterialsIHave onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'explore':
        return (
          <ExploreIdeas
            onNavigate={navigate}
            initialMaterial={navParams.material}
            initialMaterials={navParams.initialMaterials}
          />
        );

      case 'craft-detail':
        return (
          <CraftDetail
            project={currentProject}
            onBack={() => navigate('explore')}
            onNavigate={navigate}
          />
        );

      case 'community':
        return (
          <ProtectedRoute>
            <Community onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'create-post':
        return (
          <ProtectedRoute>
            <CreatePost
              onNavigate={navigate}
              isContestEntryInitial={Boolean(navParams.isContestEntry)}
            />
          </ProtectedRoute>
        );

      case 'contest':
        return (
          <ProtectedRoute>
            <WeeklyContest onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'profile':
        return (
          <ProtectedRoute>
            <Profile onNavigate={navigate} userId={navParams.userId} />
          </ProtectedRoute>
        );

      default:
        return <NotFound onNavigateHome={() => navigate('home')} />;
    }
  };

  return (
    <MainLayout activeTab={activePage} onNavigate={navigate}>
      {renderPageContent()}
    </MainLayout>
  );
};
