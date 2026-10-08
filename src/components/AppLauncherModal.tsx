import React, { useState, useEffect } from 'react';
import { InstalledApp } from '../types/gamepad';
import { nativeBridge } from '../utils/nativeBridge';
import { Play, Search, Smartphone, ExternalLink, X, Plus, Trash2, Check, Sparkles, FolderPlus, HelpCircle, Gamepad2, Info, Share2, Layers } from 'lucide-react';

const INITIAL_APPS: InstalledApp[] = [
  {
    name: 'Parsec Remote Gaming',
    packageName: 'tv.parsec.client',
    category: 'streaming',
    icon: '🎮',
    color: '#00d632',
    description: 'Streaming de PC a móvil a 60fps de ultra-baja latencia',
    isCustom: false,
  },
  {
    name: 'Moonlight Game Streaming',
    packageName: 'com.limelight',
    category: 'streaming',
    icon: '🌙',
    color: '#38bdf8',
    description: 'Cliente Sunshine y NVIDIA GameStream',
    isCustom: false,
  },
  {
    name: 'Steam Link',
    packageName: 'com.valvesoftware.steamlink',
    category: 'streaming',
    icon: '💨',
    color: '#60a5fa',
    description: 'Transmisión de biblioteca de Steam de PC',
    isCustom: false,
  },
  {
    name: 'Xbox Game Pass / Cloud',
    packageName: 'com.gamepass',
    category: 'streaming',
    icon: '💚',
    color: '#107c10',
    description: 'Cloud gaming de consola Xbox en el móvil',
    isCustom: false,
  },
  {
    name: 'Free Fire',
    packageName: 'com.dts.freefireth',
    category: 'game',
    icon: '🔥',
    color: '#f97316',
    description: 'Battle Royale popular para celular',
    isCustom: false,
  },
  {
    name: 'Call of Duty: Mobile',
    packageName: 'com.activision.callofduty.shooter',
    category: 'game',
    icon: '🔫',
    color: '#eab308',
    description: 'Shooter multijugador táctico',
    isCustom: false,
  },
  {
    name: 'Minecraft Bedrock',
    packageName: 'com.mojang.minecraftpe',
    category: 'game',
    icon: '⛏️',
    color: '#22c55e',
    description: 'Juego de construcción y supervivencia',
    isCustom: false,
  },
  {
    name: 'Roblox',
    packageName: 'com.roblox.client',
    category: 'game',
    icon: '🧱',
    color: '#ef4444',
    description: 'Plataforma de juegos comunitarios',
    isCustom: false,
  },
  {
    name: 'PPSSPP Emulador PSP',
    packageName: 'org.ppsspp.ppsspp',
    category: 'emulator',
    icon: '🕹️',
    color: '#3b82f6',
    description: 'Emulador de PlayStation Portable para Android',
    isCustom: false,
  },
  {
    name: 'RetroArch Multiconsola',
    packageName: 'com.retroarch',
    category: 'emulator',
    icon: '👾',
    color: '#f59e0b',
    description: 'Frontend multiconsola para emuladores',
    isCustom: false,
  },
];

