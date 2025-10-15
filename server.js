import { createApp } from "./src/app.js";
import { CONFIG_WARNINGS, PORT } from "./src/config/index.js";

CONFIG_WARNINGS();

const app = createApp();

app.listen(PORT, () => {
  console.log(`VPM backend listening on :${PORT}`);
  if (process.argv[2] === "seed") {
	setTimeout(async () => {
	  try {
		await fetch(`http://localhost:${PORT}/api/products/seed`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ count: 50 }) });
		console.log("Seeding requested");
	  } catch (e) {
		console.error("Seed request failed", e);
	  }
	}, 500);
  }
});

