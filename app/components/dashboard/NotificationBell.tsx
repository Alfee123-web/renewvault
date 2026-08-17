"use client";

import { useState, useRef, useEffect } from "react";

// --- ICONS ---
function BellIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>; }
function AlertIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>; }
function CheckCircleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>; }
function CloseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>; }

// Dummy Data for Initial State
const DUMMY_NOTIFICATIONS = [
  { id: 1, title: "Netflix renewing soon", message: "Your $15.49 subscription renews in 3 days.", time: "2 hours ago", type: "warning", unread: true },
  { id: 2, title: "Xbox Game Pass renewed", message: "Your subscription was successfully renewed.", time: "1 day ago", type: "success", unread: true },
  { id: 3, title: "Reminder Set", message: "Multi-reminder activated for Duolingo.", time: "2 days ago", type: "info", unread: false },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("renew_vault_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // 2. Save to LocalStorage whenever notifications change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("renew_vault_notifications", JSON.stringify(notifications));
    }
  }, [notifications, isLoaded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  // Prevent rendering the red dot until we know what's in local storage (prevents hydration flash)
  const unreadCount = isLoaded ? notifications.filter(n => n.unread).length : 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-800 cursor-pointer"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[#121212]"></span>
        )}
      </button>

      {/* Dropdown Panel - Solid Opaque Background */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-[#121214] shadow-2xl z-50 animate-fade-in-up overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[#5b5fd8] hover:text-[#787bf1] transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-zinc-500">
                <BellIcon />
                <p className="mt-2 text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => markAsRead(notif.id)}
                  className={`group relative flex gap-3 px-5 py-4 border-b border-zinc-800 transition-colors hover:bg-zinc-800/50 cursor-pointer ${notif.unread ? "bg-[#5b5fd8]/10" : ""}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'warning' ? <AlertIcon /> : <CheckCircleIcon />}
                  </div>
                  
                  <div className="flex-1 pr-6">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${notif.unread ? "text-white" : "text-zinc-300"}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {/* Right side container: Dot OR Delete Button */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-end w-8 h-8">
                    {notif.unread && (
                      <div className="w-2 h-2 rounded-full bg-[#5b5fd8] transition-opacity group-hover:opacity-0 group-hover:invisible"></div>
                    )}
                    <button 
                      onClick={(e) => removeNotification(e, notif.id)}
                      className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible flex items-center justify-center w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-red-500 transition-all cursor-pointer"
                      title="Remove notification"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900 text-center">
              <button 
                onClick={() => setNotifications([])}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Clear all activity
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}