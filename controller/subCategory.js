const asyncHandler = require("express-async-handler");
const SubCategory = require("../model/subCategory.model");
const Category = require("../model/category.model");

const getSubCategoryWithCategory = asyncHandler(async (req, res) => {
  const subCategoryId = "6617983c7da2526b9a0701ac";
  try {
    const subCategory = await Category.findById(subCategoryId).populate(
      "category"
    );
    if (!subCategory) return res.status(400).json({ message: e.message });
    res.status(200).json({ subCategory: subCategory });
  } catch (error) {
    // Handle error
    console.error("Error retrieving subCategory:", error);
    throw error;
  }
});

const getSubCategoriesOneCategory = asyncHandler(async (req, res) => {
  const categoryId = "6616fe26ab7f69491f3d8b20"; // Assuming you're passing category ID through URL parameters
  try {
    // Find all subcategories that belong to the specified category
    const subCategories = await SubCategory.find({ category: categoryId });

    if (!subCategories || subCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No subcategories found for the given category ID" });
    }

    // If subcategories are found, return them
    res.status(200).json({ subCategories: subCategories });
  } catch (error) {
    // Handle error
    console.error("Error retrieving subcategories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getSubCategories = asyncHandler(async (req, res) => {
  const categoryId = "6617977025e75bc3c150fc38";
  // let subCategories = [];
  try {
    async function getSubCategories(categoryID) {
      let categories = [];
      const category = await Category.findById(categoryID).populate("category");
      const subCategories = await Category.find({
        category: categoryID,
      }).populate("category");
      for (const subcategory of subCategories) {
        const existCategory = await getSubCategories(subcategory._id);

        if (existCategory) {
          categories.push(existCategory);
        }
        // console.log(subcategory);
      }

      return {
        _id: category._id,
        name: category.name,
        children: categories,
      };
      // res.json(subCategories)
    }
    let categoryhirechy = await getSubCategories(categoryId);
    // console.log(categoryhirechy)
    if (!categoryhirechy) return res.status(400).send("error");
    res.status(200).json({ hirechy: categoryhirechy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getSubCategoryWithCategory,
  getSubCategoriesOneCategory,
  getSubCategories,
};
