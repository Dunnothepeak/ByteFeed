import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/feed", async (req, res) => {
  try {
    const interests = ((req.query.interests as string) || "Computer science").trim();
    
    // Split interests by commas to get individual search terms
    const terms = interests.split(',').map(t => t.trim()).filter(Boolean);
    
    // We'll search for up to 3 terms
    const searchQueries = terms.length > 0 ? terms.slice(0, 3) : ["Computer science"];
    
    let allNotes: any[] = [];

    // Fetch from Wikipedia for each query
    for (const query of searchQueries) {
      // Use the Wikipedia Action API: search for pages and get their plain text extracts (intro only, up to 3 sentences)
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=extracts&exintro=1&explaintext=1&exsentences=3&format=json`;
      
      const wpRes = await fetch(url, {
        headers: { "User-Agent": "ByteFeed/1.0" }
      });
      
      if (!wpRes.ok) {
        console.error(`Wikipedia API returned ${wpRes.status} for query: ${query}`);
        continue;
      }
      
      const wpData = await wpRes.json();
      
      if (wpData.query && wpData.query.pages) {
        const pages = Object.values(wpData.query.pages) as any[];
        for (const page of pages) {
          if (page.extract && page.extract.trim().length > 0 && !page.title.startsWith("List of") && !page.title.includes("disambiguation")) {
            allNotes.push({
              id: `wiki-${page.pageid}-${Math.random().toString(36).substring(7)}`,
              // Format title to look a bit like a topic or system handle
              author: page.title,
              content: page.extract.trim(),
              sourceUrl: `https://en.wikipedia.org/?curid=${page.pageid}`
            });
          }
        }
      }
    }

    // If Wikipedia didn't return anything useful, provide a fallback
    if (allNotes.length === 0) {
      allNotes.push({
        id: "wiki-fallback-1",
        author: "Knowledge Base",
        content: `We couldn't find specific Wikipedia articles for "${interests}". Try searching for broader terms like "Software Engineering" or "Data Structures".`,
      });
    }

    // Shuffle the results to simulate a dynamic feed
    const shuffled = allNotes.sort(() => 0.5 - Math.random());
    // Give back up to 10 items
    const feed = shuffled.slice(0, 10);

    // Simulate a slight network delay so the loading state feels natural
    setTimeout(() => {
      res.json({ feed });
    }, 400);

  } catch (error: any) {
    console.error("Wikipedia Scraper Error:", error);
    res.status(500).json({ error: "Failed to generate feed from Wikipedia" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
