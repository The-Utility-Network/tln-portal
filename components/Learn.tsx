'use client';
import { useState, useEffect } from 'react';
import { Squares2X2Icon, ListBulletIcon, XMarkIcon, ArrowTopRightOnSquareIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import parse from 'html-react-parser';
import { FaXTwitter, FaInstagram, FaMedium } from 'react-icons/fa6';

// TLN Specific configuration
const MEDIUM_RSS_URL = 'https://medium.com/feed/@lochnesssociety';
const PLACEHOLDER_IMAGE = 'https://storage.googleapis.com/tgl_cdn/images/tlnbanner.png';

const extractFirstImage = (htmlString: string) => {
  const imgTag = htmlString.match(/<img[^>]+src="([^">]+)"/);
  return imgTag ? imgTag[1] : null;
};

const removeFirstImageOrFigure = (htmlString: string) => {
  return htmlString.replace(/<figure[^>]*>.*?<\/figure>|<img[^>]+>/, '');
};

const decodeHtml = (html: string) => {
  if (typeof document === 'undefined') return html; // SSR safety
  const txt = document.createElement('textarea') as HTMLTextAreaElement;
  txt.innerHTML = html;
  return txt.value;
};

export default function LearnForm() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [brokenImages, setBrokenImages] = useState<{ [key: string]: boolean }>({});
  const [readerHeroBroken, setReaderHeroBroken] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default to grid

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`);
        const feedData = response.data.items;
        setArticles(feedData);
      } catch (error) {
        console.error('Error fetching Medium feed:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleTileClick = (article: any) => {
    setSelectedArticle(article);
    setReaderHeroBroken(false);
  };

  const handleImageError = (index: number) => {
    setBrokenImages(prev => ({ ...prev, [index]: true }));
  };

  const socialLinks = [
    { icon: FaXTwitter, url: 'https://x.com/lochnesssociety', color: 'hover:text-white' },
    { icon: FaInstagram, url: 'https://www.instagram.com/lochnesssociety/', color: 'hover:text-pink-500' },
    { icon: FaMedium, url: 'https://medium.com/@lochnesssociety', color: 'hover:text-brand-500' },
  ];

  return (
    <div
      className="flex flex-col h-full font-rajdhani overflow-hidden"
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 4px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(0, 191, 138, 0.2);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 191, 138, 0.4);
        }

        /* Spectacular Reader Styles - Emerald Edition */
        :global(.spectacular-prose) {
          color: rgba(255, 255, 255, 0.8);
          font-family: var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 1.125rem;
          line-height: 1.8;
        }
        :global(.spectacular-prose p) {
          margin-bottom: 1.75rem;
        }
        :global(.spectacular-prose h1), :global(.spectacular-prose h2), :global(.spectacular-prose h3) {
          color: #ffffff;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.025em;
          line-height: 1.2;
          font-family: var(--font-rajdhani);
          text-transform: uppercase;
        }
        :global(.spectacular-prose h2) { font-size: 1.875rem; border-bottom: 1px solid rgba(0, 191, 138, 0.2); padding-bottom: 0.5rem; }
        :global(.spectacular-prose h3) { font-size: 1.5rem; }
        :global(.spectacular-prose a) {
          color: #00bf8a;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
          transition: opacity 0.2s;
        }
        :global(.spectacular-prose a:hover) { opacity: 0.7; }
        :global(.spectacular-prose blockquote) {
          border-left: 4px solid #00bf8a;
          padding-left: 1.5rem;
          font-style: italic;
          color: rgba(0, 191, 138, 0.6);
          margin: 2rem 0;
          background: rgba(0, 191, 138, 0.05);
          padding: 1.5rem;
          border-radius: 0 8px 8px 0;
        }
        :global(.spectacular-prose strong) { color: #fff; font-weight: 700; }
        :global(.spectacular-prose ul) {
          margin-bottom: 1.75rem;
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        :global(.spectacular-prose li) {
          margin-bottom: 0.5rem;
        }
        :global(.spectacular-prose img) {
          border-radius: 0.75rem;
          margin: 2.5rem 0;
          border: 1px solid rgba(0, 191, 138, 0.2);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        :global(.spectacular-prose code) {
          background: rgba(0, 191, 138, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: #b3ebda;
          border: 1px solid rgba(0, 191, 138, 0.2);
        }
      `}</style>

      {/* Main Glass Container */}
      <div
        className="flex flex-col h-full rounded-2xl border border-brand-500/30 bg-brand-950/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,191,138,0.2)] relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between items-center bg-brand-900/30 border-b border-brand-500/20 p-4 md:p-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-lg border border-brand-500/30">
              <BookOpenIcon className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-widest text-white uppercase leading-none">
                LEARN<span className="text-brand-400">//</span>HUB
              </h2>
              <span className="text-[10px] text-brand-300/50 uppercase tracking-[0.2em] font-bold">Ecological Knowledge Base</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Socials */}
            <div className="flex items-center bg-brand-950/60 rounded-full px-4 py-2 border border-brand-500/20 gap-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-brand-300/60 transition-all duration-300 hover:scale-110 ${social.color}`}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex bg-brand-950/60 p-1 rounded-lg border border-brand-500/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20' : 'text-brand-300/60 hover:bg-brand-500/20 hover:text-white'}`}
                title="Grid View"
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20' : 'text-brand-300/60 hover:bg-brand-500/20 hover:text-white'}`}
                title="List View"
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Articles Feed */}
        <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-brand-500/20 scrollbar-track-transparent relative">
          {/* Banner */}
          <div className="mx-4 md:mx-6 mt-6 mb-4 h-auto overflow-hidden rounded-xl border border-brand-500/20 shadow-[0_0_20px_rgba(0,191,138,0.15)]">
            <img src={PLACEHOLDER_IMAGE} alt="Learn Banner" className="w-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700" />
          </div>

          <div className="px-4 md:px-6 pb-6">
            {articles.length === 0 ? (
              <div className="space-y-6">
                <div className="text-center py-8 flex flex-col items-center justify-center opacity-40">
                  <div className="w-16 h-[1px] bg-brand-400/30 mb-4" />
                  <div className="text-[10px] tracking-[0.3em] text-brand-300 font-bold uppercase">Synthesizing Content...</div>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4 max-w-4xl mx-auto"}>
                {articles
                  .filter(article => extractFirstImage(article.description))
                  .map((article, index) => {
                    const firstImage = extractFirstImage(article.description);

                    return (
                      <div
                        key={index}
                        onClick={() => handleTileClick(article)}
                        className={`group relative rounded-xl overflow-hidden cursor-pointer bg-black/20 border border-white/5 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,191,138,0.1)] ${viewMode === 'list' ? 'p-4 flex gap-4' : 'flex flex-col'}`}
                      >
                        <div className={viewMode === 'list' ? "flex items-center gap-4 w-full" : "flex flex-col h-full"}>
                          {/* Thumbnail Container */}
                          <div className={`flex-shrink-0 bg-brand-950/40 overflow-hidden relative ${viewMode === 'list' ? 'w-32 h-24 rounded-lg' : 'w-full aspect-video border-b border-white/5'}`}>
                            <img
                              src={brokenImages[index] ? PLACEHOLDER_IMAGE : firstImage || undefined}
                              alt={article.title}
                              onError={() => handleImageError(index)}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            />
                            {/* Overlay Gradient for Text Readability in Grid */}
                            {viewMode === 'grid' && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                            )}
                          </div>

                          {/* Title & Info */}
                          <div className={viewMode === 'list' ? "flex-1 min-w-0 flex flex-col justify-center" : "p-5 flex-1 flex flex-col justify-between"}>
                            <div>
                              <div className="flex items-center gap-2 text-[10px] text-brand-300/40 mb-2 uppercase tracking-wider font-bold">
                                <span className="bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/10 text-brand-300/60">Medium</span>
                                <span>//</span>
                                <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                              </div>
                              <h3 className={`font-bold text-white leading-tight group-hover:text-brand-300 transition-colors line-clamp-2 ${viewMode === 'list' ? 'text-lg' : 'text-lg mb-4'}`}>
                                {decodeHtml(article.title)}
                              </h3>
                            </div>

                            <div className={`flex items-center justify-between mt-auto ${viewMode === 'list' ? 'hidden' : ''}`}>
                              <span className="text-[10px] text-brand-300/30 font-mono">{article.author}</span>
                              <div className="flex items-center gap-1 text-[10px] text-brand-300 border border-brand-500/20 px-2 py-1 rounded hover:bg-brand-500 hover:text-black transition-colors font-bold">
                                VIEW DATA <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* SPECTACULAR READER OVERLAY */}
          {selectedArticle && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center lg:p-12 animate-in fade-in duration-300">
              <div
                className="absolute inset-0 bg-brand-950/95 backdrop-blur-xl"
                onClick={() => setSelectedArticle(null)}
              />

              <div
                className="relative w-full max-w-5xl h-full bg-[#00120d] lg:rounded-2xl border border-brand-500/20 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
              >
                {/* Reader Header */}
                <div className="flex justify-between items-center p-4 md:p-6 border-b border-brand-500/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-brand-500 text-black text-[10px] font-bold tracking-widest uppercase">Verified Knowledge</span>
                      <span className="text-brand-300/40 text-xs font-mono">{new Date(selectedArticle.pubDate).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-white font-bold text-lg md:text-2xl truncate leading-tight font-rajdhani uppercase">
                      {decodeHtml(selectedArticle.title)}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-2 bg-brand-500/5 border border-brand-500/20 rounded-full hover:bg-brand-500 hover:text-black transition-all text-brand-300"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Reader Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-500/20 scrollbar-track-transparent bg-black/20 relative">
                  {/* Hero Image Section */}
                  <div className="w-full relative h-[40vh] md:h-[50vh] overflow-hidden border-b border-brand-500/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00120d] to-transparent z-10" />
                    <img
                      src={(extractFirstImage(selectedArticle.description) && !readerHeroBroken)
                        ? (extractFirstImage(selectedArticle.description) as string)
                        : PLACEHOLDER_IMAGE}
                      className="w-full h-full object-cover opacity-60"
                      alt="Hero"
                      onError={() => setReaderHeroBroken(true)}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                      <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight max-w-4xl leading-none drop-shadow-2xl font-rajdhani">
                        {decodeHtml(selectedArticle.title)}
                      </h1>
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto p-6 md:p-12 relative z-20 -mt-10">
                    <div className="spectacular-prose">
                      {parse(removeFirstImageOrFigure(selectedArticle.description))}
                    </div>

                    {/* Footer Link */}
                    <div className="mt-16 pt-12 border-t border-brand-500/10 flex flex-col items-center gap-6 text-center pb-20">
                      <p className="text-brand-300/40 text-sm font-mono tracking-widest uppercase font-bold">End of Transmission</p>
                      <a
                        href={selectedArticle.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm tracking-[0.2em] transition-all duration-300 border border-brand-500/20 bg-brand-500/5 text-white hover:bg-brand-500 hover:text-black hover:scale-105 shadow-xl shadow-brand-500/10"
                      >
                        READ ON MEDIUM
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
