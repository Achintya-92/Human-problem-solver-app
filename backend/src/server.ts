import { env } from "./utils/env";
import { createApp } from "./app";

const app = createApp();

const port = process.env.PORT || env.PORT || 10000;

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});