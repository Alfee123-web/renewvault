"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Renewal } from "@/lib/types";
import { getExchangeRates } from "@/app/actions/rates";
import { createWorker } from "tesseract.js";
import {
  categoryKey,
  findExistingCategory,
  getUniqueCategories,
  normalizeCategory,
} from "@/lib/categories";
import {
  PREDEFINED_SERVICES,
  CUSTOM_SERVICE,
  detectServiceFromText,
  searchServices,
  type PredefinedService,
} from "@/lib/services";

const MAX_SPLIT = 10;

interface AddRenewalModalProps {
  onClose: () => void;
  onAdd: (renewal: Renewal) => void;
  onUpdate: (renewal: Renewal) => void;
  editingRenewal: Renewal | null;
  renewals?: Renewal[];
  onSwitchToEdit?: (renewal: any) => void;
}

/** Turns "https://www.notion.so/pricing" or "notion.so" into "notion.so". */
function cleanWebsiteDomain(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return "";
  return trimmed
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0]
    .trim();
}

// --- ICONS ---
function LayersIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>; }
function TagIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7-7A2 2 0 0 0 12 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 .59 1.41l7 7a2 2 0 0 0 2.83 0l8-8a2 2 0 0 0 0-2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>; }
function GlobeIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>; }
function CalendarMinimalIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>; }
function ChevronLeftIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>; }
function ChevronRightIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>; }
function ChevronUpSmallIcon() { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>; }
function ChevronDownSmallIcon() { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>; }
function AlertIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>; }
function InfoIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>; }
function UsersMinimalIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function MinusIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function PlusIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>; }
function UploadCloudIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>; }
function XSmallIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>; }
function CheckIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12"></polyline></svg>; }

const inputBase =
  "w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors";
const inputOk = "border-[var(--border)] focus:border-[#5b5fd8]";
const inputError = "border-red-500/80 focus:border-red-500";
const labelClass = "text-[11px] font-bold text-[#888] tracking-widest uppercase mb-1.5 block";

