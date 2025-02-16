import { Footer } from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser<void>();
  return (
    <div>
      <Header isAuthenticated={await isAuthenticated()} user={user} />
      <main className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
