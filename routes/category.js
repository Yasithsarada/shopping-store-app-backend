const express = require("express");
const { createCategory, getCategoriesWithSubcategories } = require("../controller/category");
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

router.get("/all", getCategoriesWithSubcategories);

module.exports = router;
