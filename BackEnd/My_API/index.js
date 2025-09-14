import express from "express";
import userRoutes from "./Router/User.js";
import Inputlinks from "./Router/DetectHashFile.js";
import store  from "./Router/Store.js";
import detect from "./Router/Detection.js";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/store", store);
app.use("/input", Inputlinks);
app.use('/detect', detect);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
