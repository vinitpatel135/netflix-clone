import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json()); // will allow us to parse req.body
app.use(cookieParser());
app.use(cors({
    origin: ENV_VARS.NODE_ENV === 'production'
        ? 'https://your-frontend-url.com'  // Replace with your production frontend URL
        : 'http://localhost:5172',  // Local development frontend URL
    credentials: true,  // Allow cookies to be sent and received
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

if (ENV_VARS.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	connectDB();
});


// 0aTaK7xZO5gLsPLZ

// curl --request GET \
//      --url 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1' \
//      --header 'Authorization: Bearer ' \
//      --header 'accept: application/json'