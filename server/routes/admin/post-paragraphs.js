const { Router } = require('express')
const router = Router({ mergeParams: true })
const {
  addNewParagraph,
  editParagraph,
  deleteParagraph
} = require('../../controllers/admin/blog')
const { isLoggedIn, roleAdmin } = require('../../middleware/admin')
const catchAsync = require('../../utils/catchAsync')
const { check } = require('express-validator')

const postParagraphValidation = [
  check('paragraph')
    .notEmpty()
    .withMessage('Some text is required')
    .isString()
    .withMessage('Only string accepted for title field')
    .trim()
]

// add new paragraph to the post
router.post(
  '/',
  postParagraphValidation,
  isLoggedIn,
  roleAdmin,
  catchAsync(addNewParagraph)
)

//edit & delete post' paragraph
router
  .route('/:p_id')
  .put(
    postParagraphValidation,
    isLoggedIn,
    roleAdmin,
    catchAsync(editParagraph)
  )
  .delete(isLoggedIn, roleAdmin, catchAsync(deleteParagraph))

module.exports = router
