import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { getUniversityById } from "@/server/uni";
import { StarRating } from "@/components/ui/star-rating";

export default async function UniversityDetail({
    params,
}: {
    params: Promise<{ uniId: string }>;
}) {
    const { uniId } = await params;
    const university = await getUniversityById(Number(uniId));

    if (!university) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-center text-foreground">
                    University not found
                </h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
                {university.title}
            </h1>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Image */}
                    <div
                        className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md bg-cover bg-center"
                        style={{ backgroundImage: `url(${university.imageUrl})` }}
                    >
                        {/* Other content inside the div */}
                    </div>
                    {/* Optional: Add an overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Description */}
                <p className="text-foreground leading-relaxed text-base md:text-lg">
                    {university.description}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="w-full sm:w-auto">
                        <a
                            href={university.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Website
                        </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <a
                            href={university.linkedinLink!}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn
                        </a>
                    </Button>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Quick Info */}
                <div className="bg-background p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-primary">
                        Quick Info
                    </h2>
                    <ul className="space-y-2 text-foreground">
                        <li>
                            <strong>Location:</strong> {university.address}
                        </li>
                        <li>
                            <strong>Rating:</strong> {university.rating}/5
                        </li>
                    </ul>
                    <div className="flex items-center gap-4 mt-4">
                        <StarRating
                            rating={Number(university.rating)}
                            className="text-primary"
                        />
                        {/* <span className="text-foreground">
                        {reviews?.length || 0} reviews
                    </span> */}
                    </div>
                </div>

                {/* Map */}
                <div className="bg-background p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-primary">Map</h2>
                    <div className="relative w-full h-64 overflow-hidden rounded-lg">
                        <iframe
                            src={university.maps!}
                            title="University Location"
                            aria-label="University Location Map"
                            className="absolute inset-0 w-full h-full border-none rounded-lg"
                            style={{ filter: "grayscale(50%)" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid grid-cols-2 w-full sm:w-[400px] bg-muted">
                    <TabsTrigger
                        value="reviews"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                        Reviews
                    </TabsTrigger>
                    <TabsTrigger
                        value="discussions"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                        Discussions
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="reviews">
                    <div className="p-6 bg-background rounded-lg shadow-md mt-4">
                        <p className="text-foreground">Reviews will be displayed here</p>
                    </div>
                </TabsContent>
                <TabsContent value="discussions">
                    <div className="p-6 bg-background rounded-lg shadow-md mt-4">
                        <p className="text-foreground">
                            Discussions will be displayed here
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
