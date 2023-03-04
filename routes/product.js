const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Product page
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    //console.log("id: ", id);
    db.query(`SELECT * FROM users where users.is_admin = true;
    SELECT * FROM products WHERE id = ${id};`)
    .then(data => {
      console.log("data.rows: ", data.rows)
      const currentUser = req.session.user_id;
      const adminData = data[0].rows;
      const products = data[1].rows;
      const templateVars = { products: products, currentUser: currentUser, message: "", admin: adminData };
      res.render("products", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });


  //strech feature **
  // Send message to seller on product page
  router.post("/message", (req, res) => {
    db.query(`SELECT * FROM users;`)
    .then(data => {
      res.redirect("/");
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  return router;
};
