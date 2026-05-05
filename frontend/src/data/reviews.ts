export type Review = {
  name: string;
  avatarColor: string;
  avatarUrl?: string; // real Google profile photo URL when fetched from Places API
  timeAgo: string;
  rating: number;
  text: string;
};

// TODO: wire to Google Places API
export const TOTAL_REVIEW_COUNT = 65;

export const REVIEWS: Review[] = [
  {
    name: "Jonathan Bouldin",
    avatarColor: "#EA4335",
    timeAgo: "9 months ago",
    rating: 5,
    text: "Awesome place. Great people.",
  },
  {
    name: "Josh Brown",
    avatarColor: "#4285F4",
    timeAgo: "9 months ago",
    rating: 5,
    text: "Awesome atmosphere!!",
  },
  {
    name: "Matthew Jones",
    avatarColor: "#34A853",
    timeAgo: "10 months ago",
    rating: 5,
    text: "Really am impressed with this shop. For some time I’ve been looking around for a regular barber and I think I’ve found the one. Courtney and Corey’s attention to detail, not rushing through haircuts, getting the full barbered haircut treatment. And quite friendly on top of it all. What’s not to like!",
  },
  {
    name: "Gregory Bay",
    avatarColor: "#FB8C00",
    timeAgo: "11 months ago",
    rating: 5,
    text: "I am really particular about my haircuts and have been to multiple places. Ecdysis is by far the best experience I have had. Great shop with good people. They really take the time to make sure you get the perfect cut.",
  },
  {
    name: "Joseph Baker",
    avatarColor: "#7E57C2",
    timeAgo: "11 months ago",
    rating: 5,
    text: "Really awesome environment! First time coming here. I booked a haircut with Rafael Perfecto. I wanted to try something new and to come out of my comfort zone. He took his time and payed real attention to details. Came out looking & feeling amazing. Definitely wanting to come back and see what else they have to offer!",
  },
  {
    name: "Eric Britton",
    avatarColor: "#EC407A",
    timeAgo: "11 months ago",
    rating: 5,
    text: "Rafael did a great job! I wasn't too sure what I wanted to do with my hair. He had several good ideas, and I'm very happy with the haircut. He took his time and is very talented with his craft. Will definitely come back.",
  },
  {
    name: "Mackenzie Rice",
    avatarColor: "#FBBC04",
    timeAgo: "1 year ago",
    rating: 5,
    text: "RAF, Shelby and Courtney are absolutely wonderful! They all have cut my hair, my daughters hair and my sons! Every single time… it’s better than the last! Love the environment, love that they are so accepting of everyone! It’s fun and relaxed, they hear what you want and apply it to everything they do.. they suggest things that will compliment you personally and they are always right ♥️ if I could give 10 stars I would!",
  },
];
