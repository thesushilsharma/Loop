export default function Home() {
    return (
      <main className="bg-black min-h-screen flex flex-col">
        <section className="flex flex-col items-center justify-center md:h-[40rem] w-full rounded-md relative overflow-hidden mx-auto py-10 md:py-10">
          <div className="rounded-lg shadow-sm dark:border dark:bg-gray-800 dark:border-gray-700">
            <button
              type="button"
              className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Get Started
            </button>
          </div>
        </section>
      </main>
    );
  }
  