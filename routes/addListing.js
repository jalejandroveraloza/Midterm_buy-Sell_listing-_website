const express = require('express');
const router = express.Router();

module.exports = (db) => {

  //add a new product page (admin access only)
  router.get("/addListing", (req, res) => {
    db.query(`SELECT * FROM users WHERE is_admin = true; SELECT * FROM products;`)
      .then(data => {
        const currentUser = req.session.user_id;
        const products = data[1].rows[1];
        const templateVars = { products, currentUser }
        if (!templateVars.currentUser) {
          res.json({ result: "Unauthorized Access" })
        }
        res.render("product_add", templateVars)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //add product form
  router.post("/addListing", (req, res) => {

    const title = req.body.title;
    const description = req.body.description;
    const thumbnail_url = req.body.thumbnail_url;
    const photo_url = req.body.photo_url;
    const brand = req.body.brand;
    const size = req.body.size;
    const price = req.body.price;
    const feature = req.body.feature;

    const queryParams = [title, description, thumbnail_url, photo_url, brand, size, price, feature];
    const queryString = `INSERT INTO products (title, description, thumbnail_url, photo_url, brand, size, price, feature)
    VALUES ($1, $2, $3, $4 ,$5, $6, $7, $8) RETURNING *;`

    db.query(queryString, queryParams)
      .then(data => {
        const currentUser = req.session.user_id
        const products = data.rows[1];
        const templateVars = { products, currentUser, message: "Your product has been added" }
        res.render("product_add", templateVars);
      })
      .catch(err => {
        res.status(500)
        res.json({ error: err.message });
      });
  })
  return router;
};
