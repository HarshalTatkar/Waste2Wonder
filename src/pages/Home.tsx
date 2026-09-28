import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ContestBanner } from '../components/home/ContestBanner';
import { UploadTeaser } from '../components/home/UploadTeaser';
import { RecommendedCarousel } from '../components/home/RecommendedCarousel';
import { Project } from '../types/project';
import { postService, postToProject } from '../services/postService';
import mockProjectsData from '../data/mockProjects.json';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Home: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>(
    mockProjectsData as unknown as Project[]
  );

  // Fetch real posts from the database to show in the carousel
  useEffect(() => {
    (async () => {
      try {
        const posts = await postService.getPosts();
        if (posts.length > 0) {
          const liveProjects = posts.map(postToProject);
          // Real posts first, then mock data as filler (deduped)
          const liveIds = new Set(liveProjects.map((p) => p.id));
          const dedupedMock = (mockProjectsData as unknown as Project[]).filter(
            (p) => !liveIds.has(p.id)
          );
          setProjects([...liveProjects, ...dedupedMock]);
        }
      } catch {
        // If DB fetch fails, keep mock data
      }
    })();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection
        onScanClick={() => onNavigate('scan')}
        onExploreClick={() => onNavigate('explore')}
        onSelectMaterial={(category) => onNavigate('explore', { material: category })}
      />

      {/* Floating Glass Contest Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContestBanner onVoteNow={() => onNavigate('contest')} />
      </div>

      {/* Recommended Projects Horizontal Carousel */}
      <RecommendedCarousel
        projects={projects}
        onSelectProject={(project) => onNavigate('craft-detail', { project })}
        onExploreMore={() => onNavigate('explore')}
      />

      {/* How it Works / Upload Teaser */}
      <UploadTeaser onStartScan={() => onNavigate('scan')} />
    </div>
  );
};
