import { useState } from "react";
import { Plus, Trash2, Video, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type VideoItem = { title: string; description: string };

export default function AdminLearning() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Learning Videos
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Upload individual videos or complete courses. Lessons <strong>are not downloadable</strong> — streaming only.
        </p>
      </div>

      <Tabs defaultValue="single" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1">
          <TabsTrigger value="single" className="data-[state=active]:bg-slate-100">
            <Video className="w-4 h-4 mr-2" />
            Single video
          </TabsTrigger>
          <TabsTrigger value="course" className="data-[state=active]:bg-slate-100">
            <BookOpen className="w-4 h-4 mr-2" />
            Course
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-0">
          <SingleVideoForm />
        </TabsContent>

        <TabsContent value="course" className="mt-0">
          <CourseForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SingleVideoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <Card className="bg-white border-slate-200 w-full">
      <CardHeader>
        <CardTitle className="text-slate-900">New single video</CardTitle>
        <CardDescription>
          A single video with title, description and price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-title" className="text-slate-700">Title</Label>
            <Input
              id="s-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sweep picking techniques"
              className="bg-white border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-desc" className="text-slate-700">Description</Label>
            <Textarea
              id="s-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el contenido del video..."
              rows={3}
              className="bg-white border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-price" className="text-slate-700">Price (€)</Label>
            <Input
              id="s-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15.00"
              className="bg-white border-slate-200 w-32"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
              Upload video
            </Button>
            <span className="text-xs text-slate-500 italic">
              [Mock] The real uploader will be implemented later
            </span>
          </div>
          {submitted && (
            <p className="text-sm text-emerald-600 font-medium">
              ✓ Video saved (demo)
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function CourseForm() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([{ title: "", description: "" }]);
  const [submitted, setSubmitted] = useState(false);

  const addVideo = () => {
    setVideos((v) => [...v, { title: "", description: "" }]);
  };

  const removeVideo = (index: number) => {
    setVideos((v) => v.filter((_, i) => i !== index));
  };

  const updateVideo = (index: number, field: "title" | "description", value: string) => {
    setVideos((v) => {
      const next = [...v];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <Card className="bg-white border-slate-200 w-full">
      <CardHeader>
        <CardTitle className="text-slate-900">New course</CardTitle>
        <CardDescription>
          A course with multiple videos. You can edit and add more videos later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 pb-4 border-b border-slate-200">
            <div className="space-y-2">
              <Label htmlFor="c-title" className="text-slate-700">Course title</Label>
              <Input
                id="c-title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Tapping masterclass"
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-desc" className="text-slate-700">Course description</Label>
              <Textarea
                id="c-desc"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Describe el curso completo..."
                rows={3}
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-price" className="text-slate-700">Course price (€)</Label>
              <Input
                id="c-price"
                type="number"
                step="0.01"
                min="0"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                placeholder="49.00"
                className="bg-white border-slate-200 w-32"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-slate-700">Course videos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVideo}
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add another video
              </Button>
            </div>

            {videos.map((video, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Video {index + 1}
                  </span>
                  {videos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVideo(index)}
                      className="text-slate-500 hover:text-red-600 h-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    value={video.title}
                    onChange={(e) => updateVideo(index, "title", e.target.value)}
                    placeholder="Video title"
                    className="bg-white border-slate-200"
                  />
                  <Textarea
                    value={video.description}
                    onChange={(e) => updateVideo(index, "description", e.target.value)}
                    placeholder="Video description"
                    rows={2}
                    className="bg-white border-slate-200"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
              Save course (done)
            </Button>
            <span className="text-xs text-slate-500 italic">
              Mark the course as ready. You can edit and add videos later.
            </span>
          </div>
          {submitted && (
            <p className="text-sm text-emerald-600 font-medium">
              ✓ Course saved (demo)
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
