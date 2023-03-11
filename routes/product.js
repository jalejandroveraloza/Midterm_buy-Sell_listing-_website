const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Product page
  router.get("/:id", (req, res) => {
    const id = req.params.id;

    db.query(
      `SELECT * FROM users where users.is_admin = true;
    SELECT * FROM products WHERE id = ${id};`
    )
      .then((data) => {
        const currentUser = req.session.user_id;
        const adminData = data[0].rows;
        const product = data[1].rows[0];
        const templateVars = {
          product,
          currentUser,
          message: "",
          admin: adminData,
        };
        res.render("products", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Send message to seller on product page
  router.post("/message", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
