const Post = require('../../models/post')
const PostParagraph = require('../../models/post-paragraph')
const Price = require('../../models/service-price')
const Service = require('../../models/service')
const { renderEJS } = require('../../middleware/template')
const cloudinary = require('../../utils/cloudinary')
const { validationResult, matchedData } = require('express-validator')
const logger = require('../../utils/logger')

//show add-new post page
module.exports.showAddNewPost = async (req, res) => {
  const services = await Service.find({}, 'title template')
  const prices = await Price.find({}, 'serviceTitle')

  const data = (await req.session.data) || {}

  await renderEJS(res, 'admin/blog/post-new', {
    csrfToken: req.csrfToken(),
    cspNonce: res.locals.cspNonce,
    title: 'Add New Post',
    services,
    prices,
    data,
    page: 'add new post'
  })
}

//create new blog post

// options for cloudinary upload
let optsPostImage = {
  transformation: { width: 700, height: 450, crop: 'fill' },
  quality: 'auto:good',
  fetch_format: 'auto',
  resource_type: 'auto',
  folder: 'Ilona'
}

module.exports.addNewPost = async (req, res) => {
  // max age for input session
  // req.session.cookie.maxAge = 5 * 60 * 1000
  //  validation errors
  let errors = validationResult(req)

  req.session.data = req.body

  if (!errors.isEmpty()) {
    errors = errors.array({ onlyFirstError: true })
    logger.info('From admin/blog page:' + errors[0].message)
    req.flash('error', errors[0].msg)
    res.redirect('back')
  } else {
    try {
      // get post text inputs after validation
      const { postTitle, mainPostParagraph } = matchedData(req)

      const uploader = async (path, opt) => await cloudinary.uploads(path, opt)

      let postImage = null
      if (req.file) {
        if (req.file.bytes > 10000000) {
          req.flash(
            'error',
            'Please review size of images. 10Mb is maximum allowed'
          )
        }
        postImage = await uploader(req.file.path, optsPostImage)
      }

      let newPost = {
        postTitle,
        mainPostParagraph,
        postImage
      }

      await Post.create(newPost)

      req.flash('success', 'New blog post added!')
      req.session.data = null
      res.redirect('/admin')
    } catch (err) {
      logger.error('From admin/blog page:' + err.message)
      req.flash('error', err.message)
      res.redirect('back')
    }
  }
}

// show single post page
module.exports.showPost = async (req, res) => {
  const services = await Service.find({}, 'title template')
  const prices = await Price.find({}, 'serviceTitle')

  const post = await (await Post.findById(req.params.id))
    .populate('postParagraph')
    .execPopulate()
  // session data(input)
  const data = (await req.session.data) || {}

  await renderEJS(res, 'admin/blog/post', {
    csrfToken: req.csrfToken(),
    cspNonce: res.locals.cspNonce,
    title: post.postTitle,
    page: post.postTitle,
    prices,
    services,
    post,
    data
  })
}

// update post
module.exports.updatePost = async (req, res) => {
  const post = await (await Post.findById(req.params.id)).execPopulate()

  try {
    // image upload
    const uploader = async (path, opt) => await cloudinary.uploads(path, opt)

    if (req.file) {
      if (req.file.size >= 10000000) {
        req.flash(
          'error',
          'Please review size of images. 10Mb is maximum allowed'
        )
      } else {
        if (post.postImage.id) {
          await cloudinary.cloudinary.uploader.destroy(post.postImage.id)
          post.postImage = await uploader(req.file.path, optsPostImage)
        } else {
          post.postImage = await uploader(req.file.path, optsPostImage)
        }
      }
    }

    // remove image from current post
    if (req.body.deleteImage) {
      await cloudinary.cloudinary.uploader.destroy(post.postImage.id)

      await post.updateOne({ $unset: { postImage: '' } })
    }

    // validation errors
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
      errors = errors.array({ onlyFirstError: true })
      req.flash('error', errors[0].msg)
    } else {
      // update data
      post.postTitle = req.body.postTitle
      post.mainPostParagraph = req.body.mainPostParagraph

      post.save()

      req.flash('success', 'Post was updated!')
      res.redirect(`/admin/blog/${post.id}`)
    }
  } catch (err) {
    req.flash('error', err.message)
    logger.error('From admin/blog/post page:' + err.message)
    res.redirect(`/admin/blog/${post.id}`)
  }
}

// delete post
module.exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    
    if (req.body.deleteImage) {
      await cloudinary.cloudinary.uploader.destroy(post.postImage.id)
    }
    post.remove()

    req.flash('success', 'Post deleted')
    res.redirect('/admin')
  } catch (err) {
    logger.error('From Post/delete:' + err)
    req.flash('error', err.message)
    res.redirect('back')
  }
}

// add new paragraph to the post
module.exports.addNewParagraph = async (req, res) => {
  const post = await Post.findById(req.params.id)

  // input validation
  let errors = validationResult(req)
  req.session.data = req.body

  if (!errors.isEmpty()) {
    errors = errors.array({ onlyFirstError: true })
    logger.debug('From admin/blog/paragraph:' + errors[0].msg)

    req.flash('error', errors[0].msg)
    res.redirect(`/admin/blog/${post._id}`)
  } else {
    try {
      //  new paragraph data after validation
      const newParagraph = matchedData(req)

      const paragraph = await PostParagraph.create(newParagraph)

      paragraph.save()
      post.postParagraph.push(paragraph)
      post.save()

      req.flash('success', 'New paragraph added')
      // clear input data from session
      req.session.data = null
      res.redirect(`/admin/blog/${post._id}`)
    } catch (err) {
      logger.error('From admin/blog/post/paragraph:' + err.message)
      req.flash('error', err.message)
      res.redirect('back')
    }
  }
}

// edit post' paragraph
module.exports.editParagraph = async (req, res) => {
  let paragraph = req.body.paragraph

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    errors = errors.array({ onlyFirstError: true })
    logger.debug('From admin/post/p:' + errors[0].msg)
    req.flash('error', errors[0].msg)
    res.redirect(`/admin/blog/${req.params.id}`)
  }

  try {
    let newParagraph = { paragraph }

    await PostParagraph.findByIdAndUpdate(req.params.p_id, newParagraph)

    req.flash('success', 'Post paragrapd updated')

    res.redirect(`/admin/blog/${req.params.id}`)
  } catch (err) {
    logger.error('From admin/blog/p_update:' + err.message)
    req.flash('error', err.message)
    res.redirect(`/admin/blog/${req.params.id}`)
  }
}

// delete post' paragraph
module.exports.deleteParagraph = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    const paragraph = await PostParagraph.findByIdAndRemove(req.params.p_id)

    post.postParagraph.pull({ _id: paragraph._id })

    post.save()

    req.flash('success', 'Paragraph removed!')
    res.redirect('back')
  } catch (err) {
    logger.error('From admin/blog/p_delete:' + err.message)

    req.flash('error', err.message)
    res.redirect(`/admin/blog/${req.params.id}`)
  }
}
