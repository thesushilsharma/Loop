import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil, MessageSquare, Search, ArrowUpRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const quickActions = [
    {
      icon: <Pencil className="w-4 h-4" />,
      text: "Write a Review",
      href: "/universities/review",
      variant: "default",
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      text: "Start a Discussion",
      href: "/discussions/new",
      variant: "outline",
    },
    {
      icon: <Search className="w-4 h-4" />,
      text: "Browse Universities",
      href: "/universities",
      variant: "outline",
    },
  ];

  const recentActivity = [
    {
      text: "Your review of MIT was upvoted 12 times",
      time: "2h ago",
      type: "upvote",
    },
    {
      text: "John reviewed Stanford University",
      time: "2h ago",
      type: "review",
    },
    {
      text: "New discussion: 'Best CS programs in the US'",
      time: "2h ago",
      type: "discussion",
    },
    {
      text: "Sarah commented on your review",
      time: "2h ago",
      type: "comment",
    },
    {
      text: "New reply to your Stanford discussion thread",
      time: "5h ago",
      type: "reply",
    },
    {
      text: "Your question about Harvard received 3 answers",
      time: "1d ago",
      type: "answer",
    },
  ];

  const universities = [
    { name: "Harvard", rating: 4.8, reviews: 1250 },
    { name: "MIT", rating: 4.9, reviews: 980 },
    { name: "Stanford", rating: 4.7, reviews: 890 },
    { name: "Oxford", rating: 4.6, reviews: 760 },
    { name: "Cambridge", rating: 4.7, reviews: 850 },
    { name: "Yale", rating: 4.5, reviews: 720 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-card to-background">
        <CardContent className="pt-6">
          <Badge className="mb-3">Welcome Back</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Real Insights, Right Choice:{" "}
            <span className="text-primary">Your Guide to the Perfect University Experience</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Join thousands of students sharing authentic experiences and making informed decisions 
            about their academic journey.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant}
                className="w-full justify-start gap-2 text-left"
                asChild
              >
                <Link href={action.href}>
                  {action.icon}
                  {action.text}
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-border last:border-0 group hover:bg-muted/50 rounded-lg transition-colors duration-200 p-2"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {activity.text}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {activity.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Trending Universities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Trending Universities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {universities.map((uni) => (
              <div
                key={uni.name}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-sm group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {uni.name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{uni.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {uni.reviews.toLocaleString()} reviews
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}