const Post = require('../models/post')
const Service = require('../models/service')
const Contact = require('../models/contact')
const DisplayContent = require('../models/display-content')
const MainTag = require('../models/main-tag')
const { renderEJS } = require('../middleware/template')

module.exports.post = async (req, res) => {
  // logout from admin
  req.logout()
  // post choosen by id
  const post = await (await Post.findById(req.params.post_id))
    .populate('postParagraph')
    .execPopulate()
  // all posts to spread on post page
  const posts = await Post.find({}, 'postTitle postImage mainPostParagraph')
  // servises to reveal into dropdown menu
  const services = await Service.find({}, 'title template')
  // contacts info to reveal into dropdown menu
  const contacts = await Contact.find({})
  // display mode for prices
  const displayPrices = await DisplayContent.findOne({ content: 'prices' })
  // display mode for about page
  const displayAbout = await DisplayContent.findOne({ content: 'about' })
  // display mode for gallery page
  const displayGallery = await DisplayContent.findOne({ content: 'gallery' })
  const mainTags = await MainTag.findOne({})

  await renderEJS(res, 'blog/post', {
    page: 'post',
    title: `${post.postTitle} | ${mainTags.title}`,
    description: 'post',
    cspNonce: res.locals.cspNonce,
    post,
    posts,
    services,
    contacts,
    displayPrices,
    displayAbout,
    displayGallery
  })
}
