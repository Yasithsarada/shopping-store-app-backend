const express = require("express");
const { createCategory } = require("../controller/category");
const {
  getSubCategories,
} = require("../controller/subCategory");
const router = express.Router();

//category
router.post("/create-category", createCategory);

//subcategory
router.post("/all-sub-catogeries", getSubCategories);
// router.post('/sub/cc' , getSubCategoryWithCategory);
// router.post('/sub/subCat' , getSubCategoriesOneCategory);

module.exports = router;
