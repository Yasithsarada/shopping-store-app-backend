const mongoose = require("mongoose");
var slugify = require("slugify");
const crypto = require("crypto");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  //   categoryId: {
  //     type: String,
  //     required: true,
  //   },
  category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  default: null, // The root subcategories will have no parent
},
  slug: {
    type: String,
    unique: true,
    default: function () {
      // Use slugify to generate the slug from the title
      return slugify(
        this.name +
          " " +
          crypto.randomBytes(64).toString("hex").substring(0, 6),
        { lower: true, strict: true, trim: true }
      );
    },
  },
});


// Define a virtual property for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'category',
});

// Ensure virtual fields are included in JSON and Object output
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
