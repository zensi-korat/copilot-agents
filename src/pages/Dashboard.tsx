import { Users, TrendingUp, Activity, Award } from "lucide-react";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Button from "../components/Button";

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Admin Panel
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Users"
          value="12,450"
          icon={<Users size={24} />}
          trend="up"
          trendValue="12% from last month"
        />
        <StatCard
          label="Revenue"
          value="$45,231"
          icon={<TrendingUp size={24} />}
          trend="up"
          trendValue="8% from last month"
        />
        <StatCard
          label="Active Sessions"
          value="2,847"
          icon={<Activity size={24} />}
          trend="down"
          trendValue="3% from last month"
        />
        <StatCard
          label="Achievements"
          value="847"
          icon={<Award size={24} />}
          trend="up"
          trendValue="15% from last month"
        />
      </div>

      {/* Recent Activity and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Recent Activity" className="lg:col-span-2">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between pb-4 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    User Activity {item}
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Active
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="primary" className="w-full justify-center">
              New User
            </Button>
            <Button variant="secondary" className="w-full justify-center">
              View Reports
            </Button>
            <Button variant="secondary" className="w-full justify-center">
              Settings
            </Button>
          </div>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card title="Monthly Overview">
        <div className="h-64 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization placeholder</p>
        </div>
      </Card>
    </div>
  );
}
