import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRequestPortalAccess } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "wouter";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  studentOf: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function PortalAccess() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { mutate: requestAccess, isPending, isSuccess } = useRequestPortalAccess();

  const onSubmit = (data: FormValues) => {
    requestAccess({ data });
  };

  return (
    <div className="w-full min-h-screen relative flex items-center justify-center px-6">
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/portal-bg.png`}
          alt="Portal Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md glass-panel p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 uppercase">Student Portal</h1>
          <p className="text-muted-foreground">Request access to exclusive lessons, tabs, and resources.</p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-sm">
              Access request submitted successfully. You will receive an email once approved.
            </div>
            {/* For demo purposes, we provide a backdoor link to view the portal UI */}
            <Link href="/portal?demo=true">
              <Button variant="outline" className="w-full text-xs opacity-50">Proceed anyway (Demo Mode)</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <input 
                {...form.register("name")}
                placeholder="Full Name"
                className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-white focus:border-primary outline-none transition-colors"
              />
              {form.formState.errors.name && <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>}
            </div>
            
            <div>
              <input 
                type="email"
                {...form.register("email")}
                placeholder="Email Address"
                className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-white focus:border-primary outline-none transition-colors"
              />
              {form.formState.errors.email && <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>}
            </div>

            <div>
              <input 
                {...form.register("studentOf")}
                placeholder="Are you currently a student? (Optional)"
                className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-white focus:border-primary outline-none transition-colors"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
              Request Access
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
