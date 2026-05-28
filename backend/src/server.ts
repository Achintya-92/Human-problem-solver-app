import { env } from "./utils/env";
import { createApp } from "./app";

const app = createApp();

const PORT = process.env.PORT || env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});