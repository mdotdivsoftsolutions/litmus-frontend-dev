import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssistedBooking, STEPS } from "@/components/admin/assisted-booking/useAssistedBooking";
import { StepHeader } from "@/components/admin/assisted-booking/StepHeader";
import { StepCustomer } from "@/components/admin/assisted-booking/StepCustomer";
import { StepItems } from "@/components/admin/assisted-booking/StepItems";
import { StepSamples } from "@/components/admin/assisted-booking/StepSamples";
import { StepLogistics } from "@/components/admin/assisted-booking/StepLogistics";
import { StepPayment } from "@/components/admin/assisted-booking/StepPayment";
import { StepReview } from "@/components/admin/assisted-booking/StepReview";
import { PricingSummary } from "@/components/admin/assisted-booking/PricingSummary";

/** Admin-assisted booking: staff books tests / packages on behalf of a customer. */
export default function AdminNewBookingPage() {
  const state = useAssistedBooking();
  const { step, next, back, goTo, submit, isSubmitting, customer, lines, pricing } = state;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="space-y-5 animate-fade-in pb-20 mx-auto">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9">
          <Link to="/admin/bookings" aria-label="Back to bookings"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Booking</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Book tests or packages for a customer who contacted Litmus directly.</p>
        </div>
      </div>

      <Card><CardContent className="p-3"><StepHeader step={step} onStepClick={goTo} /></CardContent></Card>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <Card className="min-w-0">
          <CardContent className="p-4 sm:p-6 space-y-6">
            {step === 0 && <StepCustomer state={state} />}
            {step === 1 && <StepItems state={state} />}
            {step === 2 && (
              <>
                <StepSamples state={state} />
                <StepLogistics state={state} />
              </>
            )}
            {step === 3 && <StepPayment state={state} />}
            {step === 4 && <StepReview state={state} />}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={back} disabled={step === 0 || isSubmitting} className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {isLast ? (
                <Button onClick={submit} disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Confirm Booking
                </Button>
              ) : (
                <Button onClick={next} className="gap-1">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-4">
          <CardContent className="p-4 space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Customer</p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {customer ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : "Not selected"}
              </p>
              {customer?.email && <p className="text-xs text-slate-500 truncate">{customer.email}</p>}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Order summary ({lines.length} item{lines.length === 1 ? "" : "s"})
              </p>
              {lines.length ? <PricingSummary pricing={pricing} /> : <p className="text-xs text-slate-500">Add tests or packages to see pricing.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
