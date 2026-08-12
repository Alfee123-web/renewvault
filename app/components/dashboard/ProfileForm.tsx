"use client";

import { useState } from "react";
import { updateProfileName } from "@/app/actions/profile";

// Icons
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
const CameraIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

interface ProfileFormProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initials = (user.name || "Vault User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  async function handleSave(formData: FormData) {
    setIsSaving(true);
    await updateProfileName(formData);
    setIsEditing(false);
    setIsSaving(false);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121214]/90 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-zinc-800/50 bg-zinc-900/50 px-6 py-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form action={handleSave} className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          
          {/* Avatar Area */}
          <div className="relative group">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4338ca] to-[#3730a3] text-2xl font-bold text-white shadow-lg border-2 border-zinc-800 overflow-hidden">
              {user.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            
            {/* Avatar Edit Overlay */}
            {isEditing && (
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <CameraIcon />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => alert("Image upload requires a storage bucket (like Vercel Blob). Coming in a future update!")}
                />
              </label>
            )}
          </div>

          {/* Details Area */}
          <div className="flex-1 space-y-4 w-full">
            {/* Name Field */}
            <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3">
              <UserIcon />
              <div className="flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    defaultValue={user.name || ""}
                    required
                    className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                ) : (
                  <p className="text-sm font-medium text-white">{user.name}</p>
                )}
              </div>
            </div>

            {/* Email Field (Always Read Only) */}
            <div className={`flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3 ${isEditing ? 'opacity-60' : ''}`}>
              <MailIcon />
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Email Address</p>
                  <p className="text-sm font-medium text-white">{user.email}</p>
                </div>
                {isEditing && <LockIcon />}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Only visible when editing) */}
        {isEditing && (
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-800/50 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}