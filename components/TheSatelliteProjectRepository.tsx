'use client';

import React, { useState, useEffect } from 'react';
import { getSatelliteCount, getSatellite, getTotalRegisteredSatellites } from '../primitives/TSPABI';
import { MapPinIcon, CalendarIcon, SignalIcon, BeakerIcon, GlobeAmericasIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'; // Adding icons

interface SatelliteProject {
  id: string;
  name: string;
  medallionUrl: string;
  link: string;
  projectStatus: 'live' | 'in progress' | 'development';
  mintStatus: 'live' | 'inactive';
  description: string;
  dateEstablished: string;
  city: string;
  type: 'hydroponic' | 'aquaponic';
  contractData?: {
    franchiseName: string;
    facilityAddress: string;
    licenseNumber: string;
    masterGrower: string;
    status: number;
  };
}

interface ExtractedColors {
  primary: string;
  secondary: string;
  accent: string;
}

// Color extraction utility
const extractColorsFromImage = (imageSrc: string): Promise<ExtractedColors> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas') as unknown as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({ primary: 'rgba(0, 191, 138, 0.15)', secondary: 'rgba(0, 191, 138, 0.3)', accent: 'rgba(0, 191, 138, 1)' });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const colorCounts: { [key: string]: number } = {};

      // Sample pixels (every 4th pixel for performance)
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels and very dark/light pixels
        if (a < 128 || (r + g + b) < 50 || (r + g + b) > 650) continue;

        // Group similar colors (reduce precision)
        const colorKey = `${Math.floor(r / 32) * 32},${Math.floor(g / 32) * 32},${Math.floor(b / 32) * 32}`;
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }

      // Get most frequent colors
      const sortedColors = Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

      if (sortedColors.length === 0) {
        resolve({ primary: 'rgba(0, 191, 138, 0.15)', secondary: 'rgba(0, 191, 138, 0.3)', accent: 'rgba(0, 191, 138, 1)' });
        return;
      }

      const [primaryRGB] = sortedColors[0];

      const primary = `rgba(${primaryRGB}, 0.15)`;
      const secondary = `rgba(${primaryRGB}, 0.3)`;
      const accent = `rgb(${primaryRGB})`;

      resolve({ primary, secondary, accent });
    };

    img.onerror = () => {
      resolve({ primary: 'rgba(0, 191, 138, 0.15)', secondary: 'rgba(0, 191, 138, 0.3)', accent: 'rgba(0, 191, 138, 1)' });
    };

    img.src = imageSrc;
  });
};

