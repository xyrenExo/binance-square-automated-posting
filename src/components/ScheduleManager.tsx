import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Schedule {
  id: string;
  content: string;
  time: string;
  posted: boolean;
}

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules");
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      toast.error("Failed to fetch schedules");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      setSchedules(schedules.filter(s => s.id !== id));
      toast.success("Schedule deleted");
    } catch (error) {
      toast.error("Failed to delete schedule");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {schedules.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No scheduled posts yet</p>
            <p className="text-sm">Use the Post Generator to create and schedule content.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="p-6 flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      schedule.posted ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {schedule.posted ? "Posted" : "Scheduled"}
                    </div>
                    <p className="text-sm text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(schedule.time), "MMM d, h:mm a")}
                    </p>
                  </div>
                  <p className="text-zinc-300 line-clamp-2 text-sm leading-relaxed">
                    {schedule.content}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(schedule.id)}
                  className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="text-blue-500 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{schedules.filter(s => !s.posted).length}</p>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="text-green-500 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{schedules.filter(s => s.posted).length}</p>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="text-red-500 w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Failed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
