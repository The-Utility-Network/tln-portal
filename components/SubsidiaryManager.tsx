'use client';

import React, { useState, useEffect } from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface Subsidiary {
  id: string;
  name: string;
  medallionUrl: string;
  link: string;
  projectStatus: 'live' | 'in progress';
  mintStatus: 'live' | 'inactive';
  description: string;
  dateEstablished: string;
  city: string;
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
        resolve({ primary: 'rgba(0, 200, 81, 0.15)', secondary: 'rgba(0, 200, 81, 0.3)', accent: 'rgba(0, 200, 81, 1)' });
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
        resolve({ primary: 'rgba(0, 200, 81, 0.15)', secondary: 'rgba(0, 200, 81, 0.3)', accent: 'rgba(0, 200, 81, 1)' });
        return;
      }

      const [primaryRGB] = sortedColors[0];
      const [secondaryRGB] = sortedColors[1] || sortedColors[0];

      const primary = `rgba(${primaryRGB}, 0.15)`;
      const secondary = `rgba(${primaryRGB}, 0.3)`;
      const accent = `rgb(${primaryRGB})`;

      resolve({ primary, secondary, accent });
    };

    img.onerror = () => {
      resolve({ primary: 'rgba(0, 200, 81, 0.15)', secondary: 'rgba(0, 200, 81, 0.3)', accent: 'rgba(0, 200, 81, 1)' });
    };

    img.src = imageSrc;
  });
};

// TLN-focused subsidiaries with botanical theme
const subsidiaries: Subsidiary[] = [
  {
    id: '1',
    name: 'The Loch Ness Botanical Society',
    medallionUrl: '/Medallions/TLN.png',
    link: 'https://www.thelochnessbotanicalsociety.com',
    projectStatus: 'live',
    mintStatus: 'inactive',
    description: 'Advanced industrial-scale automation and tokenization for the botanical industry, specializing in sustainable cultivation practices.',
    dateEstablished: 'March 2022',
    city: 'Santa Fe, NM',
  },
  {
    id: '2',
    name: 'The Satellite Project Om',
    medallionUrl: '/Medallions/TSPAum1.png',
    link: 'https://omgrown.life',
    projectStatus: 'live',
    mintStatus: 'live',
    description: 'State-of-the-art tokenized and automated, vertically integrated hydroponic cultivation facility.',
    dateEstablished: 'February 2025',
    city: 'Santa Fe, NM',
  },
  {
    id: '3',
    name: 'The Utility Company',
    medallionUrl: '/Medallions/TUC.png',
    link: 'https://www.theutilitycompany.co',
    projectStatus: 'live',
    mintStatus: 'inactive',
    description: 'Parent company providing industrial automation, tokenization services, and blockchain solutions.',
    dateEstablished: 'January 2021',
    city: 'Albuquerque, NM',
  },
  {
    id: '4',
    name: 'The Graine Ledger',
    medallionUrl: '/Medallions/TGL.png',
    link: 'https://www.thegraineledger.com',
    projectStatus: 'live',
    mintStatus: 'inactive',
    description: 'Tokenized and automated brewing and distilling operations focused on agricultural innovation.',
    dateEstablished: 'March 2022',
    city: 'Albuquerque, NM',
  },
  {
    id: '5',
    name: 'Arthaneeti',
    medallionUrl: '/Medallions/AR.png',
    link: 'https://www.arthaneeti.org',
    projectStatus: 'in progress',
    mintStatus: 'inactive',
    description: 'Sociopolitical media platform and political DAO development firm supporting sustainable policies.',
    dateEstablished: 'August 2023',
    city: 'New Delhi, India',
  },
  {
    id: '6',
    name: 'NFTPD',
    medallionUrl: '/Medallions/NFTPD.png',
    link: 'https://www.nftpd.org',
    projectStatus: 'live',
    mintStatus: 'inactive',
    description: 'Digital collectibles and NFT platform supporting botanical and environmental conservation initiatives.',
    dateEstablished: 'June 2021',
    city: 'Global',
  },
];

