
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PROJECT_INFO as INITIAL_PROJECT_INFO,
  HIGHLIGHTS as INITIAL_HIGHLIGHTS,
  ACHIEVEMENTS as INITIAL_ACHIEVEMENTS,
  TEAM_MEMBERS as INITIAL_TEAM_MEMBERS,
  HERO_VIDEOS as INITIAL_HERO_VIDEOS,
  LOCATION_SLIDES as INITIAL_LOCATION_SLIDES,
  SITE_SLIDES as INITIAL_SITE_SLIDES,
  DEFAULT_AI_CONFIG,
  DEFAULT_PARTICIPATING_UNITS
} from '../constants';
import { Highlight, Achievement, TeamMember, HeroVideo, LocationSlide, SiteSlide, AIConfig, ParticipatingUnit } from '../types';

// Define the shape of the context data
interface DataContextType {
  projectInfo: typeof INITIAL_PROJECT_INFO;
  updateProjectInfo: (newInfo: typeof INITIAL_PROJECT_INFO) => void;

  highlights: Highlight[];
  setHighlights: React.Dispatch<React.SetStateAction<Highlight[]>>;
  deleteHighlight: (id: string) => void;
  saveHighlight: (item: Highlight) => void;

  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  deleteAchievement: (id: string) => void;
  saveAchievement: (item: Achievement) => void;

  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  deleteTeamMember: (id: string) => void;
  saveTeamMember: (item: TeamMember) => void;

  locationSlides: LocationSlide[];
  saveLocationSlide: (item: LocationSlide) => void;
  deleteLocationSlide: (id: string | number) => void;

  siteSlides: SiteSlide[];
  saveSiteSlide: (item: SiteSlide) => void;
  deleteSiteSlide: (id: string | number) => void;

  heroVideos: HeroVideo[];
  saveHeroVideo: (item: HeroVideo) => void;
  deleteHeroVideo: (id: string) => void;

  participatingUnits: ParticipatingUnit[];
  saveParticipatingUnit: (item: ParticipatingUnit) => void;

  aiConfig: AIConfig;
  updateAiConfig: (config: AIConfig) => void;
}

