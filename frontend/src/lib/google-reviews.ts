import "server-only";
import { REVIEWS, TOTAL_REVIEW_COUNT, type Review } from "@/data/reviews";

const FALLBACK_COLORS = [
  "#EA4335",
  "#4285F4",
  "#34A853",
  "#FB8C00",
  "#7E57C2",
  "#EC407A",
  "#FBBC04",
];

// Legacy Places API ("Place Details") response shape.
type PlacesApiResponse = {
  status?: string;
  error_message?: string;
  result?: {
    rating?: number;
    user_ratings_total?: number;
    reviews?: Array<{
      author_name?: string;
      profile_photo_url?: string;
      rating?: number;
      relative_time_description?: string;
      text?: string;
    }>;
  };
};

export async function fetchGoogleReviews(): Promise<{
  reviews: Review[];
  totalCount: number;
}> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_PLACE_ID;

  if (!apiKey || !placeId) {
    return { reviews: REVIEWS, totalCount: TOTAL_REVIEW_COUNT };
  }

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json",
    );
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "reviews,rating,user_ratings_total");
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(
        `[google-reviews] Places API HTTP ${res.status}, using hardcoded fallback. ` +
          body.slice(0, 200).replace(/\s+/g, " "),
      );
      return { reviews: REVIEWS, totalCount: TOTAL_REVIEW_COUNT };
    }

    const data: PlacesApiResponse = await res.json();

    if (data.status !== "OK") {
      console.warn(
        `[google-reviews] Places API status=${data.status}, using hardcoded fallback. ${
          data.error_message ?? ""
        }`,
      );
      return { reviews: REVIEWS, totalCount: TOTAL_REVIEW_COUNT };
    }

    const fetched: Review[] = (data.result?.reviews ?? []).map((r, i) => ({
      name: r.author_name ?? "Anonymous",
      avatarColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      avatarUrl: r.profile_photo_url,
      timeAgo: r.relative_time_description ?? "",
      rating: r.rating ?? 5,
      text: r.text ?? "",
    }));

    return {
      reviews: fetched.length > 0 ? fetched : REVIEWS,
      totalCount: data.result?.user_ratings_total ?? TOTAL_REVIEW_COUNT,
    };
  } catch (err) {
    console.warn("[google-reviews] network error, using hardcoded fallback:", err);
    return { reviews: REVIEWS, totalCount: TOTAL_REVIEW_COUNT };
  }
}
