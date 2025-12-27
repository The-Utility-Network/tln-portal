import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const alt = 'Loch Ness Botanical Society - NFT-Mediated Crypto Greenhouse';
export const size = { width: 2400, height: 1260 };
export const contentType = 'image/png';

const THEME = '#00bf8a'; // TLN Emerald Brand Color

export default async function Image() {
    let medallionBase64 = '';
    try {
        const medallionData = readFileSync(join(process.cwd(), 'public', 'Medallions', 'TLN.png'));
        medallionBase64 = `data:image/png;base64,${medallionData.toString('base64')}`;
    } catch (e) {
        console.error('Medallion not found, using fallback');
    }

    return new ImageResponse(
        (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
                position: 'relative',
                fontFamily: 'sans-serif'
            }}>
                {/* 1. Base Background - Premium Gradient since Image Generation is down */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 50% 50%, #002d22 0%, #000a08 100%)',
                    display: 'flex'
                }} />

                {/* Subtle bioluminescent glow spots */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(0, 191, 138, 0.05)', filter: 'blur(100px)' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 800, height: 800, borderRadius: '50%', background: 'rgba(0, 91, 67, 0.1)', filter: 'blur(120px)' }} />

                {/* Left Wing - QUOTE */}
                <div style={{
                    position: 'absolute',
                    left: 150,
                    top: 480,
                    width: 850,
                    height: 320,
                    borderRadius: '40px 0 0 40px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: '40px 280px 40px 40px',
                    boxShadow: 'inset 2px 2px 20px rgba(0, 191, 138, 0.2)',
                    background: 'rgba(0, 191, 138, 0.05)',
                    border: '1px solid rgba(0, 191, 138, 0.2)',
                    borderRight: 'none'
                }}>
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: '10' }}>
                        <div style={{ fontSize: 44, fontWeight: 700, color: 'white', lineHeight: 1.2, textAlign: 'right', textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}>
                            “In all things of nature there is something of the marvelous.”
                        </div>
                        <div style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: THEME,
                            marginTop: 16,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textShadow: '0 2px 20px black'
                        }}>
                            — Aristotle
                        </div>
                    </div>
                </div>

                {/* Right Wing */}
                <div style={{
                    position: 'absolute',
                    right: 80,
                    top: 480,
                    width: 950,
                    height: 320,
                    borderRadius: '0 40px 40px 0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '40px 40px 40px 280px',
                    boxShadow: 'inset -2px 2px 20px rgba(0, 191, 138, 0.2)',
                    background: 'rgba(0, 191, 138, 0.05)',
                    border: '1px solid rgba(0, 191, 138, 0.2)',
                    borderLeft: 'none'
                }}>
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: '10' }}>
                        <div style={{ fontSize: 40, color: 'white', fontWeight: 300, lineHeight: 1.2, display: 'flex', flexDirection: 'column', maxWidth: 640, textShadow: '0 4px 30px rgba(0,0,0,0.9)' }}>
                            <span style={{ fontWeight: 700, color: THEME }}>NFT-Mediated</span>
                            <span>Crypto Greenhouse</span>
                        </div>
                        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12, borderLeft: `6px solid ${THEME}`, paddingLeft: 30 }}>
                            <span style={{ fontSize: 24, color: '#D1D5DB', letterSpacing: '0.15em', fontWeight: 500, textShadow: '0 2px 10px black' }}>SANTA FE, NM</span>
                            <span style={{ fontSize: 24, color: THEME, letterSpacing: '0.15em', fontWeight: 700, textShadow: '0 2px 10px black' }}>theutilityfoundation.org/loch-ness-botanical-society</span>
                        </div>
                    </div>
                </div>

                {/* Center Medallion Ring */}
                <div style={{
                    position: 'absolute',
                    left: 810,
                    top: 240,
                    width: 780,
                    height: 780,
                    borderRadius: '50%',
                    display: 'flex',
                    zIndex: '40',
                    boxShadow: '0 0 50px rgba(0, 191, 138, 0.3)',
                    border: `4px solid ${THEME}`,
                    background: 'rgba(0, 15, 12, 0.9)'
                }} />

                {/* Visual Medallion */}
                <div style={{
                    position: 'absolute',
                    left: 850,
                    top: 280,
                    width: 700,
                    height: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '50'
                }}>
                    {medallionBase64 ? (
                        <img
                            src={medallionBase64}
                            width={700}
                            height={700}
                            style={{ width: 700, height: 700, objectFit: 'cover', borderRadius: '50%' }}
                        />
                    ) : (
                        <div style={{ width: 700, height: 700, borderRadius: '50%', background: THEME, opacity: 0.2 }} />
                    )}
                </div>

                {/* FRAME BARS */}
                <div style={{ position: 'absolute', left: 40, top: 40, width: 2320, height: 40, borderRadius: '24px 24px 0 0', background: 'rgba(0, 191, 138, 0.1)', border: '1px solid rgba(0, 191, 138, 0.2)', borderBottom: 'none' }} />
                <div style={{ position: 'absolute', left: 40, top: 1180, width: 2320, height: 40, borderRadius: '0 0 24px 24px', background: 'rgba(0, 191, 138, 0.1)', border: '1px solid rgba(0, 191, 138, 0.2)', borderTop: 'none' }} />

                <div style={{ position: 'absolute', left: 40, top: 80, width: 40, height: 1100, background: 'rgba(0, 191, 138, 0.1)', border: '1px solid rgba(0, 191, 138, 0.2)', borderTop: 'none', borderBottom: 'none' }} />
                <div style={{ position: 'absolute', left: 2320, top: 80, width: 40, height: 1100, background: 'rgba(0, 191, 138, 0.1)', border: '1px solid rgba(0, 191, 138, 0.2)', borderTop: 'none', borderBottom: 'none' }} />

                {/* HUD Corners */}
                <div style={{ position: 'absolute', top: 60, left: 60, width: 120, height: 120, borderTop: `12px solid ${THEME}`, borderLeft: `12px solid ${THEME}`, borderRadius: '24px 0 0 0' }} />
                <div style={{ position: 'absolute', top: 60, right: 60, width: 120, height: 120, borderTop: `12px solid ${THEME}`, borderRight: `12px solid ${THEME}`, borderRadius: '0 24px 0 0' }} />
                <div style={{ position: 'absolute', bottom: 60, left: 60, width: 120, height: 120, borderBottom: `12px solid ${THEME}`, borderLeft: `12px solid ${THEME}`, borderRadius: '0 0 0 24px' }} />
                <div style={{ position: 'absolute', bottom: 60, right: 60, width: 120, height: 120, borderBottom: `12px solid ${THEME}`, borderRight: `12px solid ${THEME}`, borderRadius: '0 0 24px 0' }} />

            </div>
        ),
        { ...size }
    );
}
