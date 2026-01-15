import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import CountrySelector from './CountrySelector';
import ProfileSettingsModal from './ProfileSettingsModal';

interface NavbarProps {
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onOpenAuthModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  notifications,
  onMarkNotificationRead,
  onOpenAuthModal
}) => {
  const {
    user,
    signOut,
    loading,
    isAdmin,
    branding
  } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    } else if (window.location.pathname !== '/') {
      // Navigate home then scroll
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  // Get user display name from metadata or email
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || '';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  return <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">


    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">{branding}</h1>
            <p className="text-xs text-gray-500 -mt-0.5">Asset Dashboard</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {[{
            id: 'assets',
            label: 'Assets'
          }, {
            id: 'family',
            label: 'Family'
          }, {
            id: 'calculator',
            label: 'Calculator'
          }, {
            id: 'ledger',
            label: 'Ledger'
          }, {
            id: 'documents',
            label: 'Documents'
          }, {
            id: 'history',
            label: 'History'
          }].map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors font-medium">
            {item.label}
          </button>)}

          {/* Admin Panel Button */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="ml-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Admin
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Country Selector */}
          <CountrySelector variant="navbar" />

          {/* Notifications - Only show when logged in */}
          {user && <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(notif => <div key={notif.id} onClick={() => onMarkNotificationRead(notif.id)} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notif.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(notif.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>) : <div className="p-8 text-center">
                  <p className="text-gray-500">No notifications</p>
                </div>}
              </div>
            </div>}
          </div>}

          {/* Auth Section */}
          {loading ? <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div> : user ? (/* User Menu */
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/90 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {getUserInitials()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {getUserDisplayName()}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              {showUserMenu && <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <p className="font-semibold text-gray-900 truncate">{getUserDisplayName()}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  {isAdmin && <span className="text-xs text-red-600 font-bold uppercase mt-1 block">Administrator</span>}
                </div>
                <div className="p-2">
                  <button onClick={() => {
                    setShowUserMenu(false);
                    scrollToSection('assets');
                  }} className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    My Assets
                  </button>
                  <button onClick={() => {
                    setShowUserMenu(false);
                    scrollToSection('calculator');
                  }} className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Inheritance Calculator
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button onClick={() => {
                    setShowUserMenu(false);
                    setShowProfileSettings(true);
                  }} className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Settings
                  </button>
                </div>
              </div>}
            </div>) : (/* Sign In Button */
            <button onClick={onOpenAuthModal} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </button>)}

          {/* Mobile Menu Button - unchanged logic mostly */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden py-4 border-t border-gray-100">
        {[{
          id: 'assets',
          label: 'Assets'
        }, {
          id: 'family',
          label: 'Family'
        }, {
          id: 'calculator',
          label: 'Calculator'
        }, {
          id: 'ledger',
          label: 'Ledger'
        }, {
          id: 'documents',
          label: 'Documents'
        }, {
          id: 'history',
          label: 'History'
        }].map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors font-medium">
          {item.label}
        </button>)}

        {/* Admin Mobile Link */}
        {isAdmin && (
          <button onClick={() => {
            setMobileMenuOpen(false);
            navigate('/admin');
          }} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Admin
          </button>
        )}

        {/* Mobile Country Selector */}
        <div className="px-4 py-3 border-t border-gray-100 mt-2">
          <p className="text-sm font-medium text-gray-500 mb-2">Country / Currency</p>
          <CountrySelector variant="full" />
        </div>

        {/* Mobile Auth */}
        {!user && <button onClick={() => {
          setMobileMenuOpen(false);
          onOpenAuthModal();
        }} className="block w-full text-left px-4 py-3 text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors font-medium mt-2">
          Sign In
        </button>}

        {user && <button onClick={() => {
          setMobileMenuOpen(false);
          handleSignOut();
        }} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium mt-2">
          Sign Out
        </button>}
      </div>}
    </div>
    <ProfileSettingsModal isOpen={showProfileSettings} onClose={() => setShowProfileSettings(false)} />
  </nav>;
};
export default Navbar;