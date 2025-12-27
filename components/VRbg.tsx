'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import VRScene from './VRScene';
import PortalHUD from './PortalHUD';
import AnalyzePanel from './Analyze';
import Directory from './Directory';
import Chatbot from './Chatbot';
import LearnPanel from './Learn';
import TheSatelliteProjectRepository from './TheSatelliteProjectRepository';
import Mythology from './Mythology';
import Reserve from './Reserve';

function VRBackground() {
  const [currentView, setCurrentView] = useState('Diamond Viewer');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Chatbot State
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(true);

  // Initialize Audio
  useEffect(() => {
    // Using TLNTheme.mp3 as standard
    audioRef.current = new Audio('/TLNTheme.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderView = () => {
    const viewContainerClass = "absolute inset-0 flex items-center justify-center px-2 sm:px-4 pt-16 pb-24 sm:pt-20 sm:pb-28 pointer-events-none z-10";
    const innerContainerClass = "w-full h-full max-w-5xl mx-auto pointer-events-auto overflow-hidden";

    switch (currentView) {
      case 'Diamond Viewer':
        return (
          <div className={viewContainerClass}>
            <div className="w-full h-full pointer-events-auto">
              <AnalyzePanel directoryFacetAddress="" p0="" cache={{}} />
            </div>
          </div>
        );
      case 'Chat':
        return (
          <div className={viewContainerClass}>
            <div className="w-full h-full max-w-3xl pointer-events-auto">
              <Chatbot
                messages={messages}
                setMessages={setMessages}
                input={input}
                setInput={setInput}
                optionsVisible={optionsVisible}
                setOptionsVisible={setOptionsVisible}
              />
            </div>
          </div>
        );
      case 'Directory':
        return (
          <div className={viewContainerClass}>
            <div className="w-full h-full max-w-[98vw] overflow-hidden pointer-events-auto">
              <Directory />
            </div>
          </div>
        );
      case 'Learn':
        return (
          <div className={viewContainerClass}>
            <div className="w-full h-full max-w-4xl pointer-events-auto">
              <LearnPanel />
            </div>
          </div>
        );
      case 'Reserve':
        return (
          <div className={viewContainerClass}>
            <div className={innerContainerClass}>
              <Reserve />
            </div>
          </div>
        );
      case 'Buy':
        return (
          <div className={viewContainerClass}>
            <div className={innerContainerClass}>
              <TheSatelliteProjectRepository />
            </div>
          </div>
        );
      case 'Mythology':
        return (
          <div className={viewContainerClass}>
            <div className={innerContainerClass}>
              <Mythology />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* HUD Navigation */}
      <PortalHUD
        onNavigate={(view) => {
          if (currentView === view) {
            setCurrentView('');
          } else {
            setCurrentView(view);
          }
        }}
        currentView={currentView}
        isPlaying={isPlaying}
        onToggleMusic={toggleMusic}
      />

      {/* VR Scene Background */}
      <div className="absolute inset-0 z-0 select-none">
        <VRScene
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-[5000] flex items-center justify-center bg-black">
          <div className="flex flex-col items-center">
            <img src="/Medallions/TLN.png" className="w-16 h-16 animate-pulse mb-4" />
            <div className="text-brand-400 font-mono tracking-widest text-xl">
              INITIALIZING_PORTAL...
            </div>
          </div>
        </div>
      )}

      {/* Main Content Overlay */}
      {renderView()}

    </div>
  );
}

export default function App() {
  return (
    <ThirdwebProvider>
      <VRBackground />
    </ThirdwebProvider>
  );
}
