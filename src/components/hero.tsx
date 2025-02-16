import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight } from "lucide-react";

const Hero = () => {
    const features = [
        {
            title: "University Reviews",
            description: "Share and discover authentic reviews, ratings, and experiences from real students.",
            icon: "🎓",
        },
        {
            title: "Student Discussions",
            description: "Engage in meaningful discussions, ask questions, and share knowledge with peers.",
            icon: "💬",
        },
        {
            title: "Community Driven",
            description: "Upvote helpful content, build reputation, and contribute to a thriving student community.",
            icon: "⭐",
        },
    ];

    const stats = [
        { value: "10k+", label: "Active Users" },
        { value: "50+", label: "Universities" },
        { value: "100k+", label: "Discussions" },
    ];

    return (
        <section className="flex flex-col items-center justify-center min-h-screen w-full max-w-6xl mx-auto px-4 py-20 space-y-16">
            {/* Hero Content */}
            <div className="text-center space-y-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground tracking-tight">
                    Bring your own <br className="hidden lg:inline" />
                    <span className="text-primary">Laptop</span>
                </h1>

                <div className="space-y-4 max-w-2xl mx-auto">
                    <p className="text-lg text-muted-foreground">
                        Loop is your student-powered platform for authentic university reviews,
                        discussions, and knowledge sharing. Join the community where your voice
                        matters.
                    </p>
                    <p className="text-foreground">
                        Loop is a platform of the student, by the student, and for the student.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button size="lg" className="w-full sm:w-auto">
                        Explore Platform
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        <Mail className="mr-2 h-4 w-4" />
                        <a
                            href="mailto:thesushilsharma@proton.me">
                            Contact Me
                        </a>
                    </Button>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 w-full">
                {features.map((feature, idx) => (
                    <Card key={idx} className="group hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6 space-y-4">
                            <div className="text-3xl">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Stats Section */}
            <div className="w-full border-t border-border pt-12">
                <p className="text-center text-muted-foreground mb-8">
                    Join thousands of students already on Loop
                </p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <span className="block text-3xl font-bold text-primary">
                                {stat.value}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;