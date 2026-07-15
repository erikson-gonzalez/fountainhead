"use client";

import type { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminTestimonials } from "@/components/admin/admin-testimonials";
import { AdminAlbums } from "@/components/admin/admin-albums";
import {
  AdminHeroPreview,
  AdminAboutPreview,
  AdminTaglineSeoHelp,
} from "@/components/admin/admin-identity-previews";
import { AdminEndorsements } from "@/components/admin/admin-endorsements";
import { AdminLiveShows } from "@/components/admin/admin-live-shows";
import { Loader2, User, Award, Music, Mail, Quote, ChevronDown, CalendarDays } from "lucide-react";

const DEFAULT_HERO_VIDEO = "https://assets.mixkit.co/videos/3587/3587-720.mp4";
const DEFAULT_HERO_POSTER = "";
const DEFAULT_ABOUT_PORTRAIT = "";

const artistSchema = z.object({
  tagline: z.string().optional(),
  bio: z.string().optional(),
  heroTagline: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  heroPosterUrl: z.string().optional(),
  heroTitlePrefix: z.string().optional(),
  heroTitleHighlight: z.string().optional(),
  heroTitleSuffix: z.string().optional(),
  testimonialsSectionTitle: z.string().optional(),
  testimonialsSectionSubtitle: z.string().optional(),
  aboutHeading: z.string().optional(),
  aboutSubheading: z.string().optional(),
  aboutPortraitUrl: z.string().optional(),
  endorsements: z.string().optional(),
  endorsementsSectionTitle: z.string().optional(),
  musicLinks: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
});

type ArtistFormData = z.infer<typeof artistSchema>;

const FULL_BIO = `Renowned worldwide for his pioneering work on the fretless guitar, Tom Geldschläger (aka Fountainhead) is a multi-instrumentalist, producer, and mixing engineer operating out of his studio in Berlin, Germany.

He has contributed to critically acclaimed records by artists such as Obscura, Defeated Sanity, Ray Riendeau, and many others, bridging the gap between extreme metal, jazz fusion, and cinematic soundscapes.

As an educator, Tom has conducted masterclasses across the globe and built a dedicated community of students exploring advanced guitar techniques and creative production.`;

const DEFAULT_VALUES: ArtistFormData = {
  tagline: "Berlin-based guitarist, producer & mixing engineer",
  bio: FULL_BIO,
  heroTagline: "Berlin-based virtuoso guitarist, producer, and mixing engineer. Pushing boundaries in modern metal.",
  heroVideoUrl: DEFAULT_HERO_VIDEO,
  heroPosterUrl: DEFAULT_HERO_POSTER,
  heroTitlePrefix: "Mastering the",
  heroTitleHighlight: "Fretless",
  heroTitleSuffix: "Dimension",
  testimonialsSectionTitle: "Industry Voices",
  testimonialsSectionSubtitle: "What top artists and students say about working with Fountainhead.",
  aboutHeading: "TOM GELDSCHLÄGER",
  aboutSubheading: "Fountainhead",
  aboutPortraitUrl: DEFAULT_ABOUT_PORTRAIT,
  endorsements: "Aristides, Steinberg, Engl, Neural DSP, Bareknuckle, Elixir, MONO",
  endorsementsSectionTitle: "Official Endorsements",
  musicLinks: "",
  contactEmail: "thefountainhead@gmx.net",
  contactPhone: "03066300766",
  contactAddress: "Scheiblerstrasse 4, 12437 Berlin",
};

