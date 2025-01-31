import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-300">Loop</h2>
          <div className="space-x-4">
            <LoginLink
              postLoginRedirectURL="/account/dashboard"
              className="text-gray-300 hover:text-purple-300 transition-colors"
            >
              Sign in
            </LoginLink>
            <RegisterLink
              postLoginRedirectURL="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/20"
            >
              Join Community
            </RegisterLink>
          </div>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center min-h-screen w-full max-w-6xl mx-auto px-4 pt-20">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 text-transparent bg-clip-text leading-tight">
            Bring your own <br className="hidden lg:inline-block" />
            Laptop
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Loop is your student-powered platform for authentic university
            reviews, discussions, and knowledge sharing. Join the community
            where your voice matters.
          </p>
          <p className="text-white mb-8 leading-relaxed">Loop is a platform of the student, by the student, and for the student</p>


          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              type="button"
              className="group relative px-8 py-3.5 text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 w-full sm:w-auto"
            >
              <span className="relative z-10 font-medium">
                Explore Platform
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl -z-10"></div>
            </button>

            <a
              href="mailto:thesushilsharma@proton.me"
              className="px-8 py-3.5 text-purple-300 border border-purple-700/50 rounded-xl hover:bg-purple-900/40 transition-all duration-300 w-full sm:w-auto font-medium"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 w-full">
          {[
            {
              title: "University Reviews",
              desc: "Share and discover authentic reviews, ratings, and experiences from real students.",
              icon: "🎓",
            },
            {
              title: "Student Discussions",
              desc: "Engage in meaningful discussions, ask questions, and share knowledge with peers.",
              icon: "💬",
            },
            {
              title: "Community Driven",
              desc: "Upvote helpful content, build reputation, and contribute to a thriving student community.",
              icon: "⭐",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-gray-900/50 border border-purple-900/30 backdrop-blur-sm hover:border-purple-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 group"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-3 group-hover:text-purple-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social Proof Section */}
        <div className="mt-20 w-full text-center border-t border-purple-900/30 pt-12">
          <p className="text-gray-500">
            Join thousands of students already on Loop
          </p>
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-purple-300">
              <span className="block text-2xl font-bold">10k+</span>
              <span className="text-sm text-gray-400">Active Users</span>
            </div>
            <div className="text-purple-300">
              <span className="block text-2xl font-bold">50+</span>
              <span className="text-sm text-gray-400">Universities</span>
            </div>
            <div className="text-purple-300">
              <span className="block text-2xl font-bold">100k+</span>
              <span className="text-sm text-gray-400">Discussions</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
