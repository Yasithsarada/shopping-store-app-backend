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

module.exports = {
    createCategory
}