export default function SubsidiaryManager() {
  const [subsidiaryColors, setSubsidiaryColors] = useState<{ [key: string]: ExtractedColors }>({});
  const [colorsLoaded, setColorsLoaded] = useState(false);

  // Extract colors from medallions on component mount
  useEffect(() => {
    const loadColors = async () => {
      const colorPromises = subsidiaries.map(async (subsidiary) => {
        const colors = await extractColorsFromImage(subsidiary.medallionUrl);
        return { id: subsidiary.id, colors };
      });

      const results = await Promise.all(colorPromises);
      const colorMap: { [key: string]: ExtractedColors } = {};

      results.forEach(({ id, colors }) => {
        colorMap[id] = colors;
      });

      setSubsidiaryColors(colorMap);
      setColorsLoaded(true);
    };

    loadColors();
  }, []);

  const handleSubsidiaryClick = (subsidiary: Subsidiary) => {
    if (subsidiary.projectStatus === 'live') {
      window.open(subsidiary.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Sort subsidiaries by ID number for display
  const sortedSubsidiaries = [...subsidiaries].sort((a, b) => parseInt(a.id) - parseInt(b.id));
  const activeSubsidiaries = sortedSubsidiaries.filter(sub => sub.projectStatus === 'live');
  const inactiveSubsidiaries = sortedSubsidiaries.filter(sub => sub.projectStatus !== 'live');

  return (
    <div
      className="relative isolate space-y-6 rounded-2xl shadow-[0_0_50px_rgba(0,191,138,0.1)] bg-brand-950/60 border border-brand-500/30 p-6 w-full md:w-3/4 lg:w-1/2 mx-auto"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className="flex justify-center items-center mb-6 border-b border-brand-500/30 pb-4">
        <h2 className="text-xl font-bold text-white tracking-widest font-rajdhani uppercase">Botanical Subsidiaries</h2>
      </div>

      {/* Active Subsidiaries */}
      {activeSubsidiaries.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-emerald-100 mb-3 font-rajdhani">Active Projects</h3>
          <div className="space-y-4">
            {activeSubsidiaries.map((subsidiary) => {
              const colors = subsidiaryColors[subsidiary.id] || {
                primary: 'rgba(0, 200, 81, 0.15)',
                secondary: 'rgba(0, 200, 81, 0.3)',
                accent: 'rgba(0, 200, 81, 1)'
              };

              return (
                <div
                  key={subsidiary.id}
                  onClick={() => handleSubsidiaryClick(subsidiary)}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${subsidiary.projectStatus === 'live'
                    ? 'hover:scale-[1.02] cursor-pointer transform hover:shadow-[0_0_30px_rgba(0,191,138,0.2)] bg-black/40'
                    : 'cursor-default bg-black/20 opacity-50'
                    }`}
                  style={{
                    borderColor: 'rgba(0, 191, 138, 0.2)',
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      {/* Medallion */}
                      <div className="flex-shrink-0 w-14 h-14">
                        <img
                          src={subsidiary.medallionUrl || '/Medallions/TLN.png'}
                          alt={`${subsidiary.name} medallion`}
                          className="w-full h-full object-cover rounded-full border-2 shadow-lg"
                          style={{ borderColor: colors.accent }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/Medallions/TLN.png';
                          }}
                        />
                      </div>

                      {/* Subsidiary Name and Meta */}
                      <div className="flex-grow">
                        <h4 className="text-xl font-bold text-white mb-1 tracking-tight font-rajdhani">{subsidiary.name}</h4>
                        <div className="flex items-center space-x-3 text-xs opacity-80">
                          <span className="text-white font-mono">EST. {subsidiary.dateEstablished}</span>
                          <span className="text-white">•</span>
                          <span className="text-white font-mono">{subsidiary.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white opacity-70 font-mono">PROJECT</span>
                        <div className={`h-2.5 w-2.5 rounded-full ${subsidiary.projectStatus === 'live' ? 'bg-green-400' : 'bg-yellow-400'
                          } shadow-md`}></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white opacity-70 font-mono">MINT</span>
                        <div className={`h-2.5 w-2.5 rounded-full ${subsidiary.mintStatus === 'live' ? 'bg-green-400' : 'bg-red-400'
                          } shadow-md`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-100 leading-relaxed opacity-90 font-light">
                      {subsidiary.description}
                    </p>
                  </div>

                  {/* Footer with Link */}
                  <div className="flex items-center justify-between pt-3 border-t border-white border-opacity-20">
                    <div className="text-xs text-white opacity-60 font-mono tracking-wide">
                      {subsidiary.link.replace(/https?:\/\//, '').replace(/\/$/, '')}
                    </div>
                    <div className="text-xs text-white opacity-80 font-mono">
                      ID: {subsidiary.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inactive Subsidiaries */}
      {inactiveSubsidiaries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-emerald-100 mb-3">In Progress</h3>
          <div className="space-y-4">
            {inactiveSubsidiaries.map((subsidiary) => {
              const colors = subsidiaryColors[subsidiary.id] || {
                primary: 'rgba(107, 114, 128, 0.15)',
                secondary: 'rgba(107, 114, 128, 0.3)',
                accent: 'rgba(107, 114, 128, 1)'
              };

              return (
                <div
                  key={subsidiary.id}
                  className="p-5 rounded-2xl ring-1 opacity-70"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    borderColor: colors.accent,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    filter: 'grayscale(0.6)',
                  }}
                >
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      {/* Medallion */}
                      <div className="flex-shrink-0 w-14 h-14">
                        <img
                          src={subsidiary.medallionUrl || '/Medallions/TLN.png'}
                          alt={`${subsidiary.name} medallion`}
                          className="w-full h-full object-cover rounded-full border-2 grayscale shadow-lg"
                          style={{ borderColor: colors.accent }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/Medallions/TLN.png';
                          }}
                        />
                      </div>

                      {/* Company Name and Meta */}
                      <div className="flex-grow">
                        <h4 className="text-xl font-bold text-gray-300 mb-1">{subsidiary.name}</h4>
                        <div className="flex items-center space-x-3 text-xs opacity-60">
                          <span className="text-gray-400 font-mono">EST. {subsidiary.dateEstablished}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400 font-mono">{subsidiary.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 opacity-70 font-mono">PROJECT</span>
                        <div className={`h-2.5 w-2.5 rounded-full ${subsidiary.projectStatus === 'live' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 opacity-70 font-mono">MINT</span>
                        <div className={`h-2.5 w-2.5 rounded-full ${subsidiary.mintStatus === 'live' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-400 leading-relaxed opacity-80 font-light">
                      {subsidiary.description}
                    </p>
                  </div>

                  {/* Footer with Link */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-500 border-opacity-20">
                    <div className="text-xs text-gray-400 opacity-50 font-mono tracking-wide">
                      {subsidiary.link.replace(/https?:\/\//, '').replace(/\/$/, '')}
                    </div>
                    <div className="text-xs text-gray-400 opacity-60 font-mono">
                      ID: {subsidiary.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeSubsidiaries.length === 0 && inactiveSubsidiaries.length === 0 && (
        <div className="text-center py-8">
          <div className="text-emerald-300 mb-4">
            <BuildingOfficeIcon className="h-16 w-16 mx-auto opacity-50" />
          </div>
          <p className="text-emerald-200 text-lg">No subsidiaries available</p>
          <p className="text-emerald-300 text-sm">Check back later for updates</p>
        </div>
      )}

      {/* Loading State */}
      {!colorsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-900 bg-opacity-50 rounded-2xl">
          <div className="text-emerald-100">Loading subsidiary themes...</div>
        </div>
      )}
    </div>
  );
} 