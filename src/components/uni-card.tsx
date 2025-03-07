import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { University } from "@/lib/types";

export function UniCard({ uni }: { uni: University }) {
  return (
    <Card key={uni.universityId} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="w-full h-[200px] relative">
          <Image
            src={uni.imageUrl!}
            alt={uni.title}
            fill={true}
            style={{ objectFit: "contain" }}
            className="rounded-lg"
          />
        </div>
        <CardTitle className="text-xl font-semibold mt-4">
          {uni.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {uni.description}
        </CardDescription>
        {uni.address}
        <p className="text-lg font-medium text-secondary-foreground mb-4">
          Rating: {uni.rating}/5
        </p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 flex gap-6 text-muted-foreground">
        <Link href={`/account/uni/${uni.universityId}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
