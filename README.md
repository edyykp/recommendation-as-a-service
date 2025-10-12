# lab-sr Recombee Integration

This project integrates Recombee’s recommendation API with a Node.js server. It automatically resets the Recombee catalog and uploads movie data from a CSV file on startup.

## Features

- **Catalog Reset:** Deletes all items from the Recombee catalog before each upload.
- **Bulk Movie Upload:** Reads movie data from a CSV file and uploads each movie as an item to Recombee.
- **Express Server:** Provides a basic Express setup with error handling.

## CSV Data Format

The CSV file (`IMBD.csv`) should be located at `dist/IMBD.csv` and contain movie data with the following columns:

| Column      | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| title       | Movie title                                                           |
| description | Short description or synopsis                                         |
| rating      | Numeric rating (e.g., IMDb score)                                     |
| votes       | Number of votes or reviews                                            |
| duration    | Duration in minutes                                                   |
| stars       | Comma-separated list of starring actors (e.g., "Tom Hanks, Meg Ryan") |
| genre       | Comma-separated list of genres (e.g., "Drama, Romance")               |

**Example CSV row:**

```
title,description,rating,votes,duration,stars,genre
"Forrest Gump","The story of Forrest Gump...",8.8,1800000,142,"Tom Hanks, Robin Wright","Drama, Romance"
```

**Note:**

- The code automatically filters out any star entries that are `"|"` or `"Stars:"`.
- All values are trimmed and converted to appropriate types before uploading.

## Usage

1. Place your `IMBD.csv` file in the `dist` directory.
2. Set your Recombee private token in the configuration.
3. Start the server:
   ```sh
   npm start
   ```
   On startup, the catalog will be reset and movies from the CSV will be uploaded.

## Requirements

- Node.js 16+
- Recombee account and API token
- Valid CSV file as described above

## License

MIT
