import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { QuoteServiceType, useEstimateQuote } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { Link } from "wouter";

const schema = z.object({
  serviceType: z.enum(["mixing", "mastering", "production", "mixing-mastering", "guitar-solo"] as const),
  songCount: z.coerce.number().min(1).max(20),
  projectDescription: z.string().min(10, "Tell us a bit more about the project"),
  genre: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function QuoteBuilder() {
  const [step, setStep] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: "mixing",
      songCount: 1,
      projectDescription: "",
      genre: ""
    }
  });

  const { mutate: getEstimate, data: estimate, isPending } = useEstimateQuote();

  const handleGetEstimate = (data: FormValues) => {
    getEstimate({ data }, {
      onSuccess: () => setStep(2)
    });
  };

  const handleAddToCart = () => {
    if (!estimate) return;
    const values = form.getValues();
    
    addItem({
      type: 'service',
      id: Math.random(),
      name: `${values.serviceType.toUpperCase()} - ${values.songCount} Song(s)`,
      priceEur: estimate.totalPrice,
      quantity: 1,
    });
    setStep(3); // Success step
  };

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">Quote Builder</h1>
        <p className="text-muted-foreground">Get an instant estimate for your next project.</p>
      </div>

      <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={form.handleSubmit(handleGetEstimate)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="text-sm font-bold text-white uppercase tracking-wider">Service Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["mixing", "mastering", "production", "mixing-mastering", "guitar-solo"].map((type) => (
                    <div 
                      key={type}
                      onClick={() => form.setValue("serviceType", type as any)}
                      className={`p-4 border text-center text-sm cursor-pointer uppercase tracking-wider transition-colors ${
                        form.watch("serviceType") === type 
                          ? "border-primary bg-primary/10 text-white" 
                          : "border-white/10 text-muted-foreground hover:border-white/30"
                      }`}
                    >
                      {type.replace("-", " ")}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-white uppercase tracking-wider block mb-4">Number of Songs: {form.watch("songCount")}</label>
                <input 
                  type="range" 
                  min="1" max="20" 
                  {...form.register("songCount")}
                  className="w-full accent-primary bg-white/10 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 pt-4">
                <div>
                  <label className="text-sm font-bold text-white uppercase tracking-wider block mb-2">Genre / Style</label>
                  <input 
                    {...form.register("genre")}
                    className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-white focus:border-primary outline-none transition-colors"
                    placeholder="e.g. Technical Death Metal, Synthwave..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-bold text-white uppercase tracking-wider block mb-2">Project Description</label>
                  <textarea 
                    {...form.register("projectDescription")}
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-white focus:border-primary outline-none transition-colors resize-none"
                    placeholder="Describe your vision, reference tracks, stems state..."
                  />
                  {form.formState.errors.projectDescription && (
                    <p className="text-destructive text-sm mt-1">{form.formState.errors.projectDescription.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full mt-8" isLoading={isPending}>
                Generate Estimate
              </Button>
            </motion.form>
          )}

          {step === 2 && estimate && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Your Estimate</h2>
              
              <div className="py-12 border-y border-white/10 mb-8">
                <span className="font-display text-6xl md:text-7xl font-bold text-white">€{estimate.totalPrice}</span>
                <p className="text-muted-foreground mt-4">Estimated total for {estimate.songCount} song(s) ({estimate.serviceType.replace("-", " ")})</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleAddToCart} size="lg">Add to Cart to Book</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">Added to Cart!</h2>
              <p className="text-muted-foreground mb-8">Your quote has been saved to your cart. Proceed to checkout to secure your spot.</p>
              <Link href="/checkout">
                <Button size="lg">Go to Checkout</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
