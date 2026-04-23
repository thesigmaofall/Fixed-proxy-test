/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, Home, Shield, X, Plus } from 'lucide-react';

export default function App() {
  const [urlInput, setUrlInput] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const predefinedUrls = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com' },
    { name: 'Brave', url: 'https://search.brave.com' },
  ];

  const handleNavigate = (url: string) => {
    let target = url;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }
    setUrlInput(target);
    setCurrentUrl(`/proxy?url=${encodeURIComponent(target)}`);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      // Force reload by resetting the src
      const current = currentUrl;
      setCurrentUrl('');
      setTimeout(() => setCurrentUrl(current), 50);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
      {/* Browser Chrome Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-3 flex flex-col gap-3 shadow-2xl z-10">
        
        {/* Row 1: Window Controls & Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="flex items-center bg-zinc-800 px-4 py-1.5 rounded-t-lg border-x border-t border-zinc-700 text-xs font-medium text-zinc-100 shadow-sm">
              <span className="mr-2">⚡</span> Ultraviolet Mirror
              <button className="ml-3 text-zinc-500 hover:text-zinc-300 transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
            <button className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              Cross-Origin Credentials Active
            </div>
          </div>
        </div>

        {/* Row 2: URL Bar and Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors" title="Back">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors" title="Forward">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={handleRefresh} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors" title="Reload">
              <RotateCw className="w-4 h-4" />
            </button>
            <button onClick={() => handleNavigate('https://www.google.com')} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors" title="Home">
              <Home className="w-4 h-4" />
            </button>
          </div>

          <form 
            className="flex-1 flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleNavigate(urlInput);
            }}
          >
            <div className="flex flex-1 items-center bg-zinc-950 border border-zinc-700 rounded-full px-4 py-1.5 shadow-inner focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
              <Shield className="w-3.5 h-3.5 text-zinc-600 mr-2" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-transparent border-none text-zinc-200 text-sm focus:ring-0 focus:outline-none"
                placeholder="Search or enter web address"
              />
              <button type="submit" className="ml-2 text-zinc-600 hover:text-zinc-400 transition-colors">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Predefined Search Engines */}
          <div className="flex items-center gap-2">
            {predefinedUrls.map((site) => {
              const colorClass = site.name === 'Google' ? 'text-blue-400' : site.name === 'Brave' ? 'text-orange-500' : 'text-red-400';
              return (
                <button
                  key={site.name}
                  onClick={() => handleNavigate(site.url)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md text-xs font-medium transition-colors flex items-center gap-2 text-zinc-300 shadow-sm"
                >
                  <span className={colorClass}>{site.name.charAt(0)}</span> {site.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Web Area */}
      <main className="flex-1 bg-white relative flex flex-col">
        {!currentUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white text-zinc-500">
            <Search className="w-16 h-16 mb-4 opacity-30 text-zinc-400" />
            <h2 className="text-xl font-medium mb-2 text-zinc-800">Web Mirror Start Page</h2>
            <p className="text-sm">Enter a URL or select a predefined bookmark to begin.</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-none flex-1"
            title="web-view"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}

        {/* Ultraviolet Overlay Indicator */}
        {currentUrl && (
          <div className="absolute bottom-4 right-4 bg-zinc-900/90 backdrop-blur border border-zinc-700 px-4 py-2 rounded-lg flex items-center gap-3 shadow-lg pointer-events-none">
            <div className="text-[10px] text-zinc-400">
              <div className="font-bold text-zinc-200 uppercase">Ultraviolet Engine</div>
              <div>Proxy: Active</div>
            </div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <div className="text-[10px] text-zinc-400">
              <div className="font-bold text-emerald-400">SECURE</div>
              <div>Sandbox</div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="bg-zinc-900 border-t border-zinc-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-zinc-500 z-10 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Connected to Proxy
          </span>
          <span className="text-zinc-600">|</span>
          <span>Latency: &lt; 50ms</span>
        </div>
        <div className="flex items-center gap-4 uppercase tracking-tighter">
          <span>Cookies: Enabled</span>
          <span>Headers: Sanitized</span>
        </div>
      </footer>
    </div>
  );
}