const DataContext = createContext<DataContextType>(null!);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Project Info ---
  const [projectInfo, setProjectInfo] = useState(() => {
    const saved = localStorage.getItem('projectInfo');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_INFO;
  });

  // --- Highlights ---
  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    const saved = localStorage.getItem('highlights');
    return saved ? JSON.parse(saved) : INITIAL_HIGHLIGHTS;
  });

  // --- Achievements ---
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // --- Team Members ---
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('teamMembers');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  // --- Location Slides ---
  // Need to map initial constants to have iconName property if not present, for consistency
  const [locationSlides, setLocationSlides] = useState<LocationSlide[]>(() => {
    const saved = localStorage.getItem('locationSlides');
    if (saved) return JSON.parse(saved);

    // Convert initial constants which might have React Components to serializable objects
    return INITIAL_LOCATION_SLIDES.map(slide => ({
      ...slide,
      iconName: slide.id === 1 ? 'MapPin' : slide.id === 2 ? 'Layers' : 'User'
    }));
  });

  // --- Site Slides ---
  const [siteSlides, setSiteSlides] = useState<SiteSlide[]>(() => {
    const saved = localStorage.getItem('siteSlides');
    return saved ? JSON.parse(saved) : INITIAL_SITE_SLIDES;
  });

  // --- Hero Videos ---
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>(() => {
    const saved = localStorage.getItem('heroVideos');
    return saved ? JSON.parse(saved) : INITIAL_HERO_VIDEOS;
  });

  // --- Participating Units ---
  const [participatingUnits, setParticipatingUnits] = useState<ParticipatingUnit[]>(() => {
    const saved = localStorage.getItem('participatingUnits');
    return saved ? JSON.parse(saved) : DEFAULT_PARTICIPATING_UNITS;
  });

  // --- AI Config ---
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('aiConfig');
    return saved ? JSON.parse(saved) : DEFAULT_AI_CONFIG;
  });


  // --- Persistence Effects ---
  useEffect(() => localStorage.setItem('projectInfo', JSON.stringify(projectInfo)), [projectInfo]);
  useEffect(() => localStorage.setItem('highlights', JSON.stringify(highlights)), [highlights]);
  useEffect(() => localStorage.setItem('achievements', JSON.stringify(achievements)), [achievements]);
  useEffect(() => localStorage.setItem('teamMembers', JSON.stringify(teamMembers)), [teamMembers]);
  useEffect(() => localStorage.setItem('locationSlides', JSON.stringify(locationSlides)), [locationSlides]);
  useEffect(() => localStorage.setItem('siteSlides', JSON.stringify(siteSlides)), [siteSlides]);
  useEffect(() => localStorage.setItem('heroVideos', JSON.stringify(heroVideos)), [heroVideos]);
  useEffect(() => localStorage.setItem('participatingUnits', JSON.stringify(participatingUnits)), [participatingUnits]);
  useEffect(() => localStorage.setItem('aiConfig', JSON.stringify(aiConfig)), [aiConfig]);


  // --- Actions ---

  const updateProjectInfo = (newInfo: typeof INITIAL_PROJECT_INFO) => {
    setProjectInfo(newInfo);
  };

  const updateAiConfig = (config: AIConfig) => {
    setAiConfig(config);
  };

  // Generic helper for list updates (create or update)
  const saveItemInList = <T extends { id: string | number }>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    item: T
  ) => {
    setList(prev => {
      const exists = prev.some(i => i.id == item.id);
      if (exists) {
        return prev.map(i => i.id == item.id ? item : i);
      }
      return [...prev, item];
    });
  };

  const deleteItemFromList = <T extends { id: string | number }>(
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    id: string | number
  ) => {
    setList(prev => prev.filter(i => i.id != id));
  };

  // Specific Wrappers
  const saveHighlight = (item: Highlight) => saveItemInList(highlights, setHighlights, item);
  const deleteHighlight = (id: string) => deleteItemFromList(setHighlights, id);

  const saveAchievement = (item: Achievement) => saveItemInList(achievements, setAchievements, item);
  const deleteAchievement = (id: string) => deleteItemFromList(setAchievements, id);

  const saveTeamMember = (item: TeamMember) => saveItemInList(teamMembers, setTeamMembers, item);
  const deleteTeamMember = (id: string) => deleteItemFromList(setTeamMembers, id);

  const saveLocationSlide = (item: LocationSlide) => saveItemInList(locationSlides, setLocationSlides, item);
  const deleteLocationSlide = (id: string | number) => deleteItemFromList(setLocationSlides, id);

  const saveSiteSlide = (item: SiteSlide) => saveItemInList(siteSlides, setSiteSlides, item);
  const deleteSiteSlide = (id: string | number) => deleteItemFromList(setSiteSlides, id);

  const saveHeroVideo = (item: HeroVideo) => saveItemInList(heroVideos, setHeroVideos, item);
  const deleteHeroVideo = (id: string) => deleteItemFromList(setHeroVideos, id);

  const saveParticipatingUnit = (item: ParticipatingUnit) => saveItemInList(participatingUnits, setParticipatingUnits, item);

  return (
    <DataContext.Provider value={{
      projectInfo, updateProjectInfo,
      highlights, setHighlights, deleteHighlight, saveHighlight,
      achievements, setAchievements, deleteAchievement, saveAchievement,
      teamMembers, setTeamMembers, deleteTeamMember, saveTeamMember,
      locationSlides, saveLocationSlide, deleteLocationSlide,
      siteSlides, saveSiteSlide, deleteSiteSlide,
      heroVideos, saveHeroVideo, deleteHeroVideo,
      participatingUnits, saveParticipatingUnit,
      aiConfig, updateAiConfig
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);