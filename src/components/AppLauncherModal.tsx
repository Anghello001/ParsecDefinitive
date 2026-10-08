import React, { useState } from 'react';
import { InstalledApp } from '../types/gamepad';
import { nativeBridge } from '../utils/nativeBridge';
import { Play, Search, Smartphone, ExternalLink, X, Plus, Clock } from 'lucide-react';

const PRESET_APPS: InstalledApp[] = [
  {
    name: 'Parsec Remote Gaming',
    packageName: 'tv.parsec.client',
    category: 'streaming',
    icon: 'P',
    color: '#00d632',
    description: 'Baja latencia 60fps para streaming de PC y gaming cooperativo',
  },
  {
    name: 'Moonlight Game Streaming',
    packageName: 'com.limelight',
    category: 'streaming',
    icon: 'M',
    color: '#38bdf8',
    description: 'Cliente de streaming NVIDIA GameStream / Sunshine de código abierto',
  },
  {
    name: 'Steam Link',
    packageName: 'com.valvesoftware.steamlink',
    category: 'streaming',
    icon: 'S',
    color: '#60a5fa',
    description: 'Transmite juegos de tu biblioteca de Steam desde tu PC',
  },
  {
    name: 'Xbox Game Pass / Cloud',
    packageName: 'com.gamepass',
    category: 'streaming',
    icon: 'X',
    color: '#107c10',
    description: 'Juegos de Xbox en la nube directamente en tu móvil',
  },
  {
    name: 'GeForce NOW',
    packageName: 'com.nvidia.geforcenow',
    category: 'streaming',
    icon: 'G',
    color: '#76b900',
    description: 'Cloud gaming de alto rendimiento con ray tracing',
  },
  {
    name: 'RetroArch',
    packageName: 'com.retroarch',
    category: 'emulator',
    icon: 'R',
    color: '#f59e0b',
    description: 'Frontend modular para emuladores de consolas retro',
  },
  {
    name: 'PPSSPP PSP Emulator',
    packageName: 'org.ppsspp.ppsspp',
    category: 'emulator',
    icon: 'P',
    color: '#3b82f6',
    description: 'Emulador de PlayStation Portable para Android',
  },
  {
    name: 'AetherSX2 / NetherSX2',
    packageName: 'xyz.aethersx2.android',
    category: 'emulator',
    icon: 'A',
    color: '#ec4899',
    description: 'Emulador de PlayStation 2 de alto rendimiento',
  },
  {
    name: 'Dolphin Emulator',
    packageName: 'org.dolphinemu.dolphinemu',
    category: 'emulator',
    icon: 'D',
    color: '#06b6d4',
    description: 'Emulador de GameCube y Wii para Android',
  },
];

interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppLaunched?: (app: InstalledApp | { name: string; packageName: string }) => void;
}

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({
  isOpen,
  onClose,
  onAppLaunched,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customPackage, setCustomPackage] = useState('');
  const [recentPackages, setRecentPackages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('parsec_overlay_recent_apps');
      return saved ? JSON.parse(saved) : ['tv.parsec.client'];
    } catch {
      return ['tv.parsec.client'];
    }
  });
  const [lastLaunched, setLastLaunched] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLaunch = (app: { name: string; packageName: string }) => {
    nativeBridge.launchApp(app.packageName, app.name);
    setLastLaunched(app.packageName);

    // Save to recents
    const updated = [app.packageName, ...recentPackages.filter(p => p !== app.packageName)].slice(0, 5);
    setRecentPackages(updated);
    try {
      localStorage.setItem('parsec_overlay_recent_apps', JSON.stringify(updated));
    } catch {
      // storage error
    }

    onAppLaunched?.(app);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleLaunchCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPackage.trim()) return;
    const cleanPkg = customPackage.trim();
    handleLaunch({ name: cleanPkg, packageName: cleanPkg });
    setCustomPackage('');
  };

  const filteredApps = PRESET_APPS.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-[#2d2d2d] rounded-sm shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#141414]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-100">
                Lanzador de Aplicaciones (App Launcher)
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">
                Abre juegos y streaming manteniendo el mando flotante visible encima
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white bg-[#202020] border border-[#2e2e2e] rounded-sm hover:bg-[#282828]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Custom Package input */}
        <div className="p-4 border-b border-[#222222] bg-[#1a1a1a] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar aplicación o paquete..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#121212] border border-[#2c2c2c] rounded-sm pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
            {['all', 'streaming', 'emulator'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-sm border uppercase transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#282828] border-emerald-500 text-emerald-400 font-bold'
                    : 'bg-[#181818] border-[#292929] text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat === 'streaming' ? 'Streaming / Parsec' : 'Emuladores'}
              </button>
            ))}
          </div>
        </div>

        {/* Apps List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Quick Launch Parsec Hero Banner */}
          <div className="p-3 bg-gradient-to-r from-[#112415] to-[#161f17] border border-emerald-800/60 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-emerald-600/30 border border-emerald-500 flex items-center justify-center font-black text-emerald-400 font-mono text-lg">
                P
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-emerald-300">Parsec (Recomendado)</span>
                  <span className="text-[9px] bg-emerald-950 border border-emerald-700 text-emerald-300 px-1 py-0.2 rounded-sm font-mono">
                    STREAMING
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 font-mono">tv.parsec.client</p>
              </div>
            </div>
            <button
              onClick={() => handleLaunch({ name: 'Parsec', packageName: 'tv.parsec.client' })}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono text-xs font-bold rounded-sm flex items-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Lanzar
            </button>
          </div>

          {/* App Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredApps.map(app => {
              const isLaunched = lastLaunched === app.packageName;
              return (
                <div
                  key={app.packageName}
                  className={`p-2.5 bg-[#1b1b1b] border rounded-sm flex items-center justify-between gap-2 hover:bg-[#202020] transition-colors ${
                    isLaunched ? 'border-emerald-500' : 'border-[#282828]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs shrink-0 font-mono"
                      style={{ backgroundColor: `${app.color}25`, color: app.color, border: `1px solid ${app.color}60` }}
                    >
                      {app.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-200 truncate">{app.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono truncate">{app.packageName}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLaunch(app)}
                    className="p-1.5 bg-[#252525] hover:bg-emerald-600 text-gray-300 hover:text-white border border-[#333333] hover:border-emerald-500 rounded-sm shrink-0 transition-colors"
                    title={`Abrir ${app.name}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Launch Custom Package Form */}
          <form onSubmit={handleLaunchCustom} className="mt-4 pt-3 border-t border-[#242424]">
            <label className="block text-[11px] font-mono text-gray-400 mb-1.5 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-gray-400" />
              Lanzar por nombre de paquete personalizado (Package Name):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ej: com.rockstargames.gtasa ó com.example.game"
                value={customPackage}
                onChange={e => setCustomPackage(e.target.value)}
                className="flex-1 bg-[#121212] border border-[#2d2d2d] rounded-sm px-3 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#252525] hover:bg-[#303030] text-gray-200 border border-[#383838] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Play className="w-3 h-3" />
                Ejecutar
              </button>
            </div>
          </form>

          {/* Recents list */}
          {recentPackages.length > 0 && (
            <div className="pt-2 text-[10px] font-mono text-gray-500 flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-500 shrink-0" />
              <span>Recientes:</span>
              <div className="flex flex-wrap gap-1.5">
                {recentPackages.map(pkg => (
                  <button
                    key={pkg}
                    onClick={() => handleLaunch({ name: pkg, packageName: pkg })}
                    className="hover:text-emerald-400 underline truncate max-w-[140px]"
                  >
                    {pkg}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#141414] border-t border-[#242424] text-[10px] text-gray-500 font-mono flex items-center justify-between">
          <span>Bridge: Android.launchApp(pkg)</span>
          <span className="text-gray-400">WindowManager Overlay activo</span>
        </div>
      </div>
    </div>
  );
};
