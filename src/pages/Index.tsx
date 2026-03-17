import BookingForm from "@/components/BookingForm";
import heroImage from "@/assets/hero-dialysis.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Professional nurse caring for a patient during home dialysis treatment"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40 lg:to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Private · Precise · Personal
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-foreground leading-[1.1] tracking-tight">
                Dialysis.<br />
                <span className="font-normal">Refined.</span><br />
                <span className="text-primary font-normal">At Home.</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                Private, personalised and clinically-assured home hemodialysis at the comfort of your home. Because your health deserves the highest standards.
              </p>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-5">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
