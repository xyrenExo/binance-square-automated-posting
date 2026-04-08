import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Sparkles, Send, Calendar } from "lucide-react";
import { generateFinancialPost, gatherFinancialData } from "@/lib/gemini";

export default function PostGenerator() {
  const [query, setQuery] = useState("");
  const [isGathering, setIsGathering] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGatherData = async () => {
    if (!query) return toast.error("Please enter a topic or query");
    setIsGathering(true);
    try {
      const data = await gatherFinancialData(query);
      setGeneratedContent(data);
      toast.success("Data gathered successfully");
    } catch (error) {
      toast.error("Failed to gather data");
    } finally {
      setIsGathering(false);
    }
  };

  const handleGeneratePost = async () => {
    if (!generatedContent) return toast.error("No data to generate post from");
    setIsGenerating(true);
    try {
      const post = await generateFinancialPost(generatedContent);
      setGeneratedContent(post);
      toast.success("Post generated successfully");
    } catch (error) {
      toast.error("Failed to generate post");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostNow = async () => {
    setIsPosting(true);
    try {
      const response = await fetch("/api/binance/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedContent,
          apiKey: localStorage.getItem("binance_api_key"),
          apiSecret: localStorage.getItem("binance_api_secret"),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Posted to Binance Square!");
      } else {
        toast.error(data.error || "Failed to post");
      }
    } catch (error) {
      toast.error("An error occurred while posting");
    } finally {
      setIsPosting(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleTime) return toast.error("Please select a time");
    setIsScheduling(true);
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedContent,
          time: scheduleTime,
          posted: false,
        }),
      });
      if (response.ok) {
        toast.success("Post scheduled successfully");
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to schedule post");
      }
    } catch (error) {
      toast.error("An error occurred while scheduling");
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Content Input
          </CardTitle>
          <CardDescription>Enter a topic or raw data to start generating your post.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Topic or Query</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. BTC price analysis, ETH news..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-zinc-950 border-zinc-800"
              />
              <Button 
                onClick={handleGatherData} 
                disabled={isGathering}
                variant="secondary"
                className="bg-zinc-800 hover:bg-zinc-700"
              >
                {isGathering ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gather"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Raw Data / Draft</label>
            <Textarea
              placeholder="Paste data here or use the gather tool..."
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="min-h-[200px] bg-zinc-950 border-zinc-800 resize-none"
            />
          </div>

          <Button 
            onClick={handleGeneratePost} 
            disabled={isGenerating || !generatedContent}
            className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 font-bold"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate Post with Gemini
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-yellow-500" />
            Preview & Actions
          </CardTitle>
          <CardDescription>Review your post and choose an action.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 min-h-[300px] whitespace-pre-wrap text-zinc-300 leading-relaxed">
            {generatedContent || <p className="text-zinc-600 italic">Generated content will appear here...</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                render={
                  <Button 
                    variant="outline" 
                    className="border-zinc-800 hover:bg-zinc-800"
                    disabled={!generatedContent}
                  />
                }
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50">
                <DialogHeader>
                  <DialogTitle>Schedule Post</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Choose a date and time for this post to be published.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleSchedule} 
                    disabled={isScheduling || !scheduleTime}
                    className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400 font-bold"
                  >
                    {isScheduling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Confirm Schedule"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={handlePostNow}
              disabled={isPosting || !generatedContent}
              className="bg-zinc-100 text-zinc-950 hover:bg-white font-bold"
            >
              {isPosting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Post Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
