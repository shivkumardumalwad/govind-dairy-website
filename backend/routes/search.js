// backend/routes/search.js
router.get("/", async (req, res) => {
  const query = req.query.q;
  const products = await Product.find({ name: new RegExp(query, "i") });
  res.json(products);
});