// Quick suggestions catalog for 1-click addition
const SUGGESTED_POPULAR_APPS = [
  { name: 'Genshin Impact', packageName: 'com.miHoYo.GenshinImpact', category: 'game' as const, icon: '⚔️', color: '#ec4899', description: 'RPG de acción y mundo abierto' },
  { name: 'Brawl Stars', packageName: 'com.supercell.brawlstars', category: 'game' as const, icon: '⭐', color: '#fbbf24', description: 'Combates 3v3 y Supervivencia' },
  { name: 'PUBG Mobile', packageName: 'com.tencent.ig', category: 'game' as const, icon: '🪖', color: '#eab308', description: 'Battle Royale táctico para móvil' },
  { name: 'AetherSX2 (PS2)', packageName: 'xyz.aethersx2.android', category: 'emulator' as const, icon: '💿', color: '#8b5cf6', description: 'Emulador PlayStation 2 en Android' },
  { name: 'Dolphin Emulator (GameCube/Wii)', packageName: 'org.dolphinemu.dolphinemu', category: 'emulator' as const, icon: '🐬', color: '#06b6d4', description: 'Emulador GameCube y Wii' },
  { name: 'GeForce NOW', packageName: 'com.nvidia.geforcenow', category: 'streaming' as const, icon: '⚡', color: '#76b900', description: 'NVIDIA Cloud Gaming' },
  { name: 'PlayStation Remote Play', packageName: 'com.playstation.remoteplay', category: 'streaming' as const, icon: '🔷', color: '#2563eb', description: 'Juega tu PS4/PS5 de forma remota' },
  { name: 'Asphalt 9: Legends', packageName: 'com.gameloft.android.ANMP.GloftA9HM', category: 'game' as const, icon: '🏎️', color: '#dc2626', description: 'Carreras arcade de alta velocidad' },
  { name: 'EA SPORTS FC Mobile', packageName: 'com.ea.gp.fifamobile', category: 'game' as const, icon: '⚽', color: '#16a34a', description: 'Fútbol FIFA en celular' },
];

