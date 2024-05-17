const mongoose = require("mongoose");
var slugify = require("slugify");
const crypto = require("crypto");
// import the slug package
// const slug = require('mongoose-slug-generator');
//Initialize
// mongoose.plugin(slug);

const postSchema = mongoose.Schema({
  title: String,
  body: String,
  //Define the slug parameters
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
});
postSchema.set("timestamps", true);
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
