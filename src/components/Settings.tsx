import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Key, Shield, Bell, Save } from "lucide-react";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    setApiKey(localStorage.getItem("binance_api_key") || "");
    setApiSecret(localStorage.getItem("binance_api_secret") || "");
    setGeminiKey(localStorage.getItem("gemini_api_key") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("binance_api_key", apiKey);
    localStorage.setItem("binance_api_secret", apiSecret);
    localStorage.setItem("gemini_api_key", geminiKey);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-2xl space-y-8">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-500" />
            Binance API Credentials
          </CardTitle>
          <CardDescription>
            These keys are required to post to your Binance Square account. 
            They are stored locally in your browser for security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Binance API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              placeholder="Enter your Binance API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="geminiKey">Gemini API Key</Label>
            <Input
              id="geminiKey"
              type="password"
              placeholder="Enter your Gemini API Key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="bg-zinc-950 border-zinc-800"
            />
            <p className="text-[10px] text-zinc-500">
              Note: In this preview environment, the key is automatically injected if set in the Secrets panel. 
              This field is primarily for your external deployment.
            </p>
          </div>
          <Button onClick={handleSave} className="w-full bg-yellow-500 text-zinc-950 hover:bg-yellow-400 font-bold">
            <Save className="w-4 h-4 mr-2" />
            Save Credentials
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            Preferences
          </CardTitle>
          <CardDescription>Manage how you receive updates and alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Post Notifications</Label>
              <p className="text-sm text-zinc-500">Get notified when a scheduled post is successfully published.</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Generation</Label>
              <p className="text-sm text-zinc-500">Allow Gemini to automatically suggest content based on market trends.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 border-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Shield className="w-5 h-5" />
            Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Ensure your Binance API keys have the necessary permissions for "Content Creator" or "Binance Square" posting. 
            Never share your API Secret with anyone. If you suspect your keys are compromised, delete them immediately 
            from the Binance portal and update them here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
