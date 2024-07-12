const asyncHandler = require("express-async-handler");
const Product = require("../model/product.model");
const Category = require("../model/category.model");
const multer = require("multer");
// const upload = multer({ storage: storage })

exports.addProduct = asyncHandler(async (req, res) => {
  console.log('At least came ')
  const { title, price, category, quantity,  description  , images } = req.body;
  try {
  //   if (!req.files || req.files.length === 0) {
  //     console.log("No files uploaded")
  //     return res.status(400).send({ message: 'No files uploaded.' });
  // }
  //this is how uploaded images urls are receved
  //   const imageUrl = [];
  //     req.files.forEach((file) => {
  //         imageUrl.push(file.location);
  //       })
  // console.log(imageUrl);
   
    
    // const upload = multer({ storage: storage })
    // const isExistProduct = await Product.findOne({})
  console.log(title)
  console.log(price)
  console.log(category)
  console.log(quantity)
  console.log(images)
  console.log(description)
    const newProduct = await Product.create({
      title: title,
      price: price,
      // category: category,
      category: '6617983c7da2526b9a0701ac',
      quantity: quantity,
      images: images,
      description: description,
    });
    if (!newProduct)
      return res.status(400).json({ message: "Product not added..Try again !" });
  
    res.status(200).json({ product: newProduct });
  } catch (error) {
    console.log(error.message);
  res.status(400).json({ error: error.message });
  }
});

exports.getProduct = asyncHandler(async (req, res) => {
  console.log("getproduct");
  const id = req.params.id;
  console.log(id);
  const product = await Product.findById(id);
  console.log(product);
  if (!product) return;
  res.status(400).json({ message: "Product not found..Try again !" });

  res.status(200).json({ product: product });
});

exports.getCategoryProducts = asyncHandler(async (req, res) => {
  try {
    // console.log("getproduct");

    const categoryId = req.params.id;
    let products = [];

    async function getProducts(categoryId) {
      const subCatergories = await Category.find({ category: categoryId });

      for (const subCatergory of subCatergories) {
        await getProducts(subCatergory._id);

        const productsFound = await Product.find({
          category: subCatergory._id,
        }).populate("category");
        //  products = products.concat(productsFound);
        if (productsFound) products.push(...productsFound);

        // console.log("products : " + productsFound)
        // if(product) products.push(product)
      }
      // console.log("products outside for of " + products);
      return products;
    }

    let productList = await getProducts(categoryId);

    // console.log("productList :" + productList);
    if (!productList || productList.length === 0)
      return res
        .status(400)
        .json({ message: "Products not found..Try again !" });

    res.status(200).json({ productList: productList });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
exports.getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    
    if (products.length == 0) return res.status(404).json({ message: "Products not availble !"});
    
    if (!products) return res.status(404).json({ message: "Product not found"});

    return res.status(200).json({products: products});
  } catch (error) {
    
  } return res.status(500).json({ error: error.message });
});
