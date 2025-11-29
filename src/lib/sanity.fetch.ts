import { client } from "@/sanity/client";
import { groq } from "next-sanity";

export async function getMotorcycles() {
    return client.fetch(
        groq`*[_type == "motorcycle"] {
      _id,
      title,
      "slug": slug.current,
      "imageUrl": images[0].asset->url,
      price,
      brand,
      year,
      displacement,
      description,
      isUsed,
      kilometers,
      catchphrase,
      summary
    }`,
        {},
        {
            next: { revalidate: 0 }, // No cache for immediate updates
        }
    );
}
