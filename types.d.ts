type Location = {
    country: string;
    region: string;
    address: string;
}

type University = {
    universityId: string;
    title: string;
    location: Location;
    description?: string; // Optional
    maps?: string; // Optional
    imageUrl?: string; // Optional
    websiteLink: string;
    linkedinLink?: string; // Optional
    rating: 1 | 2 | 3 | 4 | 5; // Union type for specific values
}