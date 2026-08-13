"use client";

import { useState } from "react";
import { updateProfile, uploadAvatar } from "@/app/actions/profile";

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
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");

  const initials = (user.name || "Vault User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  async function handleSave(formData: FormData) {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const newUrl = await uploadAvatar(formData);
      setAvatarUrl(newUrl); // Shows the new picture, but hasn't saved to DB yet!
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  // Handle Cancel: Revert to the original saved image and close edit mode
  function handleCancel() {
    setAvatarUrl(user.image || ""); 
    setIsEditing(false);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121214]/90 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-zinc-800/50 bg-zinc-900/50 px-6 py-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form action={handleSave} className="p-6">
        
        {/* HIDDEN INPUT: Sends the current avatarUrl to the server when "Save" is clicked */}
        <input type="hidden" name="image" value={avatarUrl} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          
          {/* Avatar Area */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative group">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#4338ca] to-[#3730a3] text-2xl font-bold text-white shadow-lg border-2 border-zinc-800 overflow-hidden">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt={user.name || "User"} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              
              {isEditing && (
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  {isUploading ? <span className="text-[10px] text-white">...</span> : <CameraIcon />}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
            
            {/* Remove Picture Button */}
            {isEditing && avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl("")}
                className="mt-2 text-[10px] font-medium text-red-400/80 hover:text-red-400 transition-colors cursor-pointer"
              >
                Remove picture
              </button>
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

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-800/50 pt-4 animate-fade-in-up">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}