'use client';

import React, { useState, useEffect } from 'react';

interface MotionPermissionProps {
    onGranted: () => void;
}

export default function MotionPermission({ onGranted }: MotionPermissionProps) {
    const [showModal, setShowModal] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if we are on iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(isIOSDevice);

        // Check if permission is needed
        if (typeof (window as any).DeviceOrientationEvent !== 'undefined' &&
            typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
            // It's iOS 13+ or similar that needs explicit permission
            setShowModal(true);
        } else {
            // No explicit permission request API (Android or older iOS)
            // We still show the modal to ensure a "user gesture" for audio and general orientation events
            setShowModal(true);
        }
    }, []);

    const requestPermission = async () => {
        try {
            if (typeof (window as any).DeviceOrientationEvent !== 'undefined' &&
                typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
                const response = await (window as any).DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    handleGranted();
                } else {
                    console.warn('Motion permission denied');
                    setShowModal(false);
                    // Still let them in, but motion won't work
                    onGranted();
                }
            } else {
                // Not iOS 13+, just proceed
                handleGranted();
            }
        } catch (error) {
            console.error('Error requesting motion permission:', error);
            handleGranted();
        }
    };

    const handleGranted = () => {
        setShowModal(false);
        onGranted();
    };

    return (
        <>
            {showModal && (
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl transition-all duration-500 ease-in-out"
                    style={{
                        opacity: showModal ? 1 : 0,
                        pointerEvents: showModal ? 'auto' : 'none'
                    }}
                >
                    <div
                        className="w-full max-w-md overflow-hidden relative transition-all duration-500 ease-out transform"
                        style={{
                            transform: showModal ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
                            opacity: showModal ? 1 : 0
                        }}
                    >
                        {/* Emerald Glow Background */}
                        <div className="absolute inset-0 bg-brand-900/40 border border-brand-500/30 rounded-[32px] shadow-[0_0_50px_rgba(0,191,138,0.2)]" />

                        <div className="relative p-8 flex flex-col items-center">
                            {/* Medallion */}
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl animate-pulse" />
                                <img
                                    src="/Medallions/TLN.png"
                                    alt="TLN Medallion"
                                    className="w-full h-full object-contain relative z-10"
                                />
                            </div>

                            {/* Text Content */}
                            <h2 className="text-brand-400 font-rajdhani text-2xl font-bold tracking-[0.2em] text-center mb-4 uppercase">
                                Sensor Authorization
                            </h2>

                            <p className="text-gray-300 font-sans text-center text-sm leading-relaxed mb-8 px-4">
                                The Loch Ness Botanical Society requires access to your device's motion sensors to calibrate the VR portal and provide an immersive experience.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3 w-full">
                                <button
                                    onClick={requestPermission}
                                    className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-black font-rajdhani font-black tracking-widest text-lg rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(0,191,138,0.3)] hover:shadow-[0_12px_40px_rgba(0,191,138,0.5)] transform hover:-translate-y-1 active:scale-[0.98]"
                                >
                                    INITIALIZE PORTAL
                                </button>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-3 text-brand-500/50 hover:text-brand-500 font-rajdhani text-sm tracking-widest transition-colors"
                                >
                                    PROCEED WITHOUT SENSORS
                                </button>
                            </div>

                            {/* HUD Decoration */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-brand-500/40 rounded-tl-xl" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-brand-500/40 rounded-tr-xl" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-brand-500/40 rounded-bl-xl" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-brand-500/40 rounded-br-xl" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
