"use client";

import { useState, useEffect } from "react";
import { Renewal } from "@/lib/types";

// --- POPULAR SUBSCRIPTIONS TEMPLATES ---
const PREDEFINED_SERVICES = [
  { id: "netflix", name: "Netflix", category: "Entertainment", domain: "netflix.com" },
  { id: "prime", name: "Amazon Prime", category: "Entertainment", domain: "amazon.com" },
  { id: "spotify", name: "Spotify", category: "Entertainment", domain: "spotify.com" },
  { id: "youtube", name: "YouTube Premium", category: "Entertainment", domain: "youtube.com" },
  { id: "chatgpt", name: "ChatGPT Plus", category: "AI & Tools", domain: "openai.com" },
  { id: "claude", name: "Claude Pro", category: "AI & Tools", domain: "anthropic.com" },
  { id: "github", name: "GitHub Copilot", category: "Developer Tools", domain: "github.com" },
  { id: "adobe", name: "Adobe Creative Cloud", category: "Design", domain: "adobe.com" },
  { id: "coursera", name: "Coursera", category: "Education", domain: "coursera.org" },
  { id: "duolingo", name: "Duolingo", category: "Education", domain: "duolingo.com" },
  { id: "xbox", name: "Xbox Game Pass", category: "Gaming", domain: "xbox.com" },
  { id: "custom", name: "Other (Custom)", category: "", domain: "" },
];

interface AddRenewalModalProps {
  onClose: () => void;
  onAdd: (renewal: Renewal) => void;
  onUpdate: (renewal: Renewal) => void;
  editingRenewal: Renewal | null;
}

