import Card from "../components/Card";
import Button from "../components/Button";
import { Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your application settings</p>
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
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Name
                </label>
                <input
                  type="text"
                  placeholder="My Admin Panel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter your application description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 rounded"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Two-Factor Authentication
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="secondary">Enable 2FA</Button>
              </div>
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Active Sessions
                </h3>
                <div className="space-y-3">
                  {[1, 2].map((session) => (
                    <div
                      key={session}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Browser Session {session}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last active: 2 hours ago
                        </p>
                      </div>
                      <button className="text-red-600 text-sm font-medium hover:text-red-700">
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
            <Button variant="primary">
              <Save size={20} /> Save Changes
            </Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
