'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useActiveAccount, ConnectButton, darkTheme } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { getThirdwebClient } from '../src/utils/createThirdwebClient';
import {
    ChatBubbleLeftRightIcon,
    CurrencyDollarIcon,
    BeakerIcon,
    GlobeAltIcon,
    BookOpenIcon,
    MicrophoneIcon,
    DocumentTextIcon,
    ShieldExclamationIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

const client = getThirdwebClient();

interface PortalHUDProps {
    onNavigate: (view: string) => void;
    currentView: string;
    isPlaying: boolean;
    onToggleMusic: () => void;
}

const PortalHUD: React.FC<PortalHUDProps> = ({ onNavigate, currentView, isPlaying, onToggleMusic }) => {
    const account = useActiveAccount();
    const [time, setTime] = useState<string>('');
    const [medallionOpen, setMedallionOpen] = useState(false);
    const medallionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    // Close medallion menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (medallionRef.current && !medallionRef.current.contains(event.target as Node)) {
                setMedallionOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { id: 'Diamond Viewer', icon: GlobeAltIcon, label: 'NET' },
        { id: 'Chat', icon: ChatBubbleLeftRightIcon, label: 'CHAT' },
        { id: 'Directory', icon: BeakerIcon, label: 'DIR' },
        { id: 'Learn', icon: BookOpenIcon, label: 'LEARN' },
        { id: 'Buy', icon: CurrencyDollarIcon, label: 'BUY' }, // This might be "Repository" in TLN
        { id: 'Reserve', icon: ShieldExclamationIcon, label: 'RES' },
        { id: 'Mythology', icon: SparklesIcon, label: 'LORE' },
    ];

    const socialLinks = [
        { label: 'COLLECTION', url: 'https://digibazaar.io/ethereum/collection/0xc55b865a686d19eb0490fb9237cba0ba49e73374', icon: GlobeAltIcon },
        { label: 'WHITEPAPER', url: 'https://na2.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhCNdX-YdRqatZQAdl5Mqdkhnnd8z31YujH2iIEcPJSrSr0tPI0Y2cog_5d17HU8z1g*', icon: DocumentTextIcon },
        { label: 'ABOUT US', url: 'https://requiem-electric.com/', icon: MicrophoneIcon },
    ];

    return (
        <>
            {/* TOP STATUS BAR */}
            <div className="fixed top-0 left-0 w-full z-[2000] px-3 md:px-6 py-2 flex justify-between items-center pointer-events-none">
                {/* Left: System Status */}
                <div className="flex items-center space-x-2 md:space-x-4 pointer-events-auto">
                    <div className="flex flex-col">
                        <span className="hidden md:block text-xs font-mono text-brand-400 tracking-widest opacity-80">SYS.ONLINE</span>
                        <span className="text-sm md:text-md font-bold text-white tracking-widest font-mono">TLN//PORTAL</span>
                    </div>

                    {/* Audio Toggle in Header */}
                    <button
                        onClick={onToggleMusic}
                        className="ml-4 p-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors pointer-events-auto flex items-center justify-center outline-none"
                        title={isPlaying ? "Mute Music" : "Play Music"}
                    >
                        {isPlaying ? (
                            <span className="text-brand-400 text-sm animate-pulse">🔊</span>
                        ) : (
                            <span className="text-white/40 text-sm">🔇</span>
                        )}
                    </button>
                </div>

                {/* Right: Wallet & Time */}
                <div className="flex items-center space-x-2 md:space-x-6 pointer-events-auto">
                    <div className="hidden md:block text-xs font-mono text-white tracking-wider">
                        {time}
                    </div>
                    <div id="portal-connect-wrapper">
                        <ConnectButton
                            client={client}
                            wallets={[
                                inAppWallet({
                                    auth: {
                                        options: [
                                            "google", "discord", "telegram", "farcaster", "email",
                                            "x", "passkey", "phone", "twitch", "github", "steam",
                                            "coinbase", "line", "apple", "facebook", "guest", "tiktok"
                                        ],
                                    },
                                }),
                                createWallet("io.rabby"),
                                createWallet("io.metamask"),
                                createWallet("com.coinbase.wallet"),
                                createWallet("me.rainbow"),
                                createWallet("io.zerion.wallet"),
                            ]}
                            chain={base}
                            theme={darkTheme({
                                colors: {
                                    accentText: '#00bf8a', // Brand Emerald (brand-500)
                                    accentButtonBg: '#00bf8a',
                                    primaryButtonBg: '#00bf8a',
                                    primaryButtonText: '#ffffff',
                                    secondaryButtonBg: 'rgba(0, 191, 138, 0.2)', // Emerald tint
                                    secondaryButtonHoverBg: 'rgba(0, 191, 138, 0.4)',
                                    secondaryButtonText: '#ffffff',
                                    secondaryText: '#b3ebda', // brand-100
                                    modalBg: 'rgba(0, 20, 15, 0.95)', // Deep emerald bg
                                    connectedButtonBg: 'rgba(0, 191, 138, 0.3)',
                                    borderColor: 'rgba(0, 191, 138, 0.4)',
                                    separatorLine: 'rgba(0, 191, 138, 0.2)',
                                    selectedTextBg: '#00bf8a',
                                    tooltipBg: '#004030',
                                    tooltipText: '#ffffff',
                                    skeletonBg: 'rgba(0, 191, 138, 0.1)',
                                    tertiaryBg: 'rgba(0, 191, 138, 0.15)',
                                    inputAutofillBg: 'rgba(0, 191, 138, 0.1)',
                                },
                            })}
                            connectModal={{
                                size: 'wide',
                                titleIcon: '/Medallions/TLN.png',
                                welcomeScreen: {
                                    title: 'Welcome to The Living Network',
                                    subtitle: 'Connect your wallet to proceed',
                                    img: {
                                        src: '/Medallions/TLN.png',
                                        width: 150,
                                        height: 150,
                                    },
                                },
                                showThirdwebBranding: false,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* BOTTOM DOCK */}
            <div className="fixed bottom-[env(safe-area-inset-bottom,16px)] md:bottom-8 left-1/2 transform -translate-x-1/2 z-[2000] pointer-events-auto max-w-[95vw] pb-2 md:pb-0">
                <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-6 py-2 md:py-3 bg-brand-950/60 backdrop-blur-2xl border border-brand-500/30 rounded-full shadow-[0_0_30px_rgba(0,191,138,0.2)] overflow-x-auto no-scrollbar">

                    {/* MEDALLION MENU */}
                    <div className="relative mr-1 md:mr-2 flex-shrink-0" ref={medallionRef}>
                        {medallionOpen && (
                            <div className="absolute bottom-full left-0 mb-4 w-40 bg-brand-950/80 border border-brand-500/30 rounded-lg p-2 backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200 shadow-[0_0_20px_rgba(0,191,138,0.15)]">
                                <div className="space-y-1">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-3 py-2 text-xs font-mono text-brand-100 hover:text-black hover:bg-brand-400 rounded transition-colors flex items-center justify-between group"
                                        >
                                            {link.label}
                                            <link.icon className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                        </a>
                                    ))}
                                </div>
                                {/* Decorative pointer */}
                                <div className="absolute -bottom-1 left-6 w-2 h-2 bg-brand-950/80 border-r border-b border-brand-500/30 transform rotate-45"></div>
                            </div>
                        )}

                        <button
                            onClick={() => setMedallionOpen(!medallionOpen)}
                            className="pr-2 md:pr-4 border-r border-brand-500/10 flex items-center transition-opacity hover:opacity-80 outline-none"
                        >
                            <img
                                src="/Medallions/TLN.png"
                                alt="TLN Medallion"
                                className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_12px_rgba(0,191,138,0.4)] animate-pulse-slow max-w-[40px] max-h-[40px]"
                                style={{ width: '40px', height: '40px' }}
                            />
                        </button>
                    </div>

                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`group relative flex-shrink-0 flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg transition-all duration-300 ${isActive
                                    ? 'bg-brand-500/20 border border-brand-400/50 shadow-[0_0_15px_rgba(0,191,138,0.2)]'
                                    : 'hover:bg-brand-500/5 border border-transparent hover:border-brand-500/10'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 md:w-5 md:h-5 mb-0.5 transition-colors ${isActive ? 'text-brand-300' : 'text-slate-400 group-hover:text-brand-300'}`} />
                                <span className={`text-[8px] md:text-[9px] font-mono tracking-wider ${isActive ? 'text-brand-200' : 'text-slate-500 group-hover:text-brand-400'}`}>
                                    {item.label}
                                </span>

                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1/2 h-[2px] bg-brand-400 shadow-[0_0_8px_rgba(0,191,138,0.6)]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* DECORATIVE HUD LINES */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-12 left-6 w-[200px] h-[1px] bg-gradient-to-r from-brand-500/20 to-transparent" />
                <div className="absolute top-12 right-6 w-[200px] h-[1px] bg-gradient-to-l from-brand-500/20 to-transparent" />
                <div className="absolute bottom-12 left-6 w-[100px] h-[1px] bg-gradient-to-r from-brand-500/20 to-transparent" />
                <div className="absolute bottom-12 right-6 w-[100px] h-[1px] bg-gradient-to-l from-brand-500/20 to-transparent" />
            </div>
        </>
    );
};

export default PortalHUD;
