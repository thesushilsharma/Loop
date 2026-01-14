import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  const isAuth = !!(await isAuthenticated());
  return (
    <div>
      <Header isAuthenticated={isAuth} user={user} />
      <main className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
