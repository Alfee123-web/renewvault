"use client";

import { useState, useEffect } from "react";
import { Renewal } from "@/lib/types";

interface AddRenewalModalProps {
  onClose: () => void;
  onAdd: (renewal: Renewal) => void;
  onUpdate: (renewal: Renewal) => void;
  editingRenewal: Renewal | null;
}

export default function AddRenewalModal({
  onClose,
  onAdd,
  onUpdate,
  editingRenewal,
}: AddRenewalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    dueDate: "",
    amount: "",
    currency: "USD",
    reminderSetting: "none",
  });

  // State to manage errors and dropdowns
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const currencies = ["USD", "EUR", "GBP", "INR"];
  const reminders = [
    { value: "none", label: "No reminder" },
    { value: "1", label: "1 day before" },
    { value: "7", label: "7 days before" },
    { value: "30", label: "30 days before" },
  ];

  useEffect(() => {
    if (editingRenewal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: editingRenewal.name,
        category: editingRenewal.category,
        dueDate: editingRenewal.dueDate,
        amount: editingRenewal.amount.toString(),
        currency: editingRenewal.currency,
        reminderSetting: editingRenewal.reminderEnabled
          ? editingRenewal.reminderDaysBefore?.toString() || "none"
          : "none",
      });
    }
  }, [editingRenewal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    const newErrors: { [key: string]: string } = {};

    // Custom Validation to match your Auth pages
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.category.trim()) newErrors.category = "Category is required.";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required.";
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newRenewal: Renewal = {
      id: editingRenewal ? editingRenewal.id : Math.random().toString(36).substring(7),
      name: formData.name,
      category: formData.category,
      dueDate: formData.dueDate,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      status: "upcoming", 
      reminderEnabled: formData.reminderSetting !== "none",
      reminderDaysBefore: formData.reminderSetting !== "none" ? parseInt(formData.reminderSetting) : null,
    };

    if (editingRenewal) {
      onUpdate(newRenewal);
    } else {
      onAdd(newRenewal);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-[440px] rounded-2xl border border-[var(--border)] bg-[#121212] p-8 shadow-2xl animate-fade-in-up">
        
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {editingRenewal ? "Edit renewal" : "Add renewal"}
        </h2>

        {/* Added noValidate to stop browser default popups */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Name */}
          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Name (e.g. Spotify Premium)"
              className={`w-full rounded-xl border bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors ${
                errors.name ? "border-red-500/80 focus:border-red-500" : "border-[var(--border)] focus:border-[#5b5fd8]"
              }`}
            />
            {errors.name && <p className="text-[#ef4444] text-xs mt-1.5 px-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                if (errors.category) setErrors({ ...errors, category: "" });
              }}
              placeholder="Category (e.g. Subscription)"
              className={`w-full rounded-xl border bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors ${
                errors.category ? "border-red-500/80 focus:border-red-500" : "border-[var(--border)] focus:border-[#5b5fd8]"
              }`}
            />
            {errors.category && <p className="text-[#ef4444] text-xs mt-1.5 px-1">{errors.category}</p>}
          </div>

          {/* Due Date */}
          <div>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => {
                setFormData({ ...formData, dueDate: e.target.value });
                if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
              }}
              className={`w-full rounded-xl border bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors [color-scheme:dark] ${
                errors.dueDate ? "border-red-500/80 focus:border-red-500" : "border-[var(--border)] focus:border-[#5b5fd8]"
              }`}
            />
            {errors.dueDate && <p className="text-[#ef4444] text-xs mt-1.5 px-1">{errors.dueDate}</p>}
          </div>

          {/* Amount & Currency */}
          <div>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  if (errors.amount) setErrors({ ...errors, amount: "" });
                }}
                placeholder="Amount"
                className={`flex-1 rounded-xl border bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors ${
                  errors.amount ? "border-red-500/80 focus:border-red-500" : "border-[var(--border)] focus:border-[#5b5fd8]"
                }`}
              />
              
              {/* Custom Currency Dropdown */}
              <div className="relative w-[100px]">
                <div
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className={`w-full h-full rounded-xl border bg-[#121212] px-3 py-3.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                    isCurrencyOpen ? "border-[#5b5fd8]" : "border-[var(--border)] hover:border-[#5b5fd8]/50"
                  }`}
                >
                  {formData.currency}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>

                {isCurrencyOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCurrencyOpen(false)} />
                    <div className="absolute z-20 w-full mt-1 rounded-xl border border-[var(--border)] bg-[#121212] shadow-xl overflow-hidden py-1 animate-fade-in-up">
                      {currencies.map((currency) => (
                        <div
                          key={currency}
                          onClick={() => {
                            setFormData({ ...formData, currency });
                            setIsCurrencyOpen(false);
                          }}
                          className="px-4 py-2.5 text-sm cursor-pointer text-white hover:bg-[#5b5fd8] transition-colors flex justify-between items-center"
                        >
                          {currency}
                          {formData.currency === currency && (
                            <span className="text-xs text-white/50">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {errors.amount && <p className="text-[#ef4444] text-xs mt-1.5 px-1">{errors.amount}</p>}
          </div>

          {/* Custom Reminder Dropdown */}
          <div className="pt-2 space-y-2">
            <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase">
              Reminder Setting
            </label>
            <div className="relative">
              <div
                onClick={() => setIsReminderOpen(!isReminderOpen)}
                className={`w-full rounded-xl border bg-[#121212] px-4 py-3.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                  isReminderOpen ? "border-[#5b5fd8]" : "border-[var(--border)] hover:border-[#5b5fd8]/50"
                }`}
              >
                {reminders.find(r => r.value === formData.reminderSetting)?.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>

                      {isReminderOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsReminderOpen(false)} />
                          <div className="absolute z-20 w-full mt-1 rounded-xl border border-[var(--border)] bg-[#121212] shadow-xl overflow-hidden py-1 animate-fade-in-up">
                            {reminders.map((reminder) => (
                              <div
                                key={reminder.value}
                                onClick={() => {
                                  setFormData({ ...formData, reminderSetting: reminder.value });
                                  setIsReminderOpen(false);
                                }}
                                className="px-4 py-3 text-sm cursor-pointer text-white hover:bg-[#5b5fd8] transition-colors flex justify-between items-center"
                              >
                                {reminder.label}
                                {formData.reminderSetting === reminder.value && (
                                  <span className="text-xs text-white/50">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--border)] bg-transparent px-6 py-2.5 text-sm font-medium text-[#aaa] hover:text-white hover:border-[#666] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#5b5fd8] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#4a4ec4] transition-colors shadow-lg cursor-pointer"
            >
              {editingRenewal ? "Save changes" : "Save renewal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}