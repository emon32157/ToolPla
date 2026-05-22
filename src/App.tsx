import React, { useState, useEffect, useRef, FormEvent } from 'react';
import JSZip from 'jszip';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  FileCode, 
  FolderOpen, 
  Download, 
  Play, 
  ShieldAlert, 
  CheckCircle, 
  Database, 
  Settings, 
  Import, 
  Send, 
  Copy, 
  RefreshCw, 
  Layers, 
  Eye, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  FileText, 
  ChevronRight, 
  Menu, 
  HelpCircle, 
  Code2, 
  AlertCircle,
  FileCode2,
  Globe,
  Settings2,
  Activity,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_PLUGIN_FILES, PluginFile } from './plugin-files';
import { INITIAL_TOOLS, WPTool } from './initial-tools';

export default function App() {
  // Navigation Screens: 'code' (Workspace plugin files explorer) or 'wp-admin' (WordPress Dashboard simulator)
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'code' | 'wp-admin'>('wp-admin');
  
  // File Tree State inside Code Inspector
  const [pluginFiles, setPluginFiles] = useState<PluginFile[]>(DEFAULT_PLUGIN_FILES);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('pro-tool-hub.php');
  const [editorCode, setEditorCode] = useState<string>('');
  const [searchFileQuery, setSearchFileQuery] = useState<string>('');
  const [isCopyingCode, setIsCopyingCode] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // WordPress Simulator States
  const [wpMenu, setWpMenu] = useState<'dashboard' | 'tools' | 'groups' | 'settings' | 'importer' | 'sandbox'>('dashboard');
  const [tools, setTools] = useState<WPTool[]>(INITIAL_TOOLS);
  const [selectedToolId, setSelectedToolId] = useState<number>(1);
  const [editingTool, setEditingTool] = useState<WPTool | null>(null);
  const [isCreatingNewTool, setIsCreatingNewTool] = useState<boolean>(false);

  // WP Taxonomy (Tool Groups)
  const [groups, setGroups] = useState<string[]>(['Mathematics', 'Text Utilities', 'Security', 'Graphics', 'Analytics']);
  const [newGroupName, setNewGroupName] = useState<string>('');

  // WP Global Settings Form
  const [globalCSS, setGlobalCSS] = useState<string>(
    `/* Global CSS rule variables matching WordPress primary wrapper */\n.pro-tool-hub-container {\n  border: 1px solid #cbd5e1;\n  background: #fdfdfd;\n  padding: 16px;\n  border-radius: 8px;\n}`
  );
  const [footerCopyright, setFooterCopyright] = useState<string>('Powered securely by Pro Tool Hub');
  const [analyticsActive, setAnalyticsActive] = useState<boolean>(true);

  // JSON Importer / Exporter State values
  const [importFeedback, setImportFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [importJsonRaw, setImportJsonRaw] = useState<string>('');

  // Custom Preview Terminal Log state
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['System Sandbox initialization completed.']);

  // Sync editor typed parameters when selected file swaps
  useEffect(() => {
    const file = pluginFiles.find(f => f.path === selectedFilePath);
    if (file) {
      setEditorCode(file.content);
    }
  }, [selectedFilePath, pluginFiles]);

  // Synchronize changes inside the editable code-area back to the file array
  const handleEditorChange = (val: string) => {
    setEditorCode(val);
    setPluginFiles(prev => prev.map(f => {
      if (f.path === selectedFilePath) {
        return { ...f, content: val };
      }
      return f;
    }));
  };

  // Copy code utility helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorCode);
    setIsCopyingCode(true);
    setTimeout(() => setIsCopyingCode(false), 2000);
  };

  // Reset file content back to original WordPress PSR-12 defaults
  const handleResetFile = () => {
    const original = DEFAULT_PLUGIN_FILES.find(f => f.path === selectedFilePath);
    if (original) {
      handleEditorChange(original.content);
    }
  };

  // Package all files as zip and trigger browser clean download
  const handleZipDownload = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      // Seed files recursive
      pluginFiles.forEach(file => {
        zip.file(`pro-tool-hub/${file.path}`, file.content);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const anchor = document.createElement('a');
      anchor.id = "pth-zip-anchor";
      anchor.href = downloadUrl;
      anchor.download = 'pro-tool-hub.zip';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  // Triggered when a frontend tool is previewed (increments analytics impressions daily views)
  const trackToolView = (toolId: number) => {
    if (!analyticsActive) return;
    
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        const today = '2026-05-22'; // Tracked static current date from metadata
        const updatedDaily = { ...t.dailyViews };
        updatedDaily[today] = (updatedDaily[today] || 0) + 1;
        return {
          ...t,
          views: t.views + 1,
          dailyViews: updatedDaily
        };
      }
      return t;
    }));
  };

  // Admin resets analytics values
  const handleResetWpAnalytics = () => {
    if (window.confirm('Are you sure you want to permanently clear all views metrics reports?')) {
      setTools(prev => prev.map(t => ({
        ...t,
        views: 0,
        dailyViews: {}
      })));
    }
  };

  // CPT Tool creations / updates
  const handleSaveToolsCPT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;

    if (isCreatingNewTool) {
      const nextId = tools.length > 0 ? Math.max(...tools.map(t => t.id)) + 1 : 1;
      const completeNewTool: WPTool = {
        ...editingTool,
        id: nextId,
        views: 0,
        dailyViews: {}
      };
      setTools(prev => [...prev, completeNewTool]);
      setSelectedToolId(nextId);
    } else {
      setTools(prev => prev.map(t => (t.id === editingTool.id ? editingTool : t)));
    }

    setEditingTool(null);
    setIsCreatingNewTool(false);
    setWpMenu('tools');
  };

  // Delete dynamic shortcode tool
  const handleDeleteTool = (id: number) => {
    if (window.confirm('Delete this custom shortcode tool from WordPress CPT catalog database?')) {
      setTools(prev => prev.filter(t => t.id !== id));
      if (selectedToolId === id && tools.length > 1) {
        setSelectedToolId(tools[0].id);
      }
    }
  };

  // Tool Groups creations tags
  const handleAddGroupTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim() && !groups.includes(newGroupName.trim())) {
      setGroups(prev => [...prev, newGroupName.trim()]);
      setNewGroupName('');
    }
  };

  // JSON schema exporter
  const triggerToolsJsonExport = () => {
    const rawData = JSON.stringify(tools, null, 2);
    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.id = "pth-json-anchor";
    anchor.href = url;
    anchor.download = `pro-tools-export-2026-05-22.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  // JSON schema importer
  const handleExecuteImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonRaw);
      if (Array.isArray(parsed)) {
        // Validate keys
        const isValid = parsed.every(p => p.title && p.html !== undefined);
        if (isValid) {
          const formattedImport: WPTool[] = parsed.map((item, index) => {
            const nextId = tools.length > 0 ? Math.max(...tools.map(t => t.id)) + 1 + index : 1 + index;
            return {
              id: item.id || nextId,
              slug: item.slug || `custom-tool-${nextId}`,
              title: item.title,
              excerpt: item.excerpt || 'Imported tool layout',
              content: item.content || 'Imported customized utility container.',
              group: item.group || 'Mathematics',
              status: item.status || 'Published',
              html: item.html || '',
              css: item.css || '',
              js: item.js || '',
              seoTitle: item.seoTitle || item.title,
              seoDesc: item.seoDesc || 'SEO optimized descriptions',
              seoOgImg: item.seoOgImg || '',
              views: item.views || 0,
              dailyViews: item.dailyViews || {}
            };
          });
          
          setTools(prev => [...prev, ...formattedImport]);
          setImportFeedback({ type: 'success', text: `Successfully compiled state! Registered ${formattedImport.length} tools into directory.` });
          setImportJsonRaw('');
        } else {
          setImportFeedback({ type: 'error', text: 'Error: Imported JSON array is missing title or HTML tags core parameters.' });
        }
      } else {
        setImportFeedback({ type: 'error', text: 'Error: Import config schema must be a valid JSON array format.' });
      }
    } catch (err) {
      setImportFeedback({ type: 'error', text: 'Error: Failed to parse string. Corrupted JSON architecture.' });
    }
  };

  // Compile Chart data for Daily Traffic line chart
  const getDailyTrafficChartData = () => {
    // Generate dates span for the last 7 days leading to 2026-05-22 static current date
    const dates = ['2026-05-16', '2026-05-17', '2026-05-18', '2026-05-19', '2026-05-20', '2026-05-21', '2026-05-22'];
    
    return dates.map(date => {
      let viewsCount = 0;
      tools.forEach(t => {
        viewsCount += t.dailyViews[date] || 0;
      });
      // Short format month/day for visual balance
      const formattedDate = date.split('-').slice(1).join('/');
      return {
        date: formattedDate,
        Views: viewsCount
      };
    });
  };

  // Compile Doughnut Chart values
  const getToolBreakdownChartData = () => {
    return tools.map(t => ({
      name: t.title,
      value: t.views
    })).filter(t => t.value > 0);
  };

  const COLORS_ARRAY = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];

  // Current selected tool details for frontend simulator rendering
  const activeInteractiveTool = tools.find(t => t.id === selectedToolId) || tools[0];

  // Live Iframe builder mapping compiled source markup, CSS scoped values, dynamic footer context overrides
  const iframeContent = activeInteractiveTool 
    ? `<!DOCTYPE html>
       <html>
         <head>
           <meta charset="utf-8">
           <meta name="viewport" content="width=device-width, initial-scale=1">
           <style>
             body {
               font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
               margin: 0;
               padding: 16px;
               color: #1e293b;
               background-color: #f8fafc;
             }
             .pro-tool-hub-container {
               width: 100%;
               margin: 1rem 0;
               box-sizing: border-box;
             }
             ${globalCSS}
             ${activeInteractiveTool.css}
           </style>
           <script>
             // Sandbox iframe safe console catcher inside preview
             const customLogger = (msg) => {
               window.parent.postMessage({ type: 'PTH_TERMINAL_LOG', text: msg }, '*');
             };
             window.console.log = customLogger;
           </script>
         </head>
         <body>
           <div id="pth-container" class="pro-tool-hub-container">
             ${activeInteractiveTool.html}
           </div>
           ${footerCopyright ? `<div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center;">${footerCopyright}</div>` : ''}
           
           <script>
             (function() {
               try {
                 const container = document.getElementById("pth-container");
                 if (container) {
                   // Bind variable reference securely before running code
                   ${activeInteractiveTool.js}
                 }
               } catch(err) {
                 window.parent.postMessage({ type: 'PTH_TERMINAL_LOG', text: "Error: " + err.message }, '*');
               }
             })();
           </script>
         </body>
       </html>`
    : '';

  // Listen to message frames coming out of iframe container terminal console
  useEffect(() => {
    const handleLogsCatcher = (e: MessageEvent) => {
      if (e.data && e.data.type === 'PTH_TERMINAL_LOG') {
        setConsoleLogs(prev => [...prev.slice(-30), `[CONSOLE] ${e.data.text}`]);
      }
    };
    window.addEventListener('message', handleLogsCatcher);
    return () => window.removeEventListener('message', handleLogsCatcher);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans" id="pro-tool-hub-app">
      
      {/* Dynamic Header Toolbar area */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-lg font-black tracking-tighter text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-mono">PTH</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Pro Tool Hub Studio <span className="text-xs bg-blue-600/15 text-blue-400 font-mono px-2 py-0.5 rounded-full border border-blue-500/25">v1.0.0</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Professional WordPress Plugin Builder & Interaction Sandbox</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Selector Tabs */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex">
            <button 
              id="pth-tab-trigger-wp"
              className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${activeWorkspaceTab === 'wp-admin' ? 'bg-slate-800 text-white shadow-sm shadow-black/20' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setActiveWorkspaceTab('wp-admin')}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              WP Admin Simulator
            </button>
            <button 
              id="pth-tab-trigger-code"
              className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${activeWorkspaceTab === 'code' ? 'bg-slate-800 text-white shadow-sm shadow-black/20' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setActiveWorkspaceTab('code')}
            >
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              Plugin Files Explorer
            </button>
          </div>

          <button 
            id="pth-download-zip-btn"
            onClick={handleZipDownload}
            disabled={isZipping}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/15"
          >
            {isZipping ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Bundling...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Download Plugin .zip
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container workspace */}
      <main className="flex-1 overflow-hidden relative flex">
        
        {/* VIEW 1: PLUGIN FILES CODE DETAILED INSPECTOR */}
        {activeWorkspaceTab === 'code' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden" id="pth-code-view">
            
            {/* Folder layout tree */}
            <div className="w-full md:w-80 bg-slate-950/80 border-r border-slate-800 flex flex-col shrink-0 h-1/3 md:h-full overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-blue-400" />
                  Plugin Folder Layout
                </span>
                <input 
                  type="text" 
                  placeholder="Filter PHP/CSS files..." 
                  value={searchFileQuery}
                  onChange={(e) => setSearchFileQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:outline-none focus:border-blue-500/50 rounded-md py-1.5 px-3 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {/* Simulated wp root directory visual block */}
                <div className="p-2 text-slate-500 text-xs font-semibold flex items-center gap-2 border-b border-slate-900 pb-1.5 mb-1.5">
                  wp-content / plugins / pro-tool-hub /
                </div>

                {pluginFiles
                  .filter(f => f.path.toLowerCase().includes(searchFileQuery.toLowerCase()))
                  .map(file => {
                    const isSelected = selectedFilePath === file.path;
                    const isFolderFile = file.path.includes('/');
                    const parts = file.path.split('/');
                    const fileName = parts[parts.length - 1];
                    const folderName = parts.slice(0, -1).join('/');

                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFilePath(file.path)}
                        className={`w-full text-left p-2 rounded-md transition-all text-xs flex items-center justify-between ${isSelected ? 'bg-slate-800 border-l-2 border-blue-500 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className={`w-3.5 h-3.5 ${file.language === 'php' ? 'text-blue-400' : file.language === 'css' ? 'text-pink-400' : 'text-amber-400'}`} />
                          <div className="truncate text-left">
                            <span className="font-mono text-[11px]">{fileName}</span>
                            {isFolderFile && (
                              <div className="text-[9px] text-slate-500 truncate mt-0.5">↳ in {folderName}/</div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className={`w-3 h-3 text-slate-600 ${isSelected ? 'text-blue-400' : ''}`} />
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Editable Code screen */}
            <div className="flex-1 flex flex-col h-2/3 md:h-full overflow-hidden bg-slate-900">
              {/* Selected File properties header panel */}
              {(() => {
                const f = pluginFiles.find(file => file.path === selectedFilePath);
                if (!f) return null;
                return (
                  <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col gap-2 shrink-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">File Directory Path</div>
                        <h2 className="text-sm font-mono font-bold text-blue-400 flex items-center gap-2 mt-0.5">
                          /pro-tool-hub/{f.path}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleResetFile}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 active:scale-95 text-[10px] font-semibold px-3 py-1.5 rounded-md border border-slate-800 flex items-center gap-1.5 transition-all"
                          title="Reset to default source code file"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Restore Defaults
                        </button>
                        <button 
                          onClick={handleCopyCode}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 active:scale-95 text-[10px] font-semibold px-3 py-1.5 rounded-md border border-slate-800 flex items-center gap-1.5 transition-all"
                        >
                          {isCopyingCode ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-blue-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Code
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-md border border-slate-900 leading-normal">
                      <strong>Hook details:</strong> {f.description}
                    </p>
                  </div>
                );
              })()}

              <div className="flex-1 flex overflow-hidden min-h-0 relative">
                {/* Editable Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 text-[10px] text-slate-500 uppercase tracking-wider shrink-0 border-b border-slate-900">
                    <span>Syntax: {selectedFilePath.endsWith('.php') ? 'PHP 8.x + WordPress API Context' : selectedFilePath.endsWith('.js') ? 'JavaScript ES6' : 'CSS Variables'}</span>
                    <span>Editing Unlocked</span>
                  </div>
                  <textarea
                    id="pth-active-editor"
                    value={editorCode}
                    onChange={(e) => handleEditorChange(e.target.value)}
                    className="flex-1 w-full p-4 bg-slate-950/40 text-slate-300 font-mono text-xs focus:outline-none resize-none overflow-y-auto leading-relaxed border-0"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: WP ADMIN & COMPILER SIMULATOR WORKSPACE */}
        {activeWorkspaceTab === 'wp-admin' && (
          <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#f0f2f5]">
            
            {/* Top WP administration bar layout simulator */}
            <div className="bg-[#1e293b] text-[#f0f0f1] font-sans h-8 px-4 flex justify-between items-center shrink-0 z-20 select-none text-[13px]" id="wp-topbar">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 cursor-default hover:bg-slate-800 h-8 px-2 font-black text-blue-450 text-sm">
                  WordPress <span className="text-[9px] bg-blue-600/20 px-1 py-0.2 rounded-sm font-light text-blue-300 ml-1">Sim v6.4</span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 h-8 px-2" onClick={() => setWpMenu('sandbox')}>
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Visit Utility Site</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 cursor-default hover:bg-slate-800 h-8 px-2">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span>Interactive Server Hooked</span>
                </div>
              </div>

              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 h-8 px-2 bg-slate-800 text-white">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Howdy, Administrator <strong>(Unlocked)</strong></span>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="flex-1 flex overflow-hidden min-h-0 relative">
              
              {/* WP Admin vertical sidebar navigation */}
              <div className="w-14 md:w-56 bg-[#1e293b] flex flex-col justify-between shrink-0 h-full overflow-y-auto select-none" id="wp-sidebar">
                <div className="space-y-1">
                  
                  {/* Pro Tool Hub core navigation menu header */}
                  <div className="p-3 md:p-4 text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-widest hidden md:block">
                    🧩 Core Plugin Panels
                  </div>

                  {/* Sidebar links mappings */}
                  {[
                    { id: 'dashboard', name: 'Dashboard & Stats', icon: Activity, badge: 'Insights' },
                    { id: 'tools', name: 'My Tools (CPT)', icon: FileCode2, badge: `${tools.length}` },
                    { id: 'groups', name: 'Tool Groups', icon: Layers },
                    { id: 'settings', name: 'Global Settings', icon: Settings2 },
                    { id: 'importer', name: 'Restore / Backup', icon: Import },
                    { id: 'sandbox', name: 'Frontend Sandbox', icon: Eye, highlight: true }
                  ].map(item => {
                    const isSelected = wpMenu === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setWpMenu(item.id as any);
                          setEditingTool(null);
                        }}
                        className={`w-full text-left py-3 px-3 md:px-4 text-[12px] md:text-[13px] flex items-center justify-between transition-all ${isSelected ? 'bg-blue-600/15 border-l-4 border-blue-500 text-white font-medium' : 'text-[#a7aaad] hover:bg-slate-800 hover:text-[#72aee6]'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : item.highlight ? 'text-sky-450' : 'text-[#a7aaad]'}`} />
                          <span className="hidden md:inline">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="hidden md:inline text-[9px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-mono font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <div className="h-px bg-slate-850 my-4 hidden md:block mx-4" />

                  {/* Mock placeholder settings to fill context */}
                  <div className="p-3 text-[10px] text-slate-500 uppercase tracking-widest hidden md:block select-none">
                    WordPress Core Views
                  </div>
                  <div className="space-y-0.5 opacity-45 cursor-not-allowed select-none hidden md:block pointer-events-none">
                    <span className="block px-4 py-1.5 text-xs text-[#a7aaad]">📝 Standard Blog Posts</span>
                    <span className="block px-4 py-1.5 text-xs text-[#a7aaad]">🖼️ Library Media</span>
                    <span className="block px-4 py-1.5 text-xs text-[#a7aaad]">📄 General Pages</span>
                    <span className="block px-4 py-1.5 text-xs text-[#a7aaad]">💬 Comments Review</span>
                    <span className="block px-4 py-1.5 text-xs text-[#a7aaad]">🔌 Plugins Console</span>
                  </div>
                </div>

                <div className="p-3 text-center border-t border-slate-850 hidden md:block select-none bg-slate-950/20">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">License Protocol</div>
                  <div className="text-blue-400 text-xs font-bold mt-1">● FULLY UNLOCKED</div>
                </div>
              </div>

              {/* Main Admin Content Screen (Genuine WordPress Grid style) */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 h-full bg-[#f0f2f5] text-[#2c3338]" id="wp-body-content">
                <AnimatePresence mode="wait">
                  
                  {/* SCREEN 1: TELEMETRY DASHBOARD */}
                  {wpMenu === 'dashboard' && !editingTool && (
                    <motion.div 
                      key="dashboard"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-[#1d2327] tracking-tight">Pro Tool Hub Analytics</h2>
                          <p className="text-xs text-[#646970] mt-1">Monitor frontend shortcode visual logs, daily traffic distributions, and page-views metrics.</p>
                        </div>
                        <button
                          onClick={handleResetWpAnalytics}
                          className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm pointer-events-auto cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Zero Interaction Logs
                        </button>
                      </div>

                      {/* Diagnostic summary metrics boxes */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Directory Impressions</span>
                          <span className="text-3xl font-black text-[#1d2327] mt-3 font-mono">
                            {tools.reduce((acc, t) => acc + t.views, 0)}
                          </span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Active Custom Post Types</span>
                          <span className="text-3xl font-black text-[#1d2327] mt-3 font-mono">
                            {tools.length} Tools
                          </span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Directory Hook Status</span>
                          <div className="flex items-center gap-2 mt-3 text-blue-600 font-bold text-sm">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                            Database Operational
                          </div>
                        </div>
                      </div>

                      {/* Graphical charts grids */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Traffic Area Line Chart */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2">
                          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            Traffic Volume Matrix (Views span 7 Days)
                          </h3>
                          <div className="h-72 w-full text-xs font-mono">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={getDailyTrafficChartData()}>
                                <defs>
                                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Area type="monotone" dataKey="Views" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorViews)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Relative Breakdown Pie Chart */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Breakdown Distribution</h3>
                            <div className="h-48 w-full flex items-center justify-center relative">
                              {getToolBreakdownChartData().length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={getToolBreakdownChartData()}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={45}
                                      outerRadius={65}
                                      paddingAngle={3}
                                      dataKey="value"
                                    >
                                      {getToolBreakdownChartData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_ARRAY[index % COLORS_ARRAY.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                              ) : (
                                <div className="text-xs text-slate-400 font-mono">No traffic tracking data on disk. Write or test tools first.</div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-h-24 overflow-y-auto">
                            {tools.map((t, idx) => (
                              <div key={t.id} className="text-[11px] font-medium flex items-center justify-between text-slate-600">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS_ARRAY[idx % COLORS_ARRAY.length] }} />
                                  <span className="truncate">{t.title}</span>
                                </div>
                                <span className="font-mono font-bold shrink-0">{t.views} views</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 2: ALL CPT TOOLS LIST TABLE */}
                  {wpMenu === 'tools' && !editingTool && (
                    <motion.div 
                      key="tools-list"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-[#1d2327]">Custom Post Types: Directory Tools</h2>
                          <p className="text-xs text-[#646970] mt-1">Register custom computational markup forms, mapped directly as embeddable shortcoder models.</p>
                        </div>
                        <button
                          onClick={() => {
                            setIsCreatingNewTool(true);
                            setEditingTool({
                              id: 0,
                              slug: '',
                              title: '',
                              excerpt: '',
                              content: '',
                              group: groups[0] || 'Mathematics',
                              status: 'Published',
                              html: '',
                              css: '',
                              js: '',
                              seoTitle: '',
                              seoDesc: '',
                              seoOgImg: '',
                              views: 0,
                              dailyViews: {}
                            });
                          }}
                          className="bg-blue-600 hover:bg-blue-550 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-md shadow-blue-500/10 pointer-events-auto cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Add Custom WP Tool
                        </button>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                               <tr className="bg-[#f6f7f7] border-b border-slate-200 text-[#1d2327] font-bold uppercase tracking-wider text-[10px]">
                                <th className="p-4 w-1/3">Target Tool Title / Slug</th>
                                <th className="p-4">Taxonomy Group</th>
                                <th className="p-4">Registered WP Shortcode</th>
                                <th className="p-4">SEO Health Score</th>
                                <th className="p-4 text-right">Database Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2e8f0] text-slate-700">
                              {tools.map(tool => {
                                const seoCompletedCount = [tool.seoTitle, tool.seoDesc, tool.seoOgImg].filter(t => t.trim().length > 0).length;
                                return (
                                  <tr key={tool.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                      <span className="font-bold text-sm text-[#1d2327] block hover:text-blue-500 cursor-pointer" onClick={() => {
                                        setSelectedToolId(tool.id);
                                        setWpMenu('sandbox');
                                      }}>
                                        {tool.title}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Slug id: /tool/{tool.slug || tool.title.toLowerCase().replace(/\s+/g, '-')}</span>
                                    </td>
                                    <td className="p-4">
                                      <span className="bg-slate-100 text-slate-600 border border-slate-200 rounded px-2.5 py-1 font-semibold text-[10px] uppercase">
                                        {tool.group}
                                      </span>
                                    </td>
                                    <td className="p-4 font-mono select-all">
                                      <span className="bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] rounded px-3 py-1 font-bold text-[11px] block text-center w-full max-w-[200px]">
                                        [pro_tool id="{tool.id}"]
                                      </span>
                                    </td>
                                    <td className="p-4">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-16 bg-slate-200 h-2 rounded overflow-hidden">
                                          <div className={`h-full ${seoCompletedCount === 3 ? 'bg-blue-500' : seoCompletedCount === 2 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${(seoCompletedCount/3)*100}%` }}></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500">{seoCompletedCount}/3 completed</span>
                                      </div>
                                    </td>
                                    <td className="p-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => {
                                            setSelectedToolId(tool.id);
                                            setWpMenu('sandbox');
                                          }}
                                          className="text-slate-500 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-all"
                                          title="Live Sandbox Preview"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setIsCreatingNewTool(false);
                                            setEditingTool({ ...tool });
                                          }}
                                          className="text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-all"
                                          title="Customize Fields"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTool(tool.id)}
                                          className="text-slate-500 hover:text-red-705 bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-all"
                                          title="Delete CPT Entry"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              {tools.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="p-12 text-center text-slate-400">
                                    No tools registered in database list. Click 'Add Custom WP Tool' above to start!
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 3: ADD/EDIT DETAILED META-BOX FORM */}
                  {editingTool && (
                    <motion.div 
                      key="tool-editor-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6 max-w-4xl"
                    >
                      <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">WordPress Editor Panel</span>
                          <h3 className="text-xl font-bold text-[#1d2327]">
                            {isCreatingNewTool ? 'Create Custom Post Item' : `Edit Tool CPT: ${editingTool.title}`}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTool(null);
                              setIsCreatingNewTool(false);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-[#cbd5e1] text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                          >
                            Return to List
                          </button>
                          <button
                            type="submit"
                            form="wp-cpt-form"
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
                          >
                            Save & Publish Entry
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleSaveToolsCPT} id="wp-cpt-form" className="space-y-6">
                        
                        {/* Title and Base Post Details */}
                        <div className="bg-white border border-[#dcdcde] rounded-xl p-6 shadow-sm space-y-4">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Primary Post Details</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-600">Post Title *</label>
                              <input 
                                type="text" 
                                required
                                value={editingTool.title}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, title: e.target.value } : null)}
                                className="w-full bg-[#fcfcfc] border border-slate-300 focus:outline-none focus:border-blue-500 rounded-md py-2 px-3 text-xs"
                                placeholder="Universal Word Counter"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-600">Shortcode Anchor Slug *</label>
                              <input 
                                type="text" 
                                required
                                value={editingTool.slug}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') } : null)}
                                className="w-full bg-[#fcfcfc] border border-slate-300 focus:outline-none focus:border-blue-500 rounded-md py-2 px-3 text-xs font-mono"
                                placeholder="word-counter"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-600">Category Tag (Tool Group)</label>
                              <select
                                value={editingTool.group}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, group: e.target.value } : null)}
                                className="w-full bg-[#fcfcfc] border border-slate-300 focus:outline-none focus:border-blue-500 rounded-md py-2 px-3 text-xs"
                              >
                                {groups.map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-600">Short Description Excerpt (Brief Summary)</label>
                              <input 
                                type="text" 
                                value={editingTool.excerpt}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                                className="w-full bg-[#fcfcfc] border border-slate-300 focus:outline-none focus:border-blue-500 rounded-md py-2 px-3 text-xs"
                                placeholder="A clean tool analyzing text weights instantly..."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Custom Core Meta Boxes (HTML, CSS, JS components) */}
                        <div className="bg-white border border-[#dcdcde] rounded-xl p-6 shadow-sm space-y-4">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Tool Source Codes (HTML/CSS/JS)</h3>
                          <p className="text-[11px] text-slate-400">Write custom codes. Local styles will scope automatically inside sandbox wrappers. JS bindings can listen to <code>container</code> selectors.</p>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">HTML Structure Markup</label>
                              <textarea
                                rows={6}
                                value={editingTool.html}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, html: e.target.value } : null)}
                                className="w-full p-3 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-lg border border-slate-800"
                                placeholder="<div>Your layout here</div>"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Scoped Stylesheet Rules (CSS)</label>
                              <textarea
                                rows={6}
                                value={editingTool.css}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, css: e.target.value } : null)}
                                className="w-full p-3 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-lg border border-slate-800"
                                placeholder=".tool-box { color: #f97316; }"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Interactive Scripts Logic (JavaScript)</label>
                              <textarea
                                rows={6}
                                value={editingTool.js}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, js: e.target.value } : null)}
                                className="w-full p-3 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-lg border border-slate-800"
                                placeholder="container.querySelector('.btn').addEventListener('click', ...);"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Custom WordPress SEO Suite Meta Boxes */}
                        <div className="bg-white border border-[#dcdcde] rounded-xl p-6 shadow-sm space-y-4">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">WordPress SEO & Shared OG Suite</h3>
                          <p className="text-[11px] text-slate-400">Inject custom title configurations, search metadata snippet overrides, and Open Graph share screenshots URLs.</p>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Custom SEO Title Tab Override</label>
                              <input 
                                type="text"
                                value={editingTool.seoTitle}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, seoTitle: e.target.value } : null)}
                                className="w-full bg-[#fcfcfc] border border-slate-300 focus:outline-none focus:border-blue-500 rounded-md py-2 px-3 text-xs"
                                placeholder="Professional Word Weight Checker Engine Tools"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Meta Description SEO Overrides</label>
                              <textarea
                                rows={3}
                                value={editingTool.seoDesc}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, seoDesc: e.target.value } : null)}
                                className="w-full p-3 bg-[#fcfcfc] text-slate-800 text-xs rounded-lg border border-slate-300"
                                placeholder="Analyze character volumes instantly using this premium directory tool layout."
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Custom OG Thumbnail Image link</label>
                              <input 
                                type="url"
                                value={editingTool.seoOgImg}
                                onChange={(e) => setEditingTool(prev => prev ? { ...prev, seoOgImg: e.target.value } : null)}
                                className="w-full bg-[#fcfcfc] border border-slate-300 focus:outline-none focus:border-blue-500 rounded-md py-2 px-3 text-xs"
                                placeholder="https://example.com/wp-content/uploads/logo.jpg"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pb-8">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTool(null);
                              setIsCreatingNewTool(false);
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-lg transition-all"
                          >
                            Abandon Changes
                          </button>
                          <button
                            type="submit"
                            className="bg-[#1d2327] hover:bg-black text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all"
                          >
                            Confirm & Save Tool
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* SCREEN 4: TAXONOMY (TOOL GROUPS) */}
                  {wpMenu === 'groups' && !editingTool && (
                    <motion.div 
                      key="groups"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-[#1d2327]">Custom Taxonomy: Tool Groups</h2>
                        <p className="text-xs text-[#646970] mt-1">Implement, organize and separate tool models by category headers blocks.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left add tag form */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit">
                          <h3 className="text-sm font-bold text-[#1d2327] mb-4">Add New Category Tag</h3>
                          
                          <form onSubmit={handleAddGroupTag} className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600">Category Label Name</label>
                              <input 
                                type="text"
                                required
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="w-full bg-[#fcfcfc] border border-slate-200 rounded-md py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                                placeholder="E.g., Graphics Generator"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-semibold transition-all shadow-sm pointer-events-auto cursor-pointer"
                            >
                              Add New Group Tag
                            </button>
                          </form>
                        </div>

                        {/* Right tags list table */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm md:col-span-2">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-[#f6f7f7] text-[#1d2327] font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                                <th className="p-4">Taxonomy Tag Name</th>
                                <th className="p-4">Short slug parameter</th>
                                <th className="p-4">Shortcode references</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2e8f0]">
                              {groups.map((group, idx) => {
                                const matchedCount = tools.filter(t => t.group === group).length;
                                return (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-sm text-[#1d2327]">{group}</td>
                                    <td className="p-4 font-mono text-slate-500">{group.toLowerCase().replace(/\s+/g, '-')}</td>
                                    <td className="p-4">
                                      <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-bold text-[10px] inline-block">
                                        {matchedCount} active tools mapped
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 5: SETTINGS PAGE */}
                  {wpMenu === 'settings' && !editingTool && (
                    <motion.div 
                      key="settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6 max-w-3xl"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-[#1d2327]">Global Directory Settings</h2>
                        <p className="text-xs text-[#646970] mt-1">Configure central variable modifiers, global shared styling framework assets, and custom copy copyright credits.</p>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                        
                        {/* Analytics toggle switch */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <div>
                            <h4 className="text-sm font-bold text-[#1d2327]">Active Traffic Tracker Engine</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Toggle live Daily Impressions counts logger when shortcodes load on user client windows.</p>
                          </div>
                          <button
                            onClick={() => setAnalyticsActive(!analyticsActive)}
                            className={`w-14 h-7 rounded-full px-1 flex items-center transition-all duration-300 cursor-pointer ${analyticsActive ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
                          >
                            <span className="w-5.5 h-5.5 rounded-full bg-white shadow shadow-black/10"></span>
                          </button>
                        </div>

                        {/* Copyright Credit */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-[#1d2327]">Footer Copyright Custom Overrides</h4>
                          <p className="text-xs text-slate-400">Add an customized brand note centered underneath the bottom boundary of compiled tools frames automatically.</p>
                          <input 
                            type="text"
                            value={footerCopyright}
                            onChange={(e) => setFooterCopyright(e.target.value)}
                            className="w-full p-2.5 bg-[#fcfcfc] border border-slate-300 rounded-md text-xs font-sans"
                            placeholder="E.g., Powered by Pro Tool Hub Premium Kit"
                          />
                        </div>

                        {/* Global CSS block */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-[#1d2327]">Shared General CSS overlay container classes</h4>
                          <p className="text-xs text-slate-400">Inject shared styling properties, container overlays boundaries, or framework resets across all shortcodes triggers dynamically.</p>
                          <textarea
                            rows={6}
                            value={globalCSS}
                            onChange={(e) => setGlobalCSS(e.target.value)}
                            className="w-full p-3 bg-slate-950 text-slate-300 font-mono text-xs rounded-lg border border-slate-800"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 6: IMPORT & EXPORT RESTORE */}
                  {wpMenu === 'importer' && !editingTool && (
                    <motion.div 
                      key="importer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6 max-w-4xl"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-[#1d2327]">Restore / Backup Suite</h2>
                        <p className="text-xs text-[#646970] mt-1">Instantly bundle, archive, or upload custom directory pre-sets and tools configurations using raw JSON protocol matrices.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Exporter Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-[#1d2327] flex items-center gap-2">
                              <Download className="w-5 h-5 text-blue-500" />
                              Export active directory tools
                            </h3>
                            <p className="text-xs text-[#646970] mt-2 leading-relaxed">
                              Download a secure JSON archive snapshot. This package bundles your complete post layouts, structure HTML grids, scoped CSS stylesheet guidelines, JavaScript triggers, and SEO metadata assets.
                            </p>
                          </div>
                          
                          <button
                            onClick={triggerToolsJsonExport}
                            className="w-full bg-[#1e293b] hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg border-0 transition-all shadow-sm mt-6 cursor-pointer pointer-events-auto"
                          >
                            Export Directory Configuration Map
                          </button>
                        </div>

                        {/* Importer Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="text-base font-bold text-[#1d2327] flex items-center gap-2">
                              <Import className="w-5 h-5 text-blue-500" />
                              Restore or Load Presets
                            </h3>
                            <p className="text-xs text-[#646970] mt-1 leading-relaxed">
                              Paste an exported JSON snapshot schema directly into the box below and click restore to load configuration presets smoothly.
                            </p>
                          </div>

                          <textarea
                            rows={4}
                            value={importJsonRaw}
                            onChange={(e) => setImportJsonRaw(e.target.value)}
                            placeholder='[ { "title": "Calculations Tools", "html": "...", "css": "...", "js": "..." } ]'
                            className="w-full p-2 bg-[#fcfcfc] border border-slate-300 font-mono text-[10px] rounded-lg focus:outline-none"
                          />

                          {importFeedback && (
                            <div className={`p-2.5 rounded text-[11px] font-medium leading-relaxed ${importFeedback.type === 'success' ? 'bg-blue-50 border border-blue-200 text-blue-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                              {importFeedback.text}
                            </div>
                          )}

                          <button
                            onClick={handleExecuteImportJson}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg border-0 transition-all shadow-sm cursor-pointer pointer-events-auto"
                          >
                            Execute Repository Restore
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 7: COMPILER FRONTEND SANDBOX PREVIEW */}
                  {wpMenu === 'sandbox' && !editingTool && (
                    <motion.div 
                      key="sandbox-sandbox"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                        <div>
                          <div className="text-xs bg-blue-500/15 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-500/25 font-semibold w-fit">
                            Shortcode Hook Compiler
                          </div>
                          <h2 className="text-2xl font-bold text-[#1d2327] mt-1">Live Frontend Embed Sandbox</h2>
                          <p className="text-xs text-[#646970] mt-1">Compile custom tools with active global styles, and execute custom interactive JavaScript inside an isolated client window.</p>
                        </div>

                        {/* Interactive Shortcode selector select box triggers views counts and updates iframe */}
                        <div className="flex flex-wrap items-center gap-3 bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
                          <span className="text-xs font-bold text-slate-500 px-1">Trigger WP Shortcode:</span>
                          <select
                            value={selectedToolId}
                            onChange={(e) => {
                              const nextId = parseInt(e.target.value, 10);
                              setSelectedToolId(nextId);
                              trackToolView(nextId);
                            }}
                            className="bg-slate-50 text-slate-800 text-xs font-semibold p-1.5 border border-slate-300 focus:outline-none rounded-lg"
                          >
                            {tools.map(t => (
                              <option key={t.id} value={t.id}>[pro_tool id="{t.id}"] (slug: {t.slug})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Unified Virtual Browser Frame */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Interactive Preview column (Left) */}
                        <div className="lg:col-span-2 space-y-4">
                          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-md flex flex-col">
                            {/* Browser Header address bar mock panel */}
                            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4 select-none shrink-0 text-slate-400">
                              <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
                              </div>
                              <div className="flex-1 max-w-lg bg-white border border-slate-300 rounded py-1 px-3 text-[11px] font-mono text-slate-500 text-center truncate shadow-inner flex items-center justify-center gap-1.5">
                                <span className="text-slate-300">https://local-sandbox/tool/</span>
                                <span className="text-blue-600 font-bold">{activeInteractiveTool?.slug || 'calculator'}</span>
                              </div>
                              <HelpCircle className="w-4 h-4 text-slate-300" />
                            </div>

                            <div className="p-4 bg-white/50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                              <span>Simulated Browser Tab Title: <strong className="text-slate-800">{activeInteractiveTool?.seoTitle || activeInteractiveTool?.title}</strong></span>
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded border">SEO TAB ACTIVE</span>
                            </div>

                            {/* Live Sandbox Render Frame Area */}
                            <div className="bg-slate-50 p-6 min-h-[400px] flex items-center justify-center">
                              {activeInteractiveTool ? (
                                <iframe 
                                  key={selectedToolId} // Re-renders cleanly when tool changes
                                  srcDoc={iframeContent}
                                  sandbox="allow-scripts allow-modals"
                                  className="w-full bg-white rounded-xl shadow-lg border border-slate-200 min-h-[380px]"
                                />
                              ) : (
                                <div className="text-slate-400 text-xs">No tools registered in scope. Add directories tools first.</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Telemetry trackers panel (Right) */}
                        <div className="space-y-6">
                          
                          {/* Live metrics trackers */}
                          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                            <h3 className="text-xs uppercase font-bold tracking-widest text-[#1d2327] flex items-center gap-2 border-b border-slate-100 pb-2">
                              <Activity className="w-4 h-4 text-blue-550" />
                              Shortcode Views Telemetry
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Tool Views</span>
                                <span className="block text-xl font-bold font-mono text-[#1d2327] mt-1">{activeInteractiveTool?.views || 0}</span>
                              </div>
                              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Category</span>
                                <span className="block text-xs font-bold text-slate-600 mt-1.5 truncate uppercase">{activeInteractiveTool?.group || 'N/A'}</span>
                              </div>
                            </div>

                            {activeInteractiveTool && (
                              <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg space-y-1 text-slate-600">
                                <div className="text-[11px] font-bold text-blue-800 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  SEO Snippet Preview
                                </div>
                                <div className="text-[11px] font-bold text-blue-800 line-clamp-1">{activeInteractiveTool.seoTitle || activeInteractiveTool.title}</div>
                                <div className="text-[10px] text-slate-500 leading-normal line-clamp-2">{activeInteractiveTool.seoDesc || 'Provide a custom meta description inside parameters to render rich Google snippets...'}</div>
                              </div>
                            )}
                          </div>

                          {/* Console log outputs terminal */}
                          <div className="bg-slate-950 text-blue-400 font-mono text-[11px] p-4 rounded-xl border border-slate-800 shadow-md flex flex-col h-64">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2 select-none text-slate-400">
                              <span className="text-[9px] uppercase font-bold tracking-widest">Compiler Outputs Console</span>
                              <button 
                                onClick={() => setConsoleLogs([])}
                                className="text-[9px] bg-slate-900 border border-slate-800 hover:bg-slate-800 px-2 py-0.5 rounded transition-colors text-slate-350 cursor-pointer"
                              >
                                Clear Console
                              </button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-1.5 max-h-52 pr-1 scrollbar-thin text-slate-300">
                              {consoleLogs.map((log, index) => (
                                <div key={index} className="leading-relaxed border-l-2 border-blue-500/20 pl-2">
                                  {log}
                                </div>
                              ))}
                              {consoleLogs.length === 0 && (
                                <div className="text-slate-600 italic">Logs are currently empty. Trigger tool events to listen to processes...</div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

          </div>
        )}

      </main>
      
    </div>
  );
}
