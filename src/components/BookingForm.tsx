import { useState } from "react";
import { Check, Stethoscope, MapPin, Phone, User, ChevronDown, Activity } from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const SERVICES = [
  "Home Haemodialysis",
  "HDF (Haemodialfiltration) At-home",
  "Peritoneal Dialysis",
  "ANM/GNM Nurse",
];

// Maps display service name → CRM ENUM value stored in leads.service
const SERVICE_TO_CRM: Record<string, string> = {
  "Home Haemodialysis":                "haemodialysis",
  "HDF (Haemodialfiltration) At-home": "hdf",
  "Peritoneal Dialysis":               "peritoneal",
  "ANM/GNM Nurse":                     "nursing",
};

const CITIES = ["Mumbai", "Pune", "Nashik", "Ahmedabad", "Delhi", "Other"];

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://crm-api.renalease.com/api/public/website-booking"
    : "http://localhost:5000/api/public/website-booking";

// ─── Component ────────────────────────────────────────────────────────────────

const BookingForm = () => {
  const [formData, setFormData] = useState({
    service:      "",
    name:         "",
    mobile:       "",
    city:         "",
    customCity:   "",
    nephrologist: "",
    onDialysis:   null as boolean | null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);

  const set = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const resolvedCity =
    formData.city === "Other" ? formData.customCity.trim() : formData.city;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.service) {
      setError("Please select a service.");
      return;
    }

    if (formData.city === "Other" && !formData.customCity.trim()) {
      setError("Please enter your city name.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name:    formData.name.trim(),
        phone:   formData.mobile.replace(/\D/g, ""),
        // CRM ENUM value: "haemodialysis" | "hdf" | "peritoneal" | "nursing"
        service:           SERVICE_TO_CRM[formData.service] ?? "other",
        // Exact display name stored separately for CRM staff readability
        requested_service: formData.service,
        notes: [
          `Requested service: ${formData.service}`,
          `City: ${resolvedCity}`,
          `Nephrologist: ${formData.nephrologist || "Not provided"}`,
          `Currently on dialysis: ${
            formData.onDialysis === null
              ? "Not answered"
              : formData.onDialysis
              ? "Yes"
              : "No"
          }`,
        ].join("\n"),
      };

      const res  = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to submit booking");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
    setFormData({
      service: "", name: "", mobile: "", city: "",
      customCity: "", nephrologist: "", onDialysis: null,
    });
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl shadow-emerald-900/30">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-5 py-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 text-white stroke-[3]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Request Received!</h3>
              <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
                Our care team will reach out within{" "}
                <span className="font-bold text-white">2 hours</span>. Thank you for choosing RenalEase.
              </p>
            </div>
            {formData.service && (
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <span className="text-white font-bold text-sm">{formData.service}</span>
              </div>
            )}
            <button
              onClick={resetForm}
              className="mt-2 text-sm text-emerald-100 font-semibold hover:text-white underline underline-offset-2 transition-colors"
            >
              Submit another request
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto lg:mx-0">
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-2xl shadow-black/10">

        {/* Coloured top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500" />

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/30">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Available Now</span>
              </div>
              <h3 className="text-lg font-black text-foreground leading-tight">Book a Service</h3>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-sm font-medium">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              {error}
            </div>
          )}

          {/* ── Service Cards ──────────────────────────────────────────────── */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              Select Service <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map((svc) => {
                const selected = formData.service === svc;
                const icons: Record<string, string> = {
                  "Home Haemodialysis":                "🩸",
                  "HDF (Haemodialfiltration) At-home": "💉",
                  "Peritoneal Dialysis":               "🫀",
                  "ANM/GNM Nurse":                     "👩‍⚕️",
                };
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, service: svc }))}
                    className={`relative text-left p-3.5 rounded-2xl border-2 transition-all duration-200 ${
                      selected
                        ? "border-primary bg-primary/8 shadow-md shadow-primary/15"
                        : "border-border bg-card hover:border-primary/40 hover:bg-primary/3"
                    }`}
                  >
                    {selected && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground stroke-[3]" />
                      </span>
                    )}
                    <div className="text-xl mb-1.5">{icons[svc] ?? "🏥"}</div>
                    <div className={`text-xs font-black leading-tight ${selected ? "text-primary" : "text-foreground"}`}>
                      {svc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Name ──────────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
              <User className="w-3 h-3" /> Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={set("name")}
              className="w-full h-12 px-4 bg-input-bg border-2 border-border rounded-xl text-foreground text-[15px] font-medium placeholder:text-muted-foreground/40 focus:ring-0 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* ── Mobile ────────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="tel"
              placeholder="98765 43210"
              value={formData.mobile}
              onChange={set("mobile")}
              className="w-full h-12 px-4 bg-input-bg border-2 border-border rounded-xl text-foreground text-[15px] font-medium placeholder:text-muted-foreground/40 focus:ring-0 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* ── City ──────────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={formData.city}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    city:       val,
                    customCity: val !== "Other" ? "" : prev.customCity,
                  }));
                }}
                className="w-full h-12 px-4 pr-10 bg-input-bg border-2 border-border rounded-xl text-foreground text-[15px] font-medium focus:ring-0 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your city</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {formData.city === "Other" && (
              <input
                required
                type="text"
                placeholder="Enter your city name"
                value={formData.customCity}
                onChange={set("customCity")}
                autoFocus
                className="w-full h-12 px-4 bg-input-bg border-2 border-primary/50 rounded-xl text-foreground text-[15px] font-medium placeholder:text-muted-foreground/40 focus:ring-0 focus:border-primary outline-none transition-all"
              />
            )}
          </div>

          {/* ── Nephrologist ──────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              Nephrologist Name{" "}
              <span className="normal-case font-normal tracking-normal text-muted-foreground/50">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Dr. Name"
              value={formData.nephrologist}
              onChange={set("nephrologist")}
              className="w-full h-12 px-4 bg-input-bg border-2 border-border rounded-xl text-foreground text-[15px] font-medium placeholder:text-muted-foreground/40 focus:ring-0 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* ── Dialysis toggle ────────────────────────────────────────────── */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Currently on dialysis?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: true,  label: "Yes", icon: "✓", activeClass: "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100" },
                { val: false, label: "No",  icon: "✗", activeClass: "border-slate-500  bg-slate-50  text-slate-700  shadow-md shadow-slate-100" },
              ].map(({ val, label, icon, activeClass }) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, onDialysis: val }))}
                  className={`h-12 rounded-xl border-2 text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 ${
                    formData.onDialysis === val
                      ? activeClass
                      : "border-border bg-input-bg text-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="text-base leading-none">{formData.onDialysis === val ? icon : ""}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className={`w-full h-14 relative overflow-hidden rounded-2xl font-black text-[15px] tracking-wide transition-all duration-200 active:scale-[0.98] ${
              loading
                ? "bg-primary/60 text-primary-foreground cursor-not-allowed"
                : "bg-primary hover:brightness-110 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
            }`}
          >
            {!loading && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
            )}
            <span className="relative">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Submitting…
                </span>
              ) : (
                "Submit Requirement →"
              )}
            </span>
          </button>

          {/* Trust line */}
          <p className="text-center text-[11px] text-muted-foreground font-medium">
            🔒 Your information is safe &amp; confidential
          </p>

        </div>
      </div>
    </div>
  );
};

export default BookingForm;