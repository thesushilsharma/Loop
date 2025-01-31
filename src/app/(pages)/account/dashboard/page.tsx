import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800/40 bg-gray-900/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-purple-300">Loop</div>
            <div className="flex items-center gap-6">
              <span className="text-gray-300">
                Welcome, {user?.given_name || 'User'}
              </span>
              <LogoutLink className="text-gray-400 hover:text-purple-300 transition-colors">
                Log out
              </LogoutLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gray-900/50 border border-purple-900/30 backdrop-blur-sm p-8 mb-8">
          <p className="text-purple-400 font-medium mb-3">Welcome to Your Dashboard</p>
          <h1 className="text-3xl font-bold text-white mb-4">
            Real Insights, Right Choice: Your Guide to the Perfect University Experience
          </h1>
          <p className="text-gray-400 max-w-3xl">
            Join thousands of students sharing authentic experiences and making informed decisions about their academic journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Your Reviews', value: '12', icon: '📝' },
            { label: 'Contributions', value: '48', icon: '🎯' },
            { label: 'Reputation', value: '1.2k', icon: '⭐' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-6 hover:border-purple-700/40 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-gray-900/50 border border-purple-900/30 p-6">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-purple-600/10 text-purple-300 hover:bg-purple-600/20 transition-colors">
                ✍️ Write a Review
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-purple-600/10 text-purple-300 hover:bg-purple-600/20 transition-colors">
                💬 Start a Discussion
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-purple-600/10 text-purple-300 hover:bg-purple-600/20 transition-colors">
                🔍 Browse Universities
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-gray-900/50 border border-purple-900/30 p-6">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { text: 'Your review of MIT was upvoted 12 times', time: '2h ago' },
                { text: 'New reply to your Stanford discussion thread', time: '5h ago' },
                { text: 'Your question about Harvard received 3 answers', time: '1d ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                  <span className="text-gray-300">{activity.text}</span>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;