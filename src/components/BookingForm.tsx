import { useState } from "react";
import { Check } from "lucide-react";

const services = ["Home Dialysis", "Nursing Care", "Hospital Dialysis", "Equipment"];
const cities = ["Mumbai", "Bangalore", "Delhi", "Chennai"];

const BookingForm = () => {
  const [formData, setFormData] = useState({
    service: "",
    name: "",
    mobile: "",
    city: "",
    nephrologist: "",
    onDialysis: null as boolean | null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // const payload = {
      //   name: formData.name.trim(),
      //   phone: formData.mobile.replace(/\D/g, ""), // clean → 919876543210 format
      //   service: formData.service,
      //   notes: [
      //     `City: ${formData.city}`,
      //     `Nephrologist: ${formData.nephrologist || "Not provided"}`,
      //     `Currently on dialysis: ${formData.onDialysis === null ? "Not answered" : formData.onDialysis ? "Yes" : "No"}`,
      //   ].filter(Boolean).join("\n"),

      const payload = {
  name: formData.name.trim(),
  phone: formData.mobile.replace(/\D/g, ""),
  service: "dialysis",           // ← force one valid ENUM value
  notes: [
    `City: ${formData.city}`,
    `Requested service (original): ${formData.service || "not selected"}`,
    `Nephrologist: ${formData.nephrologist || "Not provided"}`,
    `Currently on dialysis: ${formData.onDialysis === null ? "Not answered" : formData.onDialysis ? "Yes" : "No"}`,
  ].filter(Boolean).join("\n"),

      };

      // Change this URL to match your actual backend domain in production
      const API_URL = process.env.NODE_ENV === "production"
        ? "https://your-backend-domain.com/api/public/website-booking"
        : "http://localhost:5000/api/public/website-booking";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to submit booking");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto lg:mx-0 border border-border shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_10px_20px_-5px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Requirement Received</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our care team will reach out to you shortly. Thank you for choosing RenalEase.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ service: "", name: "", mobile: "", city: "", nephrologist: "", onDialysis: null });
            }}
            className="text-sm text-primary font-medium hover:underline mt-2"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto lg:mx-0 border border-border shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_10px_20px_-5px_rgba(0,0,0,0.08)]">
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary" />
        Book a Service
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ml-1">
            Select Service
          </label>
          <select
            required
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full h-12 px-4 bg-input-bg border border-border rounded-lg text-foreground text-[15px] focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Choose a service</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ml-1">
            Full Name
          </label>
          <input
            required
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-12 px-4 bg-input-bg border border-border rounded-lg text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Mobile */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ml-1">
            Mobile Number
          </label>
          <input
            required
            type="tel"
            placeholder="98765 43210"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full h-12 px-4 bg-input-bg border border-border rounded-lg text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all"
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ml-1">
            City
          </label>
          <select
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full h-12 px-4 bg-input-bg border border-border rounded-lg text-foreground text-[15px] focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled>Select your city</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Nephrologist */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ml-1">
            Nephrologist Name (optional)
          </label>
          <input
            type="text"
            placeholder="Dr. Name"
            value={formData.nephrologist}
            onChange={(e) => setFormData({ ...formData, nephrologist: e.target.value })}
            className="w-full h-12 px-4 bg-input-bg border border-border rounded-lg text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Dialysis Toggle */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ml-1">
            Currently on dialysis?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, onDialysis: true })}
              className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-all ${
                formData.onDialysis === true
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-input-bg border-border text-foreground hover:border-primary/30"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, onDialysis: false })}
              className={`flex-1 h-11 rounded-lg border text-sm font-medium transition-all ${
                formData.onDialysis === false
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-input-bg border-border text-foreground hover:border-primary/30"
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-14 mt-2 bg-primary hover:brightness-110 text-primary-foreground font-bold text-[15px] rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Requirement"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;