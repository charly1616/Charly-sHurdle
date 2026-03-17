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

app.use(cors({ origin: ("https://1fj3pbb6-5173.use2.devtunnels.ms/"), credentials: true }));


app.use((req, res, next) => {
  // 1. Permitir el origen de tu Dev Tunnel
  res.header("Access-Control-Allow-Origin", "https://1fj3pbb6-5173.use2.devtunnels.ms");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // 2. LA CLAVE: Permitir explícitamente el acceso a la red local
  res.header("Access-Control-Allow-Private-Network", "true");

  next();
});

app.use(express.json());

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