export default function AddRenewalModal({
  onClose,
  onAdd,
  onUpdate,
  editingRenewal,
  renewals,
  onSwitchToEdit,
}: AddRenewalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    dueDate: "",
    amount: "",
    currency: "USD",
    billingCycle: "monthly",
    reminderDaysBefore: [] as number[],
    websiteDomain: "",
    splitCount: 1,
  });

  // UI State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [serviceQuery, setServiceQuery] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(["USD", "EUR", "GBP", "INR"]);

  // Receipt Upload & Local OCR State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calendar Navigation State
  const [calDate, setCalDate] = useState(new Date());

  const billingCycles = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  useEffect(() => {
    async function loadCurrencies() {
      try {
        const rates = await getExchangeRates();
        setAvailableCurrencies(Object.keys(rates).sort());
      } catch (error) {
        console.error("Failed to load exchange rates for modal", error);
      }
    }
    loadCurrencies();
  }, []);

  const getTodayStr = () => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  };
  const todayStr = getTodayStr();

  const knownCategories = useMemo(
    () =>
      getUniqueCategories([
        ...PREDEFINED_SERVICES.map((s) => s.category),
        ...(renewals ?? []).map((r) => r.category),
      ]),
    [renewals]
  );

  const existingCategoryMatch = useMemo(
    () => (formData.category.trim() ? findExistingCategory(formData.category, knownCategories) : null),
    [formData.category, knownCategories]
  );

  const showCategoryField = isCustom || (formData.name.trim() !== "" && !formData.category.trim());

  const previewDomain = useMemo(() => {
    const cleaned = cleanWebsiteDomain(formData.websiteDomain);
    return cleaned.includes(".") ? cleaned : "";
  }, [formData.websiteDomain]);

  useEffect(() => {
    if (editingRenewal) {
      const isKnown = PREDEFINED_SERVICES.some((s) => s.domain === editingRenewal.websiteDomain);
      setIsCustom(!isKnown);

      setFormData({
        name: editingRenewal.name,
        category: editingRenewal.category,
        dueDate: editingRenewal.dueDate,
        amount: editingRenewal.amount.toString(),
        currency: editingRenewal.currency,
        billingCycle: editingRenewal.billingCycle || "monthly",
        reminderDaysBefore: editingRenewal.reminderDaysBefore || [],
        websiteDomain: editingRenewal.websiteDomain || "",
        splitCount:
          editingRenewal.splitCount && editingRenewal.splitCount > 1
            ? editingRenewal.splitCount
            : 1,
      });

      if (editingRenewal.dueDate) {
        setCalDate(new Date(editingRenewal.dueDate));
      }
    } else {
      setIsCustom(false);
    }
  }, [editingRenewal]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG).");
      return;
    }
    setReceiptFile(file);
    const objectUrl = URL.createObjectURL(file);
    setReceiptPreview(objectUrl);

    try {
      setIsAnalyzing(true);

      const worker = await createWorker("eng");
      const ret = await worker.recognize(file);
      await worker.terminate();

      const text = ret.data.text;

      let detectedName = formData.name;
      let detectedDomain = formData.websiteDomain;
      let detectedCategory = formData.category;

      const matchedService = detectServiceFromText(text);
      if (matchedService) {
        detectedName = matchedService.name;
        detectedDomain = matchedService.domain;
        detectedCategory = matchedService.category;
      }

      const amountRegex = /(?:[\$€£₹¥USD|EUR|GBP|INR]\s*)?(\d{1,5}[,.]\d{2})/i;
      const amountMatch = text.match(amountRegex);
      const parsedAmount = amountMatch ? amountMatch[1].replace(",", ".") : formData.amount;

      let parsedCurrency = formData.currency;
      if (/EUR|€/i.test(text)) parsedCurrency = "EUR";
      else if (/GBP|£/i.test(text)) parsedCurrency = "GBP";
      else if (/INR|₹/i.test(text)) parsedCurrency = "INR";
      else if (/USD|\$/i.test(text)) parsedCurrency = "USD";

      let parsedDueDate = formData.dueDate;
      const dateRegex = /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]*\d{4})|(\d{4}[-/]\d{2}[-/]\d{2})|(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i;
      const dateMatch = text.match(dateRegex);

      if (dateMatch) {
        const parsedDateObj = new Date(dateMatch[0]);
        if (!isNaN(parsedDateObj.getTime())) {
          parsedDueDate = parsedDateObj.toISOString().split("T")[0];
        }
      }

      setFormData((prev) => ({
        ...prev,
        name: detectedName || prev.name,
        category: detectedCategory || prev.category,
        websiteDomain: detectedDomain || prev.websiteDomain,
        amount: parsedAmount,
        currency: parsedCurrency,
        dueDate: parsedDueDate,
      }));

      if (detectedDomain) {
        setIsCustom(false);
      }

      setErrors({});
    } catch (err) {
      console.error("Local OCR Parsing Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReceiptFile(null);
    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const duplicateRenewal = useMemo(() => {
    if (editingRenewal) return null;
    if (!formData.name.trim() && !formData.websiteDomain) return null;
    const list = renewals ?? [];
    const cleanedDomain = cleanWebsiteDomain(formData.websiteDomain);
    return (
      list.find((r) => {
        if (r.status === "cancelled") return false;
        const domainMatch =
          cleanedDomain && r.websiteDomain && r.websiteDomain.toLowerCase() === cleanedDomain;
        const nameMatch =
          formData.name.trim() &&
          r.name.trim().toLowerCase() === formData.name.trim().toLowerCase();
        return domainMatch || nameMatch;
      }) || null
    );
  }, [formData.name, formData.websiteDomain, renewals, editingRenewal]);

  const splitShareLabel = useMemo(() => {
    const amount = parseFloat(formData.amount);
    if (formData.splitCount <= 1 || !amount || amount <= 0) return null;
    const share = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: formData.currency || "USD",
    }).format(amount / formData.splitCount);
    return `${share} each`;
  }, [formData.amount, formData.currency, formData.splitCount]);

  const handleSplitStep = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      splitCount: Math.min(MAX_SPLIT, Math.max(1, prev.splitCount + delta)),
    }));
  };

  const filteredServices = useMemo(() => searchServices(serviceQuery), [serviceQuery]);

  const handleSelectService = (service: PredefinedService) => {
    setIsCustom(false);
    setFormData({
      ...formData,
      name: service.name,
      category: service.category,
      websiteDomain: service.domain,
    });
    setIsServiceOpen(false);
    setServiceQuery("");
    if (errors.name || errors.category) setErrors({ ...errors, name: "", category: "" });
  };

  const handleSelectCustom = () => {
    setIsCustom(true);
    setFormData({ ...formData, name: "", category: "", websiteDomain: "" });
    setIsServiceOpen(false);
    setServiceQuery("");
    if (errors.name || errors.category) setErrors({ ...errors, name: "", category: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Please select a service or enter a custom name.";
    if (!formData.category.trim()) newErrors.category = "Please choose or enter a category.";
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required.";
    } else if (!editingRenewal && formData.dueDate < todayStr) {
      newErrors.dueDate = "Invalid date — please select today or a future date.";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = "Valid amount is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalCategory =
      findExistingCategory(formData.category, knownCategories) ?? normalizeCategory(formData.category);

    const newRenewal: Renewal = {
      id: editingRenewal ? editingRenewal.id : Math.random().toString(36).substring(7),
      name: formData.name.trim(),
      category: finalCategory,
      dueDate: formData.dueDate,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      billingCycle: formData.billingCycle,
      websiteDomain: cleanWebsiteDomain(formData.websiteDomain),
      splitCount: formData.splitCount,
      status: editingRenewal ? editingRenewal.status : "upcoming",
      reminderEnabled: formData.reminderDaysBefore.length > 0,
      reminderDaysBefore: formData.reminderDaysBefore,
    };

    if (editingRenewal) onUpdate(newRenewal);
    else onAdd(newRenewal);

    onClose();
  };

  const handleAmountStep = (delta: number) => {
    const current = parseFloat(formData.amount) || 0;
    const next = Math.max(0, current + delta);
    setFormData({
      ...formData,
      amount: next > 0 ? next.toFixed(2).replace(/\.00$/, "") : "",
    });
    if (errors.amount) setErrors({ ...errors, amount: "" });
  };

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = calDate.toLocaleString("default", { month: "long" });
  const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleSelectDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (formattedDate < todayStr) {
      setErrors({ ...errors, dueDate: "Invalid date — please select today or a future date." });
      return;
    }
    setFormData({ ...formData, dueDate: formattedDate });
    setIsCalendarOpen(false);
    if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="flex flex-col w-full max-w-[540px] max-h-[94vh] rounded-2xl border border-[var(--border)] bg-[#121212] shadow-2xl animate-fade-in-up overflow-hidden">

        {/* --- STICKY HEADER --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]/70 shrink-0">
          <h2 className="text-lg font-bold text-white">
            {editingRenewal ? "Edit renewal" : "Add renewal"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
          >
            <XSmallIcon />
          </button>
        </div>

        {/* --- SCROLLABLE FORM BODY --- */}
        <form id="renewal-form" onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* --- COMPACT RECEIPT UPLOAD BANNER --- */}
          {!editingRenewal && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !receiptFile && fileInputRef.current?.click()}
              className={`relative flex items-center gap-3.5 w-full px-4 py-3 rounded-xl border border-dashed transition-all ${
                receiptFile
                  ? "border-zinc-700 bg-zinc-900/60"
                  : isDragging
                  ? "border-[#5b5fd8] bg-[#5b5fd8]/10"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40 cursor-pointer"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              {receiptPreview ? (
                <>
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
                    <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                      {isAnalyzing ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" /> Scanning receipt locally...
                        </>
                      ) : (
                        <>
                          <CheckIcon /> Auto-filled from receipt
                        </>
                      )}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{receiptFile?.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeReceipt}
                    className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <XSmallIcon />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 shrink-0">
                    <UploadCloudIcon />
                  </div>
                  <div className="min-w-0 pointer-events-none">
                    <p className="text-sm font-medium text-zinc-200 leading-tight">
                      Auto-fill from receipt
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Drag &amp; drop an image, or click to browse
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* --- SERVICE DROPDOWN --- */}
          <div className={`relative ${isServiceOpen ? "z-50" : "z-40"}`}>
            <label className={labelClass}>Service / Subscription</label>
            <div
              onClick={() => { setIsServiceOpen(!isServiceOpen); setServiceQuery(""); }}
              className={`w-full rounded-xl border bg-[#121212] px-3.5 py-2.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                errors.name
                  ? "border-red-500/80"
                  : isServiceOpen
                  ? "border-[#5b5fd8]"
                  : "border-[var(--border)] hover:border-[#5b5fd8]/50"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {previewDomain ? (
                  <img src={`https://www.google.com/s2/favicons?domain=${previewDomain}&sz=64`} alt="logo" className="w-5 h-5 rounded-full bg-white object-contain p-0.5 shrink-0" />
                ) : (
                  <span className="text-zinc-400 shrink-0"><LayersIcon /></span>
                )}
                <span className={`truncate ${formData.name ? "text-white" : "text-zinc-500"}`}>
                  {isCustom ? (formData.name || "Other (Custom)") : (formData.name || "Select a popular service...")}
                </span>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888] shrink-0">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            {errors.name && !isCustom && <p className="text-[#ef4444] text-xs mt-1 px-1">{errors.name}</p>}

            {duplicateRenewal && (
              <div className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 flex items-start gap-2.5 animate-fade-in-up">
                <span className="text-amber-400 mt-0.5 shrink-0"><AlertIcon /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-200 leading-snug">
                    You already have <span className="font-semibold">{duplicateRenewal.name}</span> tracked
                    {duplicateRenewal.dueDate && (
                      <> (due {new Date(duplicateRenewal.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})</>
                    )}.
                  </p>
                  <button
                    type="button"
                    onClick={() => onSwitchToEdit?.(duplicateRenewal)}
                    className="mt-1 text-xs font-semibold text-amber-300 underline hover:text-amber-100 transition-colors cursor-pointer"
                  >
                    Edit existing instead
                  </button>
                </div>
              </div>
            )}

            {isServiceOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => {
                    setIsServiceOpen(false);
                    setServiceQuery("");
                  }}
                />
                <div className="absolute z-20 w-full mt-1.5 overflow-hidden rounded-xl border border-[var(--border)] bg-[#121212] shadow-xl animate-fade-in-up">
                  <div className="border-b border-[var(--border)] p-2">
                    <input
                      type="text"
                      value={serviceQuery}
                      onChange={(e) => setServiceQuery(e.target.value)}
                      placeholder="Search services..."
                      autoFocus={typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches}
                      className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-[#888] focus:outline-none focus:border-[#5b5fd8] transition-colors"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {filteredServices.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-zinc-500">
                        No match for &ldquo;{serviceQuery}&rdquo;. Use &ldquo;Other (Custom)&rdquo; below.
                      </p>
                    ) : (
                      filteredServices.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleSelectService(service)}
                          className="px-3 py-2 flex items-center gap-3 hover:bg-[#5b5fd8] rounded-lg cursor-pointer transition-colors"
                        >
                          <img src={`https://www.google.com/s2/favicons?domain=${service.domain}&sz=64`} alt="" className="w-5 h-5 rounded-full bg-white object-contain p-0.5" />
                          <div className="flex flex-col">
                            <span className="text-sm text-white">{service.name}</span>
                            <span className="text-[10px] text-zinc-400">{service.category}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-[var(--border)] p-1">
                    <div
                      onClick={handleSelectCustom}
                      className="px-3 py-2 flex items-center gap-3 hover:bg-[#5b5fd8] rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="text-zinc-400"><TagIcon /></span>
                      <span className="text-sm text-white">{CUSTOM_SERVICE.name}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* --- CUSTOM DETAILS (Name + Website URL + Category) --- */}
          {(isCustom || showCategoryField) && (
            <div className="space-y-3 pt-2 border-t border-[var(--border)]/50 animate-fade-in-up">
              {isCustom && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Custom Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      placeholder="e.g. Gym Membership"
                      className={`${inputBase} ${errors.name ? inputError : inputOk}`}
                    />
                    {errors.name && <p className="text-[#ef4444] text-xs mt-1 px-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Website URL (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center">
                        {previewDomain ? (
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${previewDomain}&sz=64`}
                            alt=""
                            className="w-4 h-4 rounded-sm bg-white object-contain p-0.5"
                          />
                        ) : (
                          <GlobeIcon />
                        )}
                      </span>
                      <input
                        type="text"
                        value={formData.websiteDomain}
                        onChange={(e) => setFormData({ ...formData, websiteDomain: e.target.value })}
                        placeholder="e.g. notion.so"
                        className={`${inputBase} ${inputOk} pl-9`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (errors.category) setErrors({ ...errors, category: "" });
                  }}
                  placeholder="e.g. Health, Productivity"
                  className={`${inputBase} ${errors.category ? inputError : inputOk}`}
                />
                {errors.category && <p className="text-[#ef4444] text-xs mt-1 px-1">{errors.category}</p>}

                {existingCategoryMatch && (
                  <div className="mt-2 rounded-xl border border-[#5b5fd8]/30 bg-[#5b5fd8]/10 px-3 py-2 flex items-start gap-2 animate-fade-in-up">
                    <span className="text-[#8b8df1] mt-0.5 shrink-0"><InfoIcon /></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-indigo-100 leading-snug">
                        <span className="font-semibold">{existingCategoryMatch}</span> already exists — this renewal will be added to it.
                      </p>
                      {formData.category !== existingCategoryMatch && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: existingCategoryMatch });
                            if (errors.category) setErrors({ ...errors, category: "" });
                          }}
                          className="mt-1 text-xs font-semibold text-[#8b8df1] underline hover:text-white transition-colors cursor-pointer"
                        >
                          Use &ldquo;{existingCategoryMatch}&rdquo;
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {knownCategories.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {knownCategories.map((cat) => {
                      const active = categoryKey(formData.category) === categoryKey(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: cat });
                            if (errors.category) setErrors({ ...errors, category: "" });
                          }}
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? "border-[#5b5fd8] bg-[#5b5fd8]/20 text-white"
                              : "border-[var(--border)] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- DUE DATE + AMOUNT & CURRENCY --- */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 relative ${isCalendarOpen || isCurrencyOpen ? "z-50" : "z-30"}`}>
            {/* Due Date */}
            <div className="relative">
              <label className={labelClass}>Due Date</label>
              <div
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`w-full rounded-xl border bg-[#121212] px-3.5 py-2.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                  errors.dueDate
                    ? "border-red-500/80"
                    : isCalendarOpen
                    ? "border-[#5b5fd8]"
                    : "border-[var(--border)] hover:border-[#5b5fd8]/50"
                }`}
              >
                <div className="flex items-center gap-2 text-zinc-300 min-w-0">
                  <span className="text-zinc-400 shrink-0"><CalendarMinimalIcon /></span>
                  <span className="truncate">
                    {formData.dueDate
                      ? new Date(formData.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Select date..."}
                  </span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888] shrink-0">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              {errors.dueDate && <p className="text-[#ef4444] text-xs mt-1 px-1">{errors.dueDate}</p>}

              {isCalendarOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCalendarOpen(false)} />
                  <div className={`absolute z-20 left-0 w-72 rounded-2xl border border-[var(--border)] bg-[#121212] p-3.5 shadow-2xl animate-fade-in-up ${isCustom ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white">
                        {monthName} {year}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCalDate(new Date(year, month - 1, 1))}
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <ChevronLeftIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalDate(new Date(year, month + 1, 1))}
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <ChevronRightIcon />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 mb-1.5">
                      {DAYS_OF_WEEK.map((d) => (
                        <div key={d} className="text-center text-[10px] font-bold text-zinc-500 uppercase">
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = formData.dueDate === dateStr;
                        const isPast = dateStr < todayStr;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleSelectDay(day)}
                            className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#5b5fd8] text-white font-bold shadow-md"
                                : isPast
                                ? "text-zinc-700 hover:bg-zinc-800/50 hover:text-zinc-500"
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

            {/* Amount & Currency */}
            <div>
              <label className={labelClass}>Amount</label>
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => {
                      setFormData({ ...formData, amount: e.target.value });
                      if (errors.amount) setErrors({ ...errors, amount: "" });
                    }}
                    placeholder="0.00"
                    className={`w-full rounded-xl border bg-transparent pl-3.5 pr-8 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      errors.amount ? "border-red-500/80 focus:border-red-500" : "border-[var(--border)] focus:border-[#5b5fd8]"
                    }`}
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleAmountStep(1)}
                      className="text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer p-0.5"
                    >
                      <ChevronUpSmallIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAmountStep(-1)}
                      className="text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer p-0.5"
                    >
                      <ChevronDownSmallIcon />
                    </button>
                  </div>
                </div>

                <div className="relative w-[84px] shrink-0">
                  <div
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className={`w-full h-full rounded-xl border bg-[#121212] px-2.5 py-2.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                      isCurrencyOpen ? "border-[#5b5fd8]" : "border-[var(--border)] hover:border-[#5b5fd8]/50"
                    }`}
                  >
                    {formData.currency}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>

                  {isCurrencyOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsCurrencyOpen(false)} />
                      <div className={`absolute right-0 z-20 min-w-[110px] max-h-44 overflow-y-auto rounded-xl border border-[var(--border)] bg-[#121212] shadow-xl py-1 animate-fade-in-up [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full ${isCustom ? "bottom-full mb-1" : "top-full mt-1"}`}>
                        {availableCurrencies.map((currency) => (
                          <div
                            key={currency}
                            onClick={() => {
                              setFormData({ ...formData, currency });
                              setIsCurrencyOpen(false);
                            }}
                            className="px-3.5 py-2 text-sm cursor-pointer text-white hover:bg-[#5b5fd8] transition-colors flex justify-between items-center"
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
              {errors.amount && <p className="text-[#ef4444] text-xs mt-1 px-1">{errors.amount}</p>}
            </div>
          </div>

          {/* --- SPLIT WITH + BILLING CYCLE --- */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 relative ${isBillingOpen ? "z-50" : "z-20"}`}>
            {/* Split With */}
            <div>
              <label className={labelClass}>Split With</label>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[#121212] px-3 py-1.5 min-h-[42px]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-zinc-400 shrink-0"><UsersMinimalIcon /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {formData.splitCount === 1
                        ? "Just me"
                        : `You + ${formData.splitCount - 1}`}
                    </p>
                    {splitShareLabel && (
                      <p className="text-[11px] font-medium text-[#8b8df1] truncate">{splitShareLabel}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSplitStep(-1)}
                    disabled={formData.splitCount <= 1}
                    aria-label="Decrease people sharing"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] text-zinc-400 hover:text-white hover:border-[#5b5fd8]/60 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <MinusIcon />
                  </button>
                  <span className="w-4 text-center text-xs font-semibold text-white">
                    {formData.splitCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSplitStep(1)}
                    disabled={formData.splitCount >= MAX_SPLIT}
                    aria-label="Increase people sharing"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] text-zinc-400 hover:text-white hover:border-[#5b5fd8]/60 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className={labelClass}>Billing Cycle</label>
              <div className="relative">
                <div
                  onClick={() => setIsBillingOpen(!isBillingOpen)}
                  className={`w-full rounded-xl border bg-[#121212] px-3.5 py-2.5 text-sm text-white cursor-pointer flex justify-between items-center transition-colors ${
                    isBillingOpen ? "border-[#5b5fd8]" : "border-[var(--border)] hover:border-[#5b5fd8]/50"
                  }`}
                >
                  {billingCycles.find((b) => b.value === formData.billingCycle)?.label}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#888]">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {isBillingOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsBillingOpen(false)} />
                    <div className="absolute bottom-full mb-1 z-20 w-full rounded-xl border border-[var(--border)] bg-[#121212] shadow-xl overflow-hidden py-1 animate-fade-in-up">
                      {billingCycles.map((cycle) => (
                        <div
                          key={cycle.value}
                          onClick={() => {
                            setFormData({ ...formData, billingCycle: cycle.value });
                            setIsBillingOpen(false);
                          }}
                          className="px-3.5 py-2.5 text-sm cursor-pointer text-white hover:bg-[#5b5fd8] transition-colors flex justify-between items-center"
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
          </div>

        
   {/* --- REMINDER SETTINGS (Inline Pills) --- */}
          <div>
            <label className={labelClass}>Reminder Settings</label>
            <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-3">
              {[1, 7, 30].map((days) => {
                const isSelected = formData.reminderDaysBefore.includes(days);
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        reminderDaysBefore: isSelected
                          ? formData.reminderDaysBefore.filter((d) => d !== days)
                          : [...formData.reminderDaysBefore, days].sort((a, b) => a - b),
                      });
                    }}
                    className={`flex flex-1 min-w-[115px] items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#5b5fd8] bg-[#5b5fd8]/15 text-white"
                        : "border-[var(--border)] bg-[#121212] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-[#5b5fd8] border-[#5b5fd8]" : "border-zinc-600"}`}>
                      {isSelected && <span className="text-[9px] text-white font-bold leading-none">✓</span>}
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap">
                      {days} {days === 1 ? "day" : "days"} before
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* --- STICKY FOOTER --- */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[var(--border)]/70 bg-[#121212] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] bg-transparent px-5 py-2 text-sm font-medium text-[#aaa] hover:text-white hover:border-[#666] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="renewal-form"
            className="rounded-full bg-[#5b5fd8] px-6 py-2 text-sm font-medium text-white hover:bg-[#4a4ec4] transition-colors shadow-lg cursor-pointer"
          >
            {editingRenewal ? "Save changes" : "Save renewal"}
          </button>
        </div>
      </div>
    </div>
  );
}