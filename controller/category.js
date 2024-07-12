const asyncHandler = require("express-async-handler");
const Category = require("../model/category.model");

const createCategory = asyncHandler(async(req, res ) => {
    const {name  , categoryId} =  req.body;
    const category = await Category.create({
        name : name,
        category : categoryId ? categoryId : null
    })
    if(!category) return res.status(401).json({ message: "Could not create category.. Try again!" });
    return res.status(200).json({ category: category});

});

const getCategoriesWithSubcategories = asyncHandler(async(req, res) => {
    // console.log("getttttttttttttttttttttttt")
    const categories = await Category.find({ category: null }).populate('subcategories');
    if (!categories) return res.status(404).json({ message: "No categories found" });
    return res.status(200).json({ categories });
});
const getMainCategories = asyncHandler(async(req, res) => {
    try {
        console.log("getttttttttttttttttttttttt")
        const categories = await Category.find({ category: null });
        if (!categories) return res.status(404).json({ message: "No categories found" });
        return res.status(200).json({ categories });
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error.message });
    }
});


module.exports = {
    createCategory,
    getCategoriesWithSubcategories,
    getMainCategories
}