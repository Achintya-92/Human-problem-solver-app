import { env } from "./utils/env";
import { createApp } from "./app";

const app = createApp();

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`API running on ${env.PORT}`);
});

