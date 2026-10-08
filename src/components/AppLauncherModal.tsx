import React, { useState, useEffect } from 'react';
import { InstalledApp } from '../types/gamepad';
import { nativeBridge } from '../utils/nativeBridge';
import { Play, Search, Smartphone, ExternalLink, X, Plus, Trash2, Check, RefreshCw, Sparkles, FolderPlus, HelpCircle } from 'lucide-react';

const INITIAL_APPS: InstalledApp[] = [
  {
    name: 'Parsec Remote Gaming',
    packageName: 'tv.parsec.client',
    category: 'streaming',
    icon: 'P',
    color: '#00d632',
    description: 'Streaming de PC a móvil a 60fps de baja latencia',
  },
  {
    name: 'Moonlight Game Streaming',
    packageName: 'com.limelight',
    category: 'streaming',
    icon: 'M',
    color: '#38bdf8',
    description: 'Cliente Sunshine / NVIDIA GameStream',
  },
  {
    name: 'Steam Link',
    packageName: 'com.valvesoftware.steamlink',
    category: 'streaming',
    icon: 'S',
    color: '#60a5fa',
    description: 'Transmisión de biblioteca Steam de PC',
  },
  {
    name: 'Xbox Game Pass / Cloud',
    packageName: 'com.gamepass',
    category: 'streaming',
    icon: 'X',
    color: '#107c10',
    description: 'Cloud gaming de consola Xbox',
  },
  {
    name: 'RetroArch Emulator',
    packageName: 'com.retroarch',
    category: 'emulator',
    icon: 'R',
    color: '#f59e0b',
    description: 'Frontend multiconsola para emuladores',
  },
  {
    name: 'PPSSPP PSP Emulator',
    packageName: 'org.ppsspp.ppsspp',
    category: 'emulator',
    icon: 'P',
    color: '#3b82f6',
    description: 'Emulador de PlayStation Portable para Android',
  },
];

// Popular games list for 1-click addition
const SUGGESTED_POPULAR_APPS = [
  { name: 'Genshin Impact', packageName: 'com.miHoYo.GenshinImpact', category: 'game' as const, color: '#ec4899' },
  { name: 'Minecraft', packageName: 'com.mojang.minecraftpe', category: 'game' as const, color: '#22c55e' },
  { name: 'Call of Duty: Mobile', packageName: 'com.activision.callofduty.shooter', category: 'game' as const, color: '#eab308' },
  { name: 'Free Fire', packageName: 'com.dts.freefireth', category: 'game' as const, color: '#f97316' },
  { name: 'PUBG Mobile', packageName: 'com.tencent.ig', category: 'game' as const, color: '#eab308' },
  { name: 'Roblox', packageName: 'com.roblox.client', category: 'game' as const, color: '#ef4444' },
  { name: 'AetherSX2 (PS2)', packageName: 'xyz.aethersx2.android', category: 'emulator' as const, color: '#8b5cf6' },
  { name: 'Dolphin Emulator', packageName: 'org.dolphinemu.dolphinemu', category: 'emulator' as const, color: '#06b6d4' },
  { name: 'GeForce NOW', packageName: 'com.nvidia.geforcenow', category: 'streaming' as const, color: '#76b900' },
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
  const [activeTab, setActiveTab] = useState<'my-apps' | 'add-manual' | 'catalog'>('my-apps');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for manual app addition
  const [formName, setFormName] = useState('');
  const [formPackage, setFormPackage] = useState('');
  const [formCategory, setFormCategory] = useState<'game' | 'streaming' | 'emulator' | 'remote'>('game');
  const [formColor, setFormColor] = useState('#00d632');

  // Apps state with persistent storage in localStorage
  const [appsList, setAppsList] = useState<InstalledApp[]>(() => {
    try {
      const saved = localStorage.getItem('parsec_overlay_saved_apps');
      return saved ? JSON.parse(saved) : INITIAL_APPS;
    } catch {
      return INITIAL_APPS;
    }
  });

  // Save to localStorage whenever apps change
  const saveApps = (newApps: InstalledApp[]) => {
    setAppsList(newApps);
    try {
      localStorage.setItem('parsec_overlay_saved_apps', JSON.stringify(newApps));
    } catch {
      // storage error
    }
  };

  // Launch application and maintain floating gamepad overlay
  const handleLaunch = (app: { name: string; packageName: string }) => {
    nativeBridge.launchApp(app.packageName, app.name);
    setNotification(`Iniciando ${app.name}... El mando permanecerá flotando sobre ella.`);

    onAppLaunched?.(app);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  // Add custom manual app
  const handleAddCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPackage.trim()) return;

    const cleanPkg = formPackage.trim().toLowerCase();
    const cleanName = formName.trim();

    // Check if exists
    if (appsList.some(a => a.packageName.toLowerCase() === cleanPkg)) {
      setNotification(`La aplicación "${cleanPkg}" ya está en tu lista.`);
      return;
    }

    const newApp: InstalledApp = {
      name: cleanName,
      packageName: cleanPkg,
      category: formCategory,
      icon: cleanName.charAt(0).toUpperCase() || 'A',
      color: formColor,
      description: `Agregada desde el celular [${cleanPkg}]`,
    };

    const updated = [newApp, ...appsList];
    saveApps(updated);

    setFormName('');
    setFormPackage('');
    setNotification(`✓ "${cleanName}" agregada con éxito a tus aplicaciones.`);
    setActiveTab('my-apps');
  };

  // Add suggested app
  const handleAddSuggested = (suggested: typeof SUGGESTED_POPULAR_APPS[0]) => {
    if (appsList.some(a => a.packageName.toLowerCase() === suggested.packageName.toLowerCase())) {
      setNotification(`"${suggested.name}" ya está en tu lista.`);
      return;
    }

    const newApp: InstalledApp = {
      name: suggested.name,
      packageName: suggested.packageName,
      category: suggested.category,
      icon: suggested.name.charAt(0).toUpperCase(),
      color: suggested.color,
      description: `Agregada desde catálogo [${suggested.packageName}]`,
    };

    saveApps([newApp, ...appsList]);
    setNotification(`✓ "${suggested.name}" añadida.`);
  };

  // Delete an app from the list
  const handleDeleteApp = (pkg: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = appsList.filter(a => a.packageName !== pkg);
    saveApps(updated);
    setNotification(`Aplicación eliminada de la lista.`);
  };

  // Scan device via Android bridge
  const handleScanDevice = () => {
    const nativeApps = nativeBridge.getInstalledApps();
    if (nativeApps && nativeApps.length > 0) {
      let addedCount = 0;
      const currentPkgs = new Set(appsList.map(a => a.packageName.toLowerCase()));
      const toAdd: InstalledApp[] = [];

      nativeApps.forEach(item => {
        if (!currentPkgs.has(item.packageName.toLowerCase())) {
          toAdd.push({
            name: item.name || item.packageName,
            packageName: item.packageName,
            category: 'game',
            icon: (item.name || item.packageName).charAt(0).toUpperCase(),
            color: '#38bdf8',
            description: 'Detectada en el dispositivo móvil',
          });
          addedCount++;
        }
      });

      if (toAdd.length > 0) {
        saveApps([...toAdd, ...appsList]);
        setNotification(`✓ Se detectaron e importaron ${addedCount} aplicaciones de tu celular.`);
      } else {
        setNotification(`No se encontraron aplicaciones nuevas para importar.`);
      }
    } else {
      setNotification(`En el navegador se muestra el simulador. En tu celular real importará todas las apps instaladas.`);
    }
  };

  if (!isOpen) return null;

  const filteredApps = appsList.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 select-none font-mono">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-[#2d2d2d] rounded-sm shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-gray-200 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#141414]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-100">
                Gestor de Apps y Juegos para Ejecutar con Overlay
              </h2>
              <p className="text-[11px] text-gray-400">
                Agrega cualquier aplicación de tu celular para que el mando flote por encima
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white bg-[#202020] border border-[#2e2e2e] rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#242424] bg-[#1a1a1a] text-xs">
          <button
            onClick={() => setActiveTab('my-apps')}
            className={`flex-1 py-2.5 px-3 font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'my-apps'
                ? 'border-emerald-500 bg-[#141414] text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mis Aplicaciones ({appsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add-manual')}
            className={`flex-1 py-2.5 px-3 font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'add-manual'
                ? 'border-emerald-500 bg-[#141414] text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 text-sky-400" />
            <span>+ Agregar Aplicación de Mi Celular</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-2.5 px-3 font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'catalog'
                ? 'border-emerald-500 bg-[#141414] text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Catálogo Rápido</span>
          </button>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="bg-[#102a14] border-b border-emerald-700/60 px-4 py-2 text-[11px] text-emerald-300 flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* TAB 1: MIS APLICACIONES */}
        {activeTab === 'my-apps' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Search & Scan row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar aplicación en tu lista..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2c2c2c] rounded-sm pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleScanDevice}
                className="px-3 py-1.5 bg-[#202020] hover:bg-[#282828] border border-[#353535] text-gray-200 hover:text-white rounded-sm flex items-center gap-1.5 shrink-0"
                title="Escanear aplicaciones instaladas en el dispositivo móvil"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Escanear Celular</span>
              </button>
            </div>

            {/* Apps Grid */}
            <div className="space-y-2 pt-1">
              {filteredApps.length === 0 ? (
                <div className="p-8 text-center text-gray-500 border border-dashed border-[#2d2d2d] rounded-sm">
                  No se encontraron aplicaciones. Agrega una desde la pestaña "+ Agregar Aplicación".
                </div>
              ) : (
                filteredApps.map(app => (
                  <div
                    key={app.packageName}
                    className="p-3 bg-[#191919] border border-[#282828] hover:border-[#383838] rounded-sm flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-sm flex items-center justify-center font-bold text-sm shrink-0 border"
                        style={{
                          backgroundColor: `${app.color}20`,
                          color: app.color,
                          borderColor: `${app.color}50`,
                        }}
                      >
                        {app.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-200 truncate flex items-center gap-2">
                          <span>{app.name}</span>
                          {app.packageName === 'tv.parsec.client' && (
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-700 px-1 py-0.2 rounded-sm font-bold">
                              PARSEC
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{app.packageName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleLaunch(app)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-sm flex items-center gap-1.5 shadow"
                        title={`Lanzar ${app.name} y activar overlay flotante encima`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Lanzar con Overlay</span>
                      </button>

                      {app.packageName !== 'tv.parsec.client' && (
                        <button
                          onClick={(e) => handleDeleteApp(app.packageName, e)}
                          className="p-1.5 bg-[#222222] hover:bg-red-950 text-gray-400 hover:text-red-300 border border-[#303030] hover:border-red-700 rounded-sm"
                          title="Eliminar de mi lista"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AGREGAR MANUALMENTE */}
        {activeTab === 'add-manual' && (
          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleAddCustomApp} className="space-y-4 bg-[#141414] p-4 border border-[#282828] rounded-sm">
              <div className="text-xs font-bold text-gray-200 uppercase flex items-center gap-2 border-b border-[#242424] pb-2">
                <FolderPlus className="w-4 h-4 text-emerald-400" />
                <span>Agregar Aplicación o Juego Instalado en tu Celular</span>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  1. Nombre Visible de la Aplicación:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Call of Duty Mobile, Minecraft, Genshin Impact..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#2d2d2d] rounded-sm px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1 flex items-center justify-between">
                  <span>2. Nombre de Paquete Android (Package Name):</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Exacto de Android</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: com.activision.callofduty.shooter ó com.mojang.minecraftpe"
                  value={formPackage}
                  onChange={e => setFormPackage(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#2d2d2d] rounded-sm px-3 py-2 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  * Puedes ver el nombre de paquete de cualquier app en la URL de Google Play Store o en Ajustes &gt; Aplicaciones.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Categoría:</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as typeof formCategory)}
                    className="w-full bg-[#1c1c1c] border border-[#2d2d2d] rounded-sm px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="game">Juego Nativo</option>
                    <option value="streaming">Streaming / Cloud</option>
                    <option value="emulator">Emulador</option>
                    <option value="remote">Control Remoto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Color de Distintivo:</label>
                  <div className="flex gap-2 items-center pt-1">
                    {['#00d632', '#38bdf8', '#eab308', '#ef4444', '#a855f7', '#f97316'].map(col => (
                      <button
                        type="button"
                        key={col}
                        onClick={() => setFormColor(col)}
                        style={{ backgroundColor: col }}
                        className={`w-6 h-6 rounded-sm border ${formColor === col ? 'border-white scale-110' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-sm flex items-center justify-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Aplicación en Mi Lista</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: CATÁLOGO RÁPIDO */}
        {activeTab === 'catalog' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-[11px] text-gray-400">
              Toca <strong>"+ Agregar"</strong> para añadir los juegos móviles y emuladores más populares directamente a tu lanzador:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_POPULAR_APPS.map(item => {
                const isAlreadyAdded = appsList.some(a => a.packageName.toLowerCase() === item.packageName.toLowerCase());
                return (
                  <div
                    key={item.packageName}
                    className="p-2.5 bg-[#171717] border border-[#292929] rounded-sm flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-200 truncate">{item.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{item.packageName}</div>
                    </div>

                    <button
                      disabled={isAlreadyAdded}
                      onClick={() => handleAddSuggested(item)}
                      className={`px-2.5 py-1 rounded-sm text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                        isAlreadyAdded
                          ? 'bg-[#222222] text-gray-500 border border-[#303030]'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isAlreadyAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{isAlreadyAdded ? 'Agregada' : 'Agregar'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#141414] border-t border-[#242424] text-[10px] text-gray-500 flex items-center justify-between">
          <span>Bridge: Android.launchApp(packageName)</span>
          <span className="text-emerald-400">Mantiene el overlay flotante activo sobre la app externa</span>
        </div>
      </div>
    </div>
  );
};