export default function TheSatelliteProjectRepository() {
  const [projectColors, setProjectColors] = useState<{ [key: string]: ExtractedColors }>({});
  const [colorsLoaded, setColorsLoaded] = useState(false);
  const [satelliteProjects, setSatelliteProjects] = useState<SatelliteProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Default projects structure
  const defaultProjects: SatelliteProject[] = [
    {
      id: '1',
      name: 'The Satellite Project Om',
      medallionUrl: '/Medallions/TSPAum1.png',
      link: 'https://omgrown.life',
      projectStatus: 'live',
      mintStatus: 'live',
      description: 'State-of-the-art tokenized and automated, vertically integrated hydroponic cultivation facility specializing in premium botanical products.',
      dateEstablished: 'February 2025',
      city: 'Santa Fe, NM',
      type: 'hydroponic',
    },
    {
      id: '2',
      name: 'The Perennial Waters Collection',
      medallionUrl: '/Medallions/TLN.png',
      link: '#',
      projectStatus: 'development',
      mintStatus: 'inactive',
      description: 'Next-generation aquaponic facility combining advanced automation with sustainable aquaculture practices. Currently in active development phase.',
      dateEstablished: 'Q3 2025 (Planned)',
      city: 'Santa Fe, NM',
      type: 'aquaponic',
    },
  ];

  // Fetch satellite data from contract and merge with default projects
  useEffect(() => {
    const fetchSatelliteData = async () => {
      try {
        setLoading(true);

        // Get counts first
        try {
          const [totalCount, registeredCount] = await Promise.all([
            getSatelliteCount(),
            getTotalRegisteredSatellites()
          ]);

          console.log('Satellite counts:', { totalCount, registeredCount });

          // Start with default projects
          let updatedProjects = [...defaultProjects];

          // Try to fetch satellite data from contract
          if (totalCount > 0) {
            const satellitePromises = [];

            // Try both 0-based and 1-based indexing
            for (let i = 0; i < totalCount; i++) {
              satellitePromises.push(getSatellite(i));
            }

            const satelliteResults = await Promise.all(satellitePromises);
            const validSatellites = satelliteResults.filter(satellite => satellite !== null);

            console.log('Valid satellites found:', validSatellites);

            if (validSatellites.length > 0) {
              const firstSatellite = validSatellites[0];
              updatedProjects[0] = {
                ...updatedProjects[0],
                name: firstSatellite.franchiseName || updatedProjects[0].name,
                description: `${updatedProjects[0].description} License: ${firstSatellite.licenseNumber}.`, // Removed Master Grower
                contractData: firstSatellite,
              };

              for (let i = 1; i < validSatellites.length; i++) {
                const satellite = validSatellites[i];
                updatedProjects.push({
                  id: `contract-${i + 1}`,
                  name: satellite.franchiseName || `Satellite Project ${i + 1}`,
                  medallionUrl: '/Medallions/TSPAum1.png', // Use local path
                  link: satellite.status === 1 ? 'https://thesatelliteproject.com' : '#',
                  projectStatus: satellite.status === 1 ? 'live' : satellite.status === 0 ? 'in progress' : 'development',
                  mintStatus: satellite.status === 1 ? 'live' : 'inactive',
                  description: `Facility Address: ${satellite.facilityAddress}. License: ${satellite.licenseNumber}.`, // Removed Master Grower
                  dateEstablished: 'Contract Registered',
                  city: 'Location TBD',
                  type: 'hydroponic',
                  contractData: satellite,
                });
              }
            }
          }
          setSatelliteProjects(updatedProjects);
        } catch (e) {
          console.warn("Failed to fetch chain data, using defaults", e);
          setSatelliteProjects(defaultProjects);
        }

      } catch (error) {
        console.error('Error fetching satellite data:', error);
        setSatelliteProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchSatelliteData();
  }, []);

  // Extract colors from medallions on component mount
  useEffect(() => {
    const loadColors = async () => {
      const colorPromises = satelliteProjects.map(async (project) => {
        const colors = await extractColorsFromImage(project.medallionUrl);
        return { id: project.id, colors };
      });

      const results = await Promise.all(colorPromises);
      const colorMap: { [key: string]: ExtractedColors } = {};

      results.forEach(({ id, colors }) => {
        colorMap[id] = colors;
      });

      setProjectColors(colorMap);
      setColorsLoaded(true);
    };

    if (satelliteProjects.length > 0) {
      loadColors();
    }
  }, [satelliteProjects]);

  const handleProjectClick = (project: SatelliteProject) => {
    if (project.projectStatus === 'live' && project.link !== '#') {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Separate projects by type
  const hydroponicProjects = satelliteProjects.filter(project => project.type === 'hydroponic');
  const aquaponicProjects = satelliteProjects.filter(project => project.type === 'aquaponic');

  if (loading) {
    return (
      <div
        className="relative isolate space-y-6 rounded-2xl shadow-[0_0_50px_rgba(0,191,138,0.1)] bg-black/40 border border-brand-500/20 p-6 w-full md:w-3/4 lg:w-1/2 mx-auto flex items-center justify-center min-h-[50vh]"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400 mx-auto"></div>
          <p className="mt-4 text-brand-300 font-rajdhani text-sm tracking-widest animate-pulse">ESTABLISHING LINK...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative isolate rounded-2xl shadow-[0_0_80px_rgba(0,191,138,0.15)] bg-[#000d0a]/80 border border-brand-500/30 w-auto h-[calc(100%-1rem)] overflow-hidden mx-2 my-2"
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 0 40px rgba(0, 191, 138, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.5)"
      }}
    >
      {/* Scrollable inner container - overlay scrollbar */}
      <div className="overflow-y-auto h-full p-6 md:p-8 space-y-8" style={{ scrollbarGutter: 'stable' }}>
        {/* HUD Header */}
        <div className="flex justify-between items-center mb-8 border-b border-brand-500/30 pb-4 relative">
          <div className="flex items-center gap-3">
            <GlobeAmericasIcon className="w-8 h-8 text-brand-400 animate-pulse-slow" />
            <div>
              <h2 className="text-3xl font-bold text-white tracking-[0.2em] font-rajdhani leading-none">NETWORK<span className="text-brand-500">_</span>NODES</h2>
              <div className="text-[10px] text-brand-400/60 font-mono tracking-widest mt-1">SATELLITE PROJECT REPOSITORY v3.0</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></div>
              <span className="text-xs font-mono text-brand-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[10px] text-white/30 font-mono mt-1">
              LATENCY: 12ms
            </div>
          </div>
        </div>

        {/* Hydroponic Section */}
        <div className="mb-10 animate-slide-in-up">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-brand-300 tracking-wide uppercase font-rajdhani">Active Systems</h3>
              <div className="h-px w-12 bg-brand-500/50"></div>
            </div>
            <span className="text-[10px] text-brand-400 border border-brand-500/30 px-3 py-1 rounded-full bg-brand-900/40 font-mono font-bold tracking-widest flex items-center gap-2">
              <BeakerIcon className="w-3 h-3" /> HYDROPONIC CLASS
            </span>
          </div>

          <div className="space-y-6">
            {hydroponicProjects.map((project, idx) => {
              const colors = projectColors[project.id] || {
                primary: 'rgba(0, 191, 138, 0.15)',
                secondary: 'rgba(0, 191, 138, 0.3)',
                accent: 'rgba(0, 191, 138, 1)'
              };

              return (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`group relative p-6 rounded-2xl border transition-all duration-500 overflow-hidden ${project.projectStatus === 'live'
                    ? 'cursor-pointer hover:border-brand-400/70 hover:shadow-[0_0_40px_rgba(0,191,138,0.25)]'
                    : 'cursor-default border-white/5 opacity-80'
                    }`}
                  style={{
                    background: `linear-gradient(135deg, rgba(5,5,5,0.9) 0%, rgba(0,20,15,0.8) 100%)`,
                    borderColor: project.projectStatus === 'live' ? 'rgba(0, 191, 138, 0.3)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/5 to-brand-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start gap-5 mb-5">
                      {/* Medallion - Larger on wider panels */}
                      <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 relative mx-auto md:mx-0">
                        <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${project.projectStatus === 'live' ? 'bg-brand-500 animate-pulse' : 'bg-gray-500'}`} />
                        <img
                          src={project.medallionUrl || 'https://thesatelliteproject.com/Medallions/TLN.png'}
                          alt={`${project.name} medallion`}
                          className="w-full h-full object-cover rounded-full border-2 relative z-10 transition-transform duration-500 group-hover:scale-105"
                          style={{ borderColor: colors.accent }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://thesatelliteproject.com/Medallions/TLN.png';
                          }}
                        />
                      </div>

                      {/* Project Info - Grows to fill space */}
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                          <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight font-rajdhani group-hover:text-brand-300 transition-colors">{project.name}</h4>

                          {/* Status Badge - inline on desktop */}
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md self-center md:self-start ${project.projectStatus === 'live' ? 'bg-brand-950/60 border-brand-500/40' :
                            project.projectStatus === 'development' ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-gray-800/40 border-gray-600/30'
                            }`}>
                            <SignalIcon className={`w-3 h-3 ${project.projectStatus === 'live' ? 'text-brand-400' : 'text-gray-400'}`} />
                            <span className={`text-[10px] font-bold font-mono tracking-widest ${project.projectStatus === 'live' ? 'text-brand-300' :
                              project.projectStatus === 'development' ? 'text-yellow-500' : 'text-gray-400'
                              }`}>
                              {project.projectStatus === 'live' ? 'ACTIVE' :
                                project.projectStatus === 'development' ? 'DEV_MODE' : 'OFFLINE'}
                            </span>
                          </div>
                        </div>

                        {/* Meta info row */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs opacity-70">
                          <span className="flex items-center gap-1 text-brand-100 font-mono"><CalendarIcon className="w-3 h-3 text-brand-500" /> EST. {project.dateEstablished}</span>
                          <span className="text-brand-500/50">|</span>
                          <span className="flex items-center gap-1 text-brand-100 font-mono"><MapPinIcon className="w-3 h-3 text-brand-500" /> {project.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contract Data Badge */}
                    {project.contractData && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-brand-900/30 text-brand-300 border border-brand-500/30 text-[10px] font-mono tracking-wide">
                          <CheckBadgeIcon className="w-3 h-3 text-brand-400" />
                          CONTRACT VERIFIED :: LICENSE {project.contractData.licenseNumber}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-5 pl-1 border-l-2 border-brand-500/20">
                      <p className="text-sm text-gray-300 leading-relaxed font-light pl-4">
                        {project.description}
                      </p>
                    </div>

                    {/* Footer with Link */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-xs text-brand-400 group-hover:text-brand-300 font-mono tracking-wide transition-colors flex items-center gap-2">
                        {project.link !== '#' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 group-hover:animate-ping"></span>
                            ACCESS UPLINK &rarr;
                          </>
                        ) : (
                          <span className="text-gray-500">UPLINK_OFFLINE</span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/20 font-mono">
                        ID: TSP-{project.id}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aquaponic Section */}
        <div className="mb-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-blue-300 tracking-wide uppercase font-rajdhani">Emerging Protocols</h3>
              <div className="h-px w-12 bg-blue-500/50"></div>
            </div>
            <span className="text-[10px] text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full bg-blue-900/20 font-mono font-bold tracking-widest flex items-center gap-2">
              <BeakerIcon className="w-3 h-3" /> AQUAPONIC CLASS
            </span>
          </div>
          <div className="space-y-6">
            {aquaponicProjects.map((project) => {
              return (
                <div
                  key={project.id}
                  className={`group p-6 rounded-2xl border transition-all duration-300 bg-black/40 ${project.projectStatus === 'development' ? 'opacity-90 border-dashed border-blue-500/20' : 'border-white/10'
                    }`}
                  style={{
                    background: `linear-gradient(135deg, rgba(5,10,20,0.9) 0%, rgba(0,5,15,0.8) 100%)`,
                  }}
                >
                  <div className="flex flex-col md:flex-row items-start gap-5 mb-4">
                    <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 mx-auto md:mx-0">
                      <img
                        src={project.medallionUrl}
                        alt={`${project.name} medallion`}
                        className="w-full h-full object-cover rounded-full border-2 border-blue-500/30"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                        <h4 className="text-xl font-bold text-gray-300 group-hover:text-blue-300 transition-colors font-rajdhani">{project.name}</h4>
                        {/* Dev Badge */}
                        {project.projectStatus === 'development' && (
                          <div className="bg-blue-900/20 border border-blue-500/30 px-2 py-1 rounded text-[10px] text-blue-400 font-mono tracking-widest self-center md:self-start">
                            IN_DEVELOPMENT
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-3 text-xs opacity-60">
                        <span className="text-blue-400/70 font-mono">{project.city}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed font-light italic mb-4 border-l-2 border-blue-500/20 pl-4">
                    {project.description}
                  </p>

                  <div className="text-xs text-blue-500/50 font-mono tracking-widest pt-3 border-t border-white/5">
                    ESTIMATED LAUNCH: {project.dateEstablished}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-4 opacity-30">
          <div className="text-[9px] font-mono tracking-[0.5em] text-white">THE SATELLITE PROJECT REPOSITORY</div>
          <div className="text-[9px] font-mono text-brand-500 mt-1">SECURE CONNECTION ESTABLISHED</div>
        </div>

        {/* Empty State */}
        {hydroponicProjects.length === 0 && aquaponicProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-brand-500/20 mb-6 text-7xl font-rajdhani font-bold animate-pulse">
              NULL
            </div>
            <p className="text-brand-200 text-lg font-bold tracking-widest">REPOSITORY EMPTY</p>
            <div className="h-px w-24 bg-brand-500/30 mx-auto my-4"></div>
            <p className="text-brand-400/60 text-sm font-mono">NO SIGNALS DETECTED</p>
          </div>
        )}

        {/* Loading State Overlay */}
        {!colorsLoaded && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-2xl z-50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-brand-300 font-mono text-xs tracking-widest">CALIBRATING SPECTRUM...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}