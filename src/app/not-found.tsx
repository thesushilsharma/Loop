import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <section className="bg-background h-screen flex justify-center items-center">
      <div className="py-8 px-4 mx-auto max-w-[--breakpoint-xl] lg:py-16 lg:px-6">
        <div className="mx-auto max-w-[--breakpoint-sm] text-center space-y-4">
          {/* Error Code */}
          <h1 className="text-7xl lg:text-9xl font-extrabold tracking-tight text-destructive">
            404
          </h1>

          {/* Main Message */}
          <p className="text-3xl lg:text-4xl font-bold text-foreground">
            Something's missing.
          </p>

          {/* Subtext */}
          <p className="text-lg font-light text-muted-foreground">
            Sorry, we can't find that page. You'll find lots to explore on the home page.
          </p>

          {/* Action Button */}
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}