export default function AdminArtist() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    fetch("/api/artist-info", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.tagline !== undefined) {
          form.reset({
            tagline: (data.tagline || "").trim() || DEFAULT_VALUES.tagline,
            bio: (data.bio || "").trim() || DEFAULT_VALUES.bio,
            heroTagline: (data.heroTagline ?? "").trim(),
            heroTitlePrefix: (data.heroTitlePrefix ?? "").trim(),
            heroTitleHighlight: (data.heroTitleHighlight ?? "").trim(),
            heroTitleSuffix: (data.heroTitleSuffix ?? "").trim(),
            testimonialsSectionTitle: (data.testimonialsSectionTitle || "").trim() || DEFAULT_VALUES.testimonialsSectionTitle,
            testimonialsSectionSubtitle: (data.testimonialsSectionSubtitle || "").trim() || DEFAULT_VALUES.testimonialsSectionSubtitle,
            aboutHeading: (data.aboutHeading || "").trim() || DEFAULT_VALUES.aboutHeading,
            aboutSubheading: (data.aboutSubheading || "").trim() || DEFAULT_VALUES.aboutSubheading,
            heroVideoUrl: (data.heroVideoUrl || "").trim() || DEFAULT_HERO_VIDEO,
            heroPosterUrl: (data.heroPosterUrl || "").trim() || "",
            aboutPortraitUrl: (data.aboutPortraitUrl || "").trim() || "",
            endorsements: (data.endorsements || "").trim() || DEFAULT_VALUES.endorsements,
            endorsementsSectionTitle: (data.endorsementsSectionTitle || "").trim() || DEFAULT_VALUES.endorsementsSectionTitle,
            musicLinks: (data.musicLinks || "").trim() || "",
            contactEmail: (data.contactEmail || "").trim() || DEFAULT_VALUES.contactEmail,
            contactPhone: (data.contactPhone || "").trim() || DEFAULT_VALUES.contactPhone,
            contactAddress: (data.contactAddress || "").trim() || DEFAULT_VALUES.contactAddress,
          });
        }
      })
      .catch(() => {
        form.reset(DEFAULT_VALUES);
      })
      .finally(() => setLoading(false));
  }, [form]);

  async function onSubmit(data: ArtistFormData) {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/artist-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Error saving");
      }
      await queryClient.invalidateQueries({ queryKey: ["artist-info"] });
      await queryClient.refetchQueries({ queryKey: ["artist-info"] });
      // Reload form to confirm what DB actually has
      const fresh = await fetch("/api/artist-info", { cache: "no-store" }).then(r => r.json());
      if (fresh.tagline !== undefined) {
        form.reset({
          ...form.getValues(),
          heroTagline: (fresh.heroTagline ?? "").trim(),
          heroTitlePrefix: (fresh.heroTitlePrefix ?? "").trim(),
          heroTitleHighlight: (fresh.heroTitleHighlight ?? "").trim(),
          heroTitleSuffix: (fresh.heroTitleSuffix ?? "").trim(),
        });
      }
    } catch {
      form.setError("root", { message: "Error saving. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Artist Information</h1>
        <p className="text-slate-600 mt-1">Edit important titles, endorsements, music and contact details</p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <Tabs defaultValue="identity" className="space-y-6">
            <TabsList className="bg-white border border-slate-200 p-1">
              <TabsTrigger value="identity" className="data-[state=active]:bg-slate-100">
                <User className="w-4 h-4 mr-2" />
                Identity
              </TabsTrigger>
              <TabsTrigger value="endorsements" className="data-[state=active]:bg-slate-100">
                <Award className="w-4 h-4 mr-2" />
                Endorsements
              </TabsTrigger>
              <TabsTrigger value="musica" className="data-[state=active]:bg-slate-100">
                <Music className="w-4 h-4 mr-2" />
                Music
              </TabsTrigger>
              <TabsTrigger value="contacto" className="data-[state=active]:bg-slate-100">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:bg-slate-100">
                <Quote className="w-4 h-4 mr-2" />
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="live-shows" className="data-[state=active]:bg-slate-100">
                <CalendarDays className="w-4 h-4 mr-2" />
                Live Shows
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="mt-0">
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900">Identity</CardTitle>
                  <CardDescription>Main artist information shown on the site. Each section includes a preview.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {/* Hero */}
                  <Collapsible defaultOpen className="group border-b border-slate-200 -mx-6">
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-3 px-6 text-left font-medium text-slate-800 hover:text-slate-900 group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                      <span>Hero (main Home title)</span>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-6 pb-4 pt-2 px-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="heroTitlePrefix"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-700">Before highlight</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="Mastering the" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="heroTitleHighlight"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-700">Highlighted word (red)</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="Fretless" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="heroTitleSuffix"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-700">After highlight</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="Dimension" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="heroTagline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700">Hero subtitle</FormLabel>
                                <FormControl>
                                  <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="Berlin-based virtuoso guitarist..." />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="heroVideoUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-700">Video URL (background)</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="https://..." />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="heroPosterUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-700">Poster image URL (fallback)</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="https://... or leave empty" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <AdminHeroPreview form={form} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* About */}
                  <Collapsible className="group border-b border-slate-200 -mx-6">
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-3 px-6 text-left font-medium text-slate-800 hover:text-slate-900 group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                      <span>About section</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-6 pb-4 pt-2 px-6">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="aboutHeading"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700">Heading (e.g. TOM GELDSCHLÄGER)</FormLabel>
                                <FormControl>
                                  <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="TOM GELDSCHLÄGER" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="aboutSubheading"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700">Subheading (e.g. Fountainhead)</FormLabel>
                                <FormControl>
                                  <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="Fountainhead" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="aboutPortraitUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700">Portrait image URL</FormLabel>
                                <FormControl>
                                  <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="https://... or leave empty for default" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700">Bio</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={4} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <AdminAboutPreview form={form} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Tagline (meta) — Bio is in About section above */}
                  <Collapsible className="group border-b border-slate-200 -mx-6">
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-3 px-6 text-left font-medium text-slate-800 hover:text-slate-900 group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                      <span>Tagline (meta / SEO)</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-6 pb-4 pt-2 px-6">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="tagline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700">Tagline (meta description / SEO)</FormLabel>
                                <FormControl>
                                  <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="Berlin-based guitarist..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <AdminTaglineSeoHelp />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endorsements" className="mt-0">
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900">Endorsements</CardTitle>
                  <CardDescription>Manage endorsements with name and link. Shown on the /about page.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminEndorsements form={form} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="musica" className="mt-0">
              <AdminAlbums />
            </TabsContent>

            <TabsContent value="contacto" className="mt-0">
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900">Contact</CardTitle>
                  <CardDescription>Contact information visible on the site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Phone</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-slate-200 bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" placeholder="Scheiblerstrasse 4, 12437 Berlin" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials" className="mt-0" forceMount hidden={false}>
              <div data-state={undefined} className="data-[state=inactive]:hidden">
                <AdminTestimonials />
              </div>
            </TabsContent>

            <TabsContent value="live-shows" className="mt-0">
              <AdminLiveShows />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            {form.formState.errors.root && (
              <p className="text-sm text-red-600 self-center">{form.formState.errors.root.message}</p>
            )}
            <Button type="button" onClick={form.handleSubmit(onSubmit)} className="bg-slate-800 hover:bg-slate-900 text-white" disabled={saving || loading}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save changes"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
