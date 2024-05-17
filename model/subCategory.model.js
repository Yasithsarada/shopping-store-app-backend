// const mongoose = require("mongoose");
// var slugify = require("slugify");
// const crypto = require("crypto");

// const SubCategorySchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please add a sub category Name"],
//   },
// //   subCategoryId: {
// //     type: String,
// //     required: true,
// //   },
// // parent: {
// //   type: mongoose.Schema.Types.ObjectId,
// //   ref: 'SubCategory',
// //   default: null, // The root subcategories will have no parent
// // },
//   category: {
//     type: mongoose.Schema.Types.ObjectId ,
//     ref  : 'Category',
//     required: true,
//   },
//   slug: {
//     type: String,
//     unique: true,
//     default: function () {
//       // Use slugify to generate the slug from the title
//       return slugify(
//         this.name + " " +crypto.randomBytes(64).toString("hex").substring(0, 6),
//         { lower: true, strict: true, trim: true }
//       );
//     },
//   },

// });

// const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

// module.exports = SubCategory;
