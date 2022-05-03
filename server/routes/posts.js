const { Router } = require('express')
const router = Router({ mergeParams: true })
const { post } = require('../controllers/post.js')
const catchAsync = require('../utils/catchAsync')

// open each post on a new page
router.get('/:post_id', catchAsync(post))

module.exports = router
