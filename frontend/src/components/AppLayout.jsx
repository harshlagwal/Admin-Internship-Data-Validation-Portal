import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api/endpoints';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Users, Activity, Shield, LogOut,
  ChevronRight, BarChart3, Menu, X, Bell, Search
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { getCandidates } from '../api/endpoints';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Admin Dash',    icon: LayoutDashboard },
  { to: '/candidates', label: 'Interns Info',  icon: Users },
  { to: '/sessions',   label: 'Exam Sessions',  icon: Activity },
  { to: '/audit-logs', label: 'System Logs',   icon: Shield },
];

export default function AppLayout({ children }) {
  const { admin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Close search results on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.querySelector('input')?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle search logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const res = await getCandidates({ search: searchQuery, limit: 5 });
          setSearchResults(res.data.data);
        } catch (err) {
          console.error('Search failed', err);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const getPageTitle = () => {
    const item = NAV_ITEMS.find(i => i.to === location.pathname);
    return item ? item.label : 'Admin Portal';
  };

  const handleLogout = async () => {
    try { await logout(); } catch {}
    signOut();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-main">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-primary">Admin Portal</p>
              <p className="text-[10px] text-muted leading-tight">Interview Validation</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            id={`nav-${label.toLowerCase().replace(' ','-')}`}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active group' : 'group'} ${collapsed ? 'justify-center px-3' : ''}`
            }
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {!collapsed && <span className="flex-1">{label}</span>}
                {!collapsed && (
                  <ChevronRight className={`w-3.5 h-3.5 transition-all duration-200 ${isActive ? 'opacity-100 text-primary-main' : 'opacity-30 group-hover:opacity-100'}`} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin strip */}
      <div className="px-3 pb-5 border-t border-main pt-4 mt-auto">
        <div className={`flex items-center gap-3 mb-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-primary/20">
            {admin?.fullName?.[0] ?? 'A'}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary truncate">{admin?.fullName}</p>
              <p className="text-[10px] text-muted truncate uppercase tracking-wider">{admin?.role ?? 'Administrator'}</p>
            </div>
          )}
        </div>
        <button
          id="btn-logout"
          onClick={handleLogout}
          className={`nav-link text-red-500 hover:text-red-600 hover:bg-red-500/10 w-full ${collapsed ? 'justify-center px-3' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-main">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-main bg-surface/40 backdrop-blur-2xl transition-all duration-300 relative ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3.5 w-7 h-7 rounded-full bg-surface border border-main flex items-center justify-center text-primary-main hover:bg-primary-main hover:text-white transition-all shadow-lg z-50 group"
          id="sidebar-collapse"
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'} group-hover:scale-110`} />
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface border-r border-main flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar (Common for both but layout differs) */}
        <header className="flex items-center justify-between px-4 lg:px-8 py-3 border-b border-main bg-surface/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden btn-icon">
              <Menu className="w-5 h-5 text-secondary" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden lg:flex items-center relative mr-2 group" ref={searchRef}>
              <Search className="absolute left-3 w-4 h-4 text-muted group-focus-within:text-primary-main transition-colors duration-200" />
              <input 
                type="text" 
                placeholder="Search intern name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setIsSearching(true)}
                className="w-64 pl-9 pr-12 py-1.5 bg-surface/80 border border-main rounded-xl text-xs placeholder-muted hover:bg-surface hover:border-muted/30 focus:bg-surface focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-none transition-all shadow-sm"
              />
              <div className="absolute right-2.5 px-1.5 py-0.5 rounded-md border border-main bg-main/50 text-[9px] font-bold text-muted pointer-events-none opacity-60 group-focus-within:opacity-0 transition-opacity flex items-center gap-0.5">
                <span className="text-[10px]">⌘</span>K
              </div>
              
              {/* Search Results Dropdown */}
              {isSearching && (
                <div className="absolute top-12 left-0 w-80 bg-surface border border-main rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-wider border-b border-main mb-1">
                    Intern Match Results
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-muted font-medium">
                      No interns found matching "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map(candidate => (
                      <button
                        key={candidate.id}
                        onClick={() => {
                          navigate(`/candidates/${candidate.id}`);
                          setIsSearching(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-primary-main/10 rounded-xl transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-main/20 flex items-center justify-center text-primary-main font-bold text-xs">
                          {candidate.full_name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-primary truncate group-hover:text-primary-main">{candidate.full_name}</p>
                          <p className="text-[10px] text-muted truncate">{candidate.email}</p>
                        </div>
                        <div className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                          candidate.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-600' :
                          candidate.status === 'REJECTED' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {candidate.status}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <button className="btn-icon text-muted hover:text-primary">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-border-main mx-1" />
            
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
