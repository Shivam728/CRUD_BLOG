const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const domPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);




//initialize slug
mongoose.plugin(slug);
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  snippet: {
    type: String,
  },
  img: {
    type: String,
    default: 'placeholder.jpg',
  },
  slug: { type: String, slug: 'title', unique: true, slug_padding_size: 2 },
});



blogSchema.pre('validate', function (next) {
  //check if there is a description
  if (this.description) {
    this.description = htmlPurify.sanitize(this.description);
    // this.snippet = (htmlPurify.sanitize(this.description).slice(0,10));
    
  
  this.snippet = this.description.slice(0,200);
    
  }

  next();
});

module.exports = mongoose.model('Blog', blogSchema);