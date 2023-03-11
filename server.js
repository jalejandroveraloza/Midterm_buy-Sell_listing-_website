// load .env data into process.env
require("dotenv").config();

// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const PORT = process.env.PORT || 8080;
const app = express();

app.set("view engine", "ejs");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const productRoutes = require("./routes/product");
const favouritesRoutes = require("./routes/favourites");
const searchRoutes = require("./routes/search");
const addListingRoutes = require("./routes/addListing");
const adminRoutes = require("./routes/admin");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/users", usersRoutes(db));
app.use("/products", productRoutes(db));
app.use("/favourites", favouritesRoutes(db));
app.use("/", searchRoutes(db));
app.use("/", addListingRoutes(db));
app.use("/admin", adminRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

//use the individual user object as opposed to the admin object (grabs all admins) to check if user is an admin.
app.get("/", (req, res) => {
  db.query(`SELECT * FROM users WHERE is_admin = true; SELECT * FROM products;`)
    .then((data) => {
      const currentUser = req.session.user_id;
      const theProducts = data[1].rows; //result second query
      const templateVars = { products: theProducts, currentUser: currentUser };
      res.render("index", templateVars);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