const EMOJI_OPTIONS = ['🎮', '🔥', '🔫', '⚔️', '⛏️', '🏎️', '⚽', '🕹️', '👾', '🚀', '⚡', '🏆', '🎯', '🧱', '⭐', '💎'];
const COLOR_OPTIONS = ['#00d632', '#38bdf8', '#f97316', '#eab308', '#ef4444', '#a855f7', '#ec4899', '#14b8a6', '#64748b'];

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
  const [activeTab, setActiveTab] = useState<'my-apps' | 'add-manual' | 'catalog' | 'overlay-guide'>('my-apps');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for manual app addition
  const [formName, setFormName] = useState('');
  const [formPackage, setFormPackage] = useState('');
  const [formCustomUrl, setFormCustomUrl] = useState('');
  const [formCategory, setFormCategory] = useState<'game' | 'streaming' | 'emulator' | 'remote' | 'custom'>('game');
  const [formIcon, setFormIcon] = useState('🎮');
  const [formColor, setFormColor] = useState('#00d632');
  const [formDescription, setFormDescription] = useState('');

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
  const handleLaunch = (app: InstalledApp) => {
    nativeBridge.launchApp(app.packageName, app.name);
    setNotification(`Iniciando ${app.name}... Mando listo para controlar.`);

    onAppLaunched?.(app);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  // Add custom manual app
  const handleAddCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPackage.trim()) {
      setNotification('Por favor ingresa al menos el Nombre y el Nombre de Paquete de la app.');
      return;
    }

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
      icon: formIcon,
      color: formColor,
      description: formDescription.trim() || 'Aplicación personalizada agregada desde mi celular',
      customUrl: formCustomUrl.trim() || undefined,
      isCustom: true,
      dateAdded: Date.now(),
    };

    const updated = [newApp, ...appsList];
    saveApps(updated);

    // Reset form
    setFormName('');
    setFormPackage('');
    setFormCustomUrl('');
    setFormDescription('');
    setNotification(`¡"${cleanName}" agregada con éxito a tus aplicaciones!`);
    setActiveTab('my-apps');
  };

  // Add 1-click suggested app
  const handleAddSuggested = (suggested: typeof SUGGESTED_POPULAR_APPS[0]) => {
    if (appsList.some(a => a.packageName.toLowerCase() === suggested.packageName.toLowerCase())) {
      setNotification(`"${suggested.name}" ya está en tu lista.`);
      return;
    }

    const newApp: InstalledApp = {
      name: suggested.name,
      packageName: suggested.packageName,
      category: suggested.category,
      icon: suggested.icon,
      color: suggested.color,
      description: suggested.description,
      isCustom: true,
      dateAdded: Date.now(),
    };

    saveApps([newApp, ...appsList]);
    setNotification(`"${suggested.name}" agregada a Mis Aplicaciones.`);
  };

  // Delete app
  const handleDeleteApp = (packageName: string, appName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = appsList.filter(a => a.packageName !== packageName);
    saveApps(updated);
    setNotification(`Se eliminó "${appName}" de la lista.`);
  };

  // Reset to default apps
  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restaurar la lista de aplicaciones por defecto?')) {
      saveApps(INITIAL_APPS);
      setNotification('Lista de aplicaciones restaurada.');
    }
  };

  // Filter apps
  const filteredApps = appsList.filter(app => {
    const query = searchTerm.toLowerCase();
    return app.name.toLowerCase().includes(query) ||
           app.packageName.toLowerCase().includes(query) ||
           app.category.toLowerCase().includes(query);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-[#303030] rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-gray-200 font-mono text-xs">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#282828] bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-600/60 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-100 flex items-center gap-2">
                <span>Apps de Mi Celular & Lanzador</span>
                <span className="text-[10px] bg-[#242424] text-emerald-400 px-1.5 py-0.2 rounded border border-[#363636]">
                  {appsList.length} Apps
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                Agrega juegos y apps de tu celular para ejecutarlos con el mando overlay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white bg-[#222222] border border-[#333333] rounded hover:bg-[#2c2c2c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NOTIFICATION BANNER */}
        {notification && (
          <div className="bg-emerald-950/80 border-b border-emerald-600/70 px-4 py-2 text-emerald-300 text-[11px] flex items-center justify-between animate-in fade-in">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-emerald-400 font-bold ml-2">✕</button>
          </div>
        )}

        {/* TABS BAR */}
        <div className="flex items-center border-b border-[#262626] bg-[#161616] px-3 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('my-apps')}
            className={`px-3 py-1.5 text-xs font-bold rounded-t transition-colors flex items-center gap-1.5 ${
              activeTab === 'my-apps'
                ? 'bg-[#202020] text-emerald-400 border-t-2 border-emerald-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Mis Aplicaciones ({appsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-manual')}
            className={`px-3 py-1.5 text-xs font-bold rounded-t transition-colors flex items-center gap-1.5 ${
              activeTab === 'add-manual'
                ? 'bg-[#202020] text-emerald-400 border-t-2 border-emerald-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">+ Agregar App de mi Celular</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 text-xs font-bold rounded-t transition-colors flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#202020] text-emerald-400 border-t-2 border-emerald-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Catálogo Rápido (1 Clic)</span>
          </button>

          <button
            onClick={() => setActiveTab('overlay-guide')}
            className={`px-3 py-1.5 text-xs font-bold rounded-t transition-colors flex items-center gap-1.5 ${
              activeTab === 'overlay-guide'
                ? 'bg-[#202020] text-sky-400 border-t-2 border-sky-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>¿Cómo usar el Overlay?</span>
          </button>
        </div>

        {/* TAB 1: MIS APLICACIONES */}
        {activeTab === 'my-apps' && (
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre, paquete (ej: parsec, minecraft, freefire)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121212] border border-[#2e2e2e] focus:border-emerald-500 rounded pl-9 pr-3 py-2 text-xs text-gray-200 outline-none placeholder:text-gray-600"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Apps Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredApps.length === 0 ? (
                <div className="p-8 text-center text-gray-500 border border-dashed border-[#2d2d2d] rounded">
                  <p className="mb-2">No se encontraron aplicaciones con "{searchTerm}"</p>
                  <button
                    onClick={() => setActiveTab('add-manual')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded text-xs"
                  >
                    + Agregar "{searchTerm}" como nueva app
                  </button>
                </div>
              ) : (
                filteredApps.map((app) => (
                  <div
                    key={app.packageName}
                    onClick={() => handleLaunch(app)}
                    className="p-3 bg-[#1e1e1e] hover:bg-[#252525] border border-[#2e2e2e] hover:border-emerald-500/80 rounded transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* App Icon */}
                      <div
                        style={{ backgroundColor: `${app.color}25`, borderColor: app.color }}
                        className="w-10 h-10 rounded border flex items-center justify-center font-bold text-lg shrink-0 shadow-sm"
                      >
                        {app.icon}
                      </div>

                      {/* App Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-100 group-hover:text-emerald-400 transition-colors truncate">
                            {app.name}
                          </span>
                          {app.isCustom && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-[#2d2d2d] text-emerald-400 rounded border border-[#3e3e3e]">
                              Agregada por ti
                            </span>
                          )}
                          <span className="text-[9px] uppercase px-1 py-0.2 bg-[#171717] text-gray-400 rounded">
                            {app.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5">
                          {app.description}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono truncate">
                          pkg: {app.packageName}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunch(app);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Ejecutar</span>
                      </button>

                      <button
                        onClick={(e) => handleDeleteApp(app.packageName, app.name, e)}
                        className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-950/40 rounded border border-transparent hover:border-rose-800 transition-colors"
                        title="Eliminar de mi lista"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#262626] mt-2 text-gray-500 text-[11px]">
              <button
                onClick={() => setActiveTab('add-manual')}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar otra app de mi celular</span>
              </button>

              <button
                onClick={handleResetDefaults}
                className="hover:text-gray-300 text-gray-600 transition-colors"
              >
                Restaurar lista por defecto
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AGREGAR APP DE MI CELULAR (FORMULARIO MANUAL) */}
        {activeTab === 'add-manual' && (
          <form onSubmit={handleAddCustomApp} className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-[#1b271d] border border-emerald-600/50 p-3 rounded text-emerald-300 text-[11px]">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>¿Cómo agregar una app de tu celular?</span>
              </div>
              <p className="text-gray-300">
                Solo escribe el <strong>Nombre de la app</strong> y su <strong>Package Name de Android</strong> (ejemplo: <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-400">com.dts.freefireth</code> para Free Fire, o <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-400">tv.parsec.client</code> para Parsec).
              </p>
            </div>

            {/* App Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                Nombre de la Aplicación *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Free Fire, Parsec, Roblox, Minecraft, Emulador..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-[#121212] border border-[#303030] focus:border-emerald-500 rounded px-3 py-2 text-xs text-gray-200 outline-none"
              />
            </div>

            {/* Package Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                Package Name de Android (Nombre del Paquete) *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: com.dts.freefireth, tv.parsec.client, com.mojang.minecraftpe"
                value={formPackage}
                onChange={(e) => setFormPackage(e.target.value)}
                className="w-full bg-[#121212] border border-[#303030] focus:border-emerald-500 rounded px-3 py-2 text-xs text-gray-200 font-mono outline-none"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Tip: Es el identificador que aparece en la URL de Google Play (después de ?id=) o en Información de la app en Ajustes de tu celular.
              </span>
            </div>

            {/* Icon & Color Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Icono / Emoji
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-[#121212] border border-[#303030] rounded">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setFormIcon(emoji)}
                      className={`w-7 h-7 rounded text-base flex items-center justify-center transition-transform ${
                        formIcon === emoji ? 'bg-emerald-600 scale-110 shadow' : 'bg-[#202020] hover:bg-[#282828]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Color de Acento
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-[#121212] border border-[#303030] rounded items-center">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        formColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Category & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Categoría
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-[#121212] border border-[#303030] rounded px-3 py-2 text-xs text-gray-200 outline-none"
                >
                  <option value="game">🎮 Videojuego Móvil</option>
                  <option value="streaming">📡 Streaming / Parsec / Cloud</option>
                  <option value="emulator">🕹️ Emulador de Consola</option>
                  <option value="remote">💻 Control Remoto / PC</option>
                  <option value="custom">⚡ Otra Aplicación</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Descripción Corta (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juego favorito para mando"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#121212] border border-[#303030] focus:border-emerald-500 rounded px-3 py-2 text-xs text-gray-200 outline-none"
                />
              </div>
            </div>

            {/* Custom URL (Optional) */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                URL Web o Intent Deep-Link (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: https://xbox.com/play o intent://..."
                value={formCustomUrl}
                onChange={(e) => setFormCustomUrl(e.target.value)}
                className="w-full bg-[#121212] border border-[#303030] focus:border-emerald-500 rounded px-3 py-2 text-xs text-gray-200 font-mono outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('my-apps')}
                className="px-3 py-2 bg-[#242424] hover:bg-[#2c2c2c] text-gray-300 rounded font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Guardar App en Mi Celular</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CATÁLOGO RÁPIDO SUGERIDO */}
        {activeTab === 'catalog' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-gray-400 text-[11px] mb-2">
              Toca <strong>"+ Agregar"</strong> en cualquier juego o servicio para incorporarlo al instante a tus aplicaciones:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_POPULAR_APPS.map((item) => {
                const isAlreadyAdded = appsList.some(a => a.packageName.toLowerCase() === item.packageName.toLowerCase());
                return (
                  <div
                    key={item.packageName}
                    className="p-3 bg-[#1c1c1c] border border-[#2b2b2b] rounded flex items-center justify-between gap-3 hover:border-[#3d3d3d] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        style={{ backgroundColor: `${item.color}25`, borderColor: item.color }}
                        className="w-8 h-8 rounded border flex items-center justify-center text-sm shrink-0"
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-200 text-xs truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">{item.description}</div>
                        <div className="text-[9px] text-gray-600 font-mono truncate">{item.packageName}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddSuggested(item)}
                      disabled={isAlreadyAdded}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold shrink-0 transition-colors ${
                        isAlreadyAdded
                          ? 'bg-[#252525] text-emerald-400 border border-emerald-900/60 cursor-default'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow'
                      }`}
                    >
                      {isAlreadyAdded ? '✓ Agregada' : '+ Agregar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: GUÍA DE OVERLAY SOBRE APPS EXTERNAS */}
        {activeTab === 'overlay-guide' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-gray-300 text-xs">
            <div className="bg-[#121924] border border-sky-600/50 p-3.5 rounded">
              <h3 className="font-bold text-sky-400 text-sm mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Cómo usar el Mando Flotante sobre Juegos y Apps en tu Celular</span>
              </h3>
              <p className="text-gray-300 text-[11px]">
                En Android hay dos métodos excelentes y 100% nativos para tener el mando flotando sobre cualquier aplicación externa:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#1e1e1e] border border-[#2e2e2e] rounded">
                <div className="font-bold text-emerald-400 flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded bg-emerald-900 border border-emerald-600 flex items-center justify-center text-xs">1</span>
                  <span>Modo Ventana Flotante / Ventana Emergente (Pop-up View)</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  En tu celular Android (Samsung, Xiaomi, Motorola, Realme, Pixel):
                  Abre las aplicaciones recientes, mantén pulsado el icono del navegador con esta Web App y selecciona <strong>"Abrir en vista emergente"</strong> o <strong>"Ventana flotante"</strong>. Ajusta la transparencia con el deslizador y muévela libremente sobre tu juego o Parsec.
                </p>
              </div>

              <div className="p-3 bg-[#1e1e1e] border border-[#2e2e2e] rounded">
                <div className="font-bold text-emerald-400 flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded bg-emerald-900 border border-emerald-600 flex items-center justify-center text-xs">2</span>
                  <span>Modo Pantalla Dividida (Split Screen en Android)</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Divide la pantalla de tu móvil en dos: coloca tu juego externo (Parsec, emulador o shooter) en la mitad superior y el mando de esta Web App en la mitad inferior.
                </p>
              </div>

              <div className="p-3 bg-[#1e1e1e] border border-[#2e2e2e] rounded">
                <div className="font-bold text-sky-400 flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded bg-sky-900 border border-sky-600 flex items-center justify-center text-xs">3</span>
                  <span>Instalar como Web App / PWA en tu pantalla de inicio</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  En el menú de Chrome de tu celular (los 3 puntos arriba a la derecha), toca <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla de inicio"</strong>. Se abrirá a pantalla completa sin la barra del navegador, lista para jugar.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
