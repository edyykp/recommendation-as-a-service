import { randomUUID } from "crypto";
import { parse } from "csv-parse";
import { requests, type ApiClient } from "recombee-api-client";
import fs from "fs";

export const resetCatalog = async (recombeeClient: ApiClient) => {
  try {
    // Get all items
    const itemsResponse = await recombeeClient.send(new requests.ListItems({
        returnProperties: true,
    }));

    // Delete each item
    for (const item of itemsResponse) {
      await recombeeClient.send(new requests.DeleteItem(item.itemId));
      console.log(`Deleted item: ${item.itemId}`);
    }
    console.log("Catalog reset complete.");
  } catch (err) {
    console.warn("Error resetting catalog:", err);
  }
};

export const uploadMovies = async (recombeeClient: ApiClient) => {
  const parser = fs
    .createReadStream("/Users/edstoica/lab-sr/dist/IMBD.csv")
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const record of parser) {
    const movieId = randomUUID();
    try {
      await recombeeClient.send(
        new requests.SetItemValues(
          movieId,
          {
            title: record.title,
            description: record.description,
            rating: Number(record.rating),
            votes: Number(record.votes),
            duration: Number(record.duration),
            stars: record.stars
              .split(", ")
              .map((s: string) => s.trim())
              .filter((s: string) => s !== "|" && s.toLowerCase() !== "stars:"),
            genre: record.genre.split(", ").map((g: string) => g.trim()),
          },
          {
            cascadeCreate: true,
          }
        )
      );
      console.log(`${movieId} added.`);
    } catch (err) {
      console.warn(err);
    }
  }
};