// --- CLEAN MINIMAL ICONS ---
function LayersIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>; }
function TagIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7-7A2 2 0 0 0 12 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 .59 1.41l7 7a2 2 0 0 0 2.83 0l8-8a2 2 0 0 0 0-2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>; }
function CalendarMinimalIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>; }
function ChevronLeftIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>; }
function ChevronRightIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>; }

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
    billingCycle: "monthly",
    reminderSetting: "none",
    websiteDomain: "",
  });

  // UI State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Calendar Navigation State
  const [calDate, setCalDate] = useState(new Date());

  const currencies = ["USD", "EUR", "GBP", "INR"];
  const billingCycles = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];
  const reminders = [
    { value: "none", label: "No reminder" },
    { value: "1", label: "1 day before" },
    { value: "7", label: "7 days before" },
    { value: "30", label: "30 days before" },
  ];

  useEffect(() => {
    if (editingRenewal) {
      const isKnown = PREDEFINED_SERVICES.some(s => s.domain === editingRenewal.websiteDomain && s.id !== 'custom');
      setIsCustom(!isKnown && !editingRenewal.websiteDomain ? true : !isKnown);

      setFormData({
        name: editingRenewal.name,
        category: editingRenewal.category,
        dueDate: editingRenewal.dueDate,
        amount: editingRenewal.amount.toString(),
        currency: editingRenewal.currency,
        billingCycle: editingRenewal.billingCycle || "monthly",
        reminderSetting: editingRenewal.reminderEnabled
          ? editingRenewal.reminderDaysBefore?.toString() || "none"
          : "none",
        websiteDomain: editingRenewal.websiteDomain || "",
      });

      if (editingRenewal.dueDate) {
        setCalDate(new Date(editingRenewal.dueDate));
      }
    } else {
      setIsCustom(false);
    }
  }, [editingRenewal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Please select a service or enter a custom name.";
    if (isCustom && !formData.category.trim()) newErrors.category = "Category is required.";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required.";
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = "Valid amount is required.";

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
      billingCycle: formData.billingCycle,
      websiteDomain: formData.websiteDomain,
      status: "upcoming", 
      reminderEnabled: formData.reminderSetting !== "none",
      reminderDaysBefore: formData.reminderSetting !== "none" ? parseInt(formData.reminderSetting) : null,
    };

    if (editingRenewal) onUpdate(newRenewal);
    else onAdd(newRenewal);
    
    onClose();
  };

  // Calendar Math Helpers
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = calDate.toLocaleString("default", { month: "long" });
  const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleSelectDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setFormData({ ...formData, dueDate: formattedDate });
    setIsCalendarOpen(false);
    if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[440px] rounded-2xl border border-[var(--border)] bg-[#121212] p-8 shadow-2xl animate-fade-in-up">
        
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {editingRenewal ? "Edit renewal" : "Add renewal"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* --- SERVICE DROPDOWN --- */}
          <div className="relative z-40">
            <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase mb-2 block">
              Service / Subscription
            </label>
            <div
              onClick={() => setIsServiceOpen(!isServiceOpen)}
              className={`w-full rounded-xl border bg-[#121212] px-4 py-3.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                isServiceOpen || errors.name ? "border-[#5b5fd8]" : "border-[var(--border)] hover:border-[#5b5fd8]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                {formData.websiteDomain ? (
                  <img src={`https://www.google.com/s2/favicons?domain=${formData.websiteDomain}&sz=64`} alt="logo" className="w-5 h-5 rounded-full bg-white object-contain p-0.5" />
                ) : formData.name && !isCustom ? (
                   <div className="w-5 h-5 rounded-full bg-zinc-800" />
                ) : (
                   <span className="text-zinc-400"><LayersIcon /></span>
                )}
                <span className={formData.name ? "text-white" : "text-zinc-500"}>
                  {formData.name || "Select a popular service..."}
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
            {errors.name && <p className="text-[#ef4444] text-xs mt-1.5 px-1">{errors.name}</p>}

            {isServiceOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsServiceOpen(false)} />
                <div className="absolute z-20 w-full mt-2 max-h-60 overflow-y-auto rounded-xl border border-[var(--border)] bg-[#121212] shadow-xl p-1 animate-fade-in-up scrollbar-hide">
                  {PREDEFINED_SERVICES.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        if (service.id === "custom") {
                          setIsCustom(true);
                          setFormData({ ...formData, name: "", category: "", websiteDomain: "" });
                        } else {
                          setIsCustom(false);
                          setFormData({
                            ...formData,
                            name: service.name,
                            category: service.category,
                            websiteDomain: service.domain,
                          });
                        }
                        setIsServiceOpen(false);
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      className="px-3 py-2.5 flex items-center gap-3 hover:bg-[#5b5fd8] rounded-lg cursor-pointer transition-colors"
                    >
                      {service.domain ? (
                        <img src={`https://www.google.com/s2/favicons?domain=${service.domain}&sz=64`} alt="" className="w-5 h-5 rounded-full bg-white object-contain p-0.5" />
                      ) : (
                        <span className="text-zinc-400"><TagIcon /></span>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm text-white">{service.name}</span>
                        {service.category && <span className="text-[10px] text-zinc-400">{service.category}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* --- CUSTOM NAME & CATEGORY --- */}
          {isCustom && (
            <div className="grid grid-cols-1 gap-4 pt-2 border-t border-[var(--border)]/50 animate-fade-in-up">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Custom Name (e.g. Gym Membership)"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-[#888] focus:outline-none focus:border-[#5b5fd8] transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Custom Category (e.g. Health)"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-[#888] focus:outline-none focus:border-[#5b5fd8] transition-colors"
                />
              </div>
            </div>
          )}

          {/* --- CUSTOM MINIMAL DUE DATE PICKER --- */}
          <div className="relative z-30">
            <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase mb-2 block">
              Due Date
            </label>
            <div
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`w-full rounded-xl border bg-[#121212] px-4 py-3.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                isCalendarOpen || errors.dueDate ? "border-[#5b5fd8]" : "border-[var(--border)] hover:border-[#5b5fd8]/50"
              }`}
            >
              <div className="flex items-center gap-3 text-zinc-300">
                <span className="text-zinc-400"><CalendarMinimalIcon /></span>
                <span>
                  {formData.dueDate 
                    ? new Date(formData.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
                    : "Select due date..."}
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
            {errors.dueDate && <p className="text-[#ef4444] text-xs mt-1.5 px-1">{errors.dueDate}</p>}

            {isCalendarOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCalendarOpen(false)} />
                <div className="absolute z-20 left-0 w-full mt-2 rounded-2xl border border-[var(--border)] bg-[#121212] p-4 shadow-2xl animate-fade-in-up">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-white">
                      {monthName} {year}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCalDate(new Date(year, month - 1, 1))}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <ChevronLeftIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalDate(new Date(year, month + 1, 1))}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <ChevronRightIcon />
                      </button>
                    </div>
                  </div>

                  {/* Weekday Names */}
                  <div className="grid grid-cols-7 mb-2">
                    {DAYS_OF_WEEK.map((d) => (
                      <div key={d} className="text-center text-[10px] font-bold text-zinc-500 uppercase">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const isSelected = formData.dueDate === dateStr;

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleSelectDay(day)}
                          className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#5b5fd8] text-white font-bold shadow-md"
                              : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* --- AMOUNT & CURRENCY --- */}
          <div className="relative z-20">
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

          <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
            {/* Billing Cycle */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase">
                Billing Cycle
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsBillingOpen(!isBillingOpen)}
                  className={`w-full rounded-xl border bg-[#121212] px-4 py-3.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                    isBillingOpen ? "border-[#5b5fd8]" : "border-[var(--border)] hover:border-[#5b5fd8]/50"
                  }`}
                >
                  {billingCycles.find(b => b.value === formData.billingCycle)?.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>

                {isBillingOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsBillingOpen(false)} />
                    <div className="absolute z-20 w-full mt-1 rounded-xl border border-[var(--border)] bg-[#121212] shadow-xl overflow-hidden py-1 animate-fade-in-up">
                      {billingCycles.map((cycle) => (
                        <div
                          key={cycle.value}
                          onClick={() => {
                            setFormData({ ...formData, billingCycle: cycle.value });
                            setIsBillingOpen(false);
                          }}
                          className="px-4 py-3 text-sm cursor-pointer text-white hover:bg-[#5b5fd8] transition-colors flex justify-between items-center"
                        >
                          {cycle.label}
                          {formData.billingCycle === cycle.value && (
                            <span className="text-xs text-white/50">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Reminder */}
            <div className="space-y-2">
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