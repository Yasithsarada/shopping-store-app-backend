const mongoose = require("mongoose");
var slugify = require("slugify");
const crypto = require("crypto");

const productSchema = mongoose.Schema({
  // name: {
  //   type: String,
  //   required: [true, "Please add a product Name"],
  // },
  title: {
    type: String,
    required: [true, "Please add a product title"],
  },
  price: {
    type: String,
    trim: true,
    required: [true, "Please add a price for the product"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  images: {
    
      type: Array,

},
  slug: {
    type: String,
    unique: true,
    default: function () {
      // Use slugify to generate the slug from the title
      return slugify(
        this.title +
          " " +
          crypto.randomBytes(64).toString("hex").substring(0, 6),
        { lower: true, strict: true, trim: true }
      );
    },
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please add a product Description"],
    maxlength: 2000,
  },
  averageRating : {   
    type: Number,
    
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
