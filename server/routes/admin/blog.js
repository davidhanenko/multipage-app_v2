const { Router } = require('express')
const router = Router({ mergeParams: true })
const multer = require('../../utils/multer')
const blog = require('../../controllers/admin/blog')
const catchAsync = require('../../utils/catchAsync')
const { isLoggedIn, roleAdmin } = require('../../middleware/admin')
const { check } = require('express-validator')

//register post paragraphs routes
const postParagraphsRoutes = require('./post-paragraphs')
router.use('/:id/paragraphs', postParagraphsRoutes)

const postValidation = [
  check('postTitle')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Only string accepted for title field')
    .trim(),
  check('mainPostParagraph')
    .notEmpty()
    .withMessage('Main paragraph is required')
    .isString()
    .withMessage('Only string accepted for main paragraph field')
    .trim()
]

//show add-new post page
router.get('/post-new', isLoggedIn, catchAsync(blog.showAddNewPost))

// create new blog post
router.post(
  '/',
  isLoggedIn,
  roleAdmin,
  multer.upload.single('postImage'),
  postValidation,
  catchAsync(blog.addNewPost)
)

// show post page
router
  .route('/:id')
  .get(isLoggedIn, catchAsync(blog.showPost))
  .put(
    isLoggedIn,
    roleAdmin,
    multer.upload.single('postImage'),
    postValidation,
    catchAsync(blog.updatePost)
  )

// delete post
router.delete('/:id', isLoggedIn, roleAdmin, catchAsync(blog.deletePost))

module.exports = router
