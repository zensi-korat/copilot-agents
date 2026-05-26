import { Card, Button } from "../components/ui";
const UiButton = Button as any;
import { Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted">Manage your application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-2">
              {["General", "Security", "Notifications", "API Keys"].map(
                (item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-background transition font-medium text-foreground"
                  >
                    {item}
                  </button>
                ),
              )}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card title="General Settings">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Application Name
                </label>
                <input
                  type="text"
                  placeholder="My Admin Panel"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter your application description"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary rounded"
                    defaultChecked
                  />
                  <span className="text-sm text-foreground">
                    Enable dark mode
                  </span>
                </label>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card title="Security Settings">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Two-Factor Authentication
                </label>
                <p className="text-sm text-muted mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="secondary">Enable 2FA</Button>
              </div>
              <div className="border-t pt-6">
                <h3 className="font-medium text-foreground mb-4">
                  Active Sessions
                </h3>
                <div className="space-y-3">
                  {[1, 2].map((session) => (
                    <div
                      key={session}
                      className="flex items-center justify-between p-3 bg-background rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Browser Session {session}
                        </p>
                        <p className="text-xs text-muted">
                          Last active: 2 hours ago
                        </p>
                      </div>
                      <button className="text-destructive text-sm font-medium hover:opacity-80">
                        Sign Out
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <UiButton variant="default">
              <Save size={20} /> Save Changes
            </UiButton>
            <UiButton variant="secondary">Cancel</UiButton>
          </div>
        </div>
      </div>
    </div>
  );
}
