/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();


//Main route
router.get('/', (req, res) => {
  res.render('users');
});


//Get all listings
router.get("/listings", (req, res) => {
  const listings = listingsDatabase;

  const templateVars = { listings };

  res.render("listing_index", templateVars);
});


//POST (create) a listing
router.post("/listings", (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const brand = req.body.brand;
  const photo_url = req.body.photo_url;
  const listing = req.body.listing;

  const newListingObj = { name, description, price, brand, photo_url, listing };
  const queryString = `INSERT INTO products (name, description, price, brand, photo_url, listing)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`

  listingDatabase = { newListingObj };
  res.redirect(`/listings/${newListingObj}`);
});


// POST(modify) a listing
router.post("/listings/:id/", (req, res) => {
  const listingID = req.params.id;
  const listing = req.body.listing;

  //if the URL does not exist, thrown an error
  if (!listingDatabase[listing]) {
    return res.status(404).send(`The listing ${listingID} does not exist in the database`);
  }

  listingDatabase[listingID].listing = listing;
  res.redirect('/listings');
});



//DELETE existing listings
router.post("/listings/:id/delete", (req, res) => {
  const listingID = req.params.id;

  // if requested short url is not in the shortURLs array
  if (!listingDatabase[listingID]) {
    return res.status(404).send("The following listing does not exist in the database!");
  }

  delete listingDatabase[listingID];

  res.redirect("/listings");
});


module.exports = router;


