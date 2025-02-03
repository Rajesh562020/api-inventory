// src/server.ts
import express from 'express';
import inventoryRoutes from './inventoryRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', inventoryRoutes); // Use inventory routes here

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
