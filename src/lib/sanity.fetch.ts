import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import { Motorcycle } from "@/types";

export async function getMotorcycles(): Promise<Motorcycle[]> {
    return client.fetch(
        groq`*[_type == "motorcycle"] {
      _id,
      title,
      "slug": slug.current,
      images,
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
