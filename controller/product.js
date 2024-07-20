const asyncHandler = require("express-async-handler"); 
const Category = require("../model/category.model");
const multer = require("multer");
const Product = require("../model/product.model");
// const upload = multer({ storage: storage })

exports.addProduct = asyncHandler(async (req, res) => {
  console.log('At least came ')
  console.log(req.body)
  try {
    const { title, price, category, quantity,  description  , images , sizesAndColors } = req.body;
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
  console.log(sizesAndColors)
  
    const newProduct = await Product.create({
      title: title,
      price: price,
      category: category,
      // category: '6617983c7da2526b9a0701ac',
      quantity: quantity,
      images: images,
      description: description,
      averageRating :5.0,
      sizesAndColors:sizesAndColors
    });
    if (!newProduct)
      return res.status(400).json({ message: "Product not added..Try again !" });
  
    res.status(200).json({ product: newProduct });
  } catch (error) {
    console.log(error.message);
  return res.status(400).json({ error: error.message });
  }
});

exports.updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, price, category, quantity, description, images, averageRating } = req.body;

    // Find the product by ID
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    

    // Update product fields
    product.title = title || product.title;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    product.description = description || product.description;
    product.images = images || product.images;
    product.averageRating = averageRating || product.averageRating;

    
    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


exports.getProduct = asyncHandler(async (req, res) => {
  console.log("getProduct");
  const id = req.query.id;
  console.log(id);

  try {
    const product = await Product.findOne(
      { _id: id }
    );
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found..Try again!" });
    }

    res.status(200).json({ product: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
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
exports.searchProducts = asyncHandler(async (req, res) => {
  console.log("Searching products...")
  const searchQuery = req.query.searchQuery;
  console.log(searchQuery)
  try {
    // const products = await Product.find({title : searchQuery});
    const products = await Product.find({title : { $regex: '.*' + searchQuery + '.*' ,$options:'i' } });
    
    if (products.length == 0) return res.status(404).json({ message: "No matching Products availble !"});
    
    // if (!products) return res.status(404).json({ message: "Product not found"});

    return res.status(200).json({products: products});
  } catch (error) {
    
  } return res.status(500).json({ error: error.message });
});
