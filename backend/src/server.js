import express from 'express';
import { ENV } from '../env.js';

import cors from 'cors';
import FriendsRoutes from './Routes/FriendsRoutes.js';
import SuggestionsRoute from './Routes/SuggestionsRoute.js';
import CheckRoute from './Routes/CheckRoute.js';
import path from 'path';


const __dirname = path.resolve()

const app = express();
const PORT = ENV.PORT || 3000;

app.use(cors({ origin: "https://charly-s-hurdlefrontend.vercel.app"), credentials: true }));
app.use(express.json({ limit: "5mb" }));

app.use("/api/Friends",FriendsRoutes);
app.use('/api/suggestions', SuggestionsRoute);
app.use('/api/answers', CheckRoute);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

