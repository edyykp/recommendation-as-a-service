import { randomUUID } from "crypto";
import { parse } from "csv-parse";
import { requests, type ApiClient } from "recombee-api-client";
import fs from "fs";

export const resetCatalog = async (recombeeClient: ApiClient) => {
  try {
    const itemsResponse = await recombeeClient.send(
      new requests.ListItems({
        returnProperties: true,
      })
    );

    const deletedMovies = itemsResponse.map(
      (item) => new requests.DeleteItem(item.itemId)
    );

    if (!itemsResponse?.length) {
      console.log("No items found — catalog already empty.");
      return;
    }

    await recombeeClient.send(new requests.Batch(deletedMovies));
    console.log("🎉 Catalog reset complete.");
  } catch (err) {
    console.warn("Error resetting catalog:", err);
  }
};

export const uploadMovies = async (recombeeClient: ApiClient) => {
  const parser = fs
    .createReadStream("/Users/edstoica/lab-sr/src/IMBD.csv")
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  const movies = new Array();
  for await (const record of parser) {
    const movieId = randomUUID();
    movies.push(
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
  }

  try {
    await recombeeClient.send(new requests.Batch(movies));
    console.log("🎉 Movies upload complete.");
  } catch (err) {
    console.warn(`Error uploading movies`, err);
  }
};
