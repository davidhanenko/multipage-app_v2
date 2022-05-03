const { Router } = require('express')
const router = Router({ mergeParams: true })
const prices = require('../../controllers/admin/prices')
const catchAsync = require('../../utils/catchAsync')
const { isLoggedIn, roleAdmin } = require('../../middleware/admin')
const { check } = require('express-validator')

//register price routes
const unitPricesRoutes = require('./price-units')
router.use('/:id/units', unitPricesRoutes)

const priceBlockValidation = [
  check('serviceTitle')
    .notEmpty()
    .withMessage('Title is required')
    .not()
    .isString()
    .withMessage('Only string accepted for title field')
    .trim(),
  check('singleTreatment')
    .notEmpty()
    .withMessage('Number of single treatment is required')
    .isNumeric()
    .withMessage('Only numbers accepted for single treatment field')
    .trim(),
  check('multiTreatments')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Only numbers accepted for multi treatments field')
    .trim()
]

//show add-new price block
router.get('/price-new', isLoggedIn, catchAsync(prices.showAddNewPrice))

//upload new service prices block
router.post(
  '/',
  priceBlockValidation,
  isLoggedIn,
  roleAdmin,
  catchAsync(prices.addNewPrice)
)

//show service prices block
router.get('/:id', isLoggedIn, catchAsync(prices.showPrices))

//edit & delete service price block
router
  .route('/:price_id')
  .put(
    priceBlockValidation,
    isLoggedIn,
    roleAdmin,
    catchAsync(prices.editPriceBlock)
  )
  .delete(isLoggedIn, roleAdmin, catchAsync(prices.deletePriceBlock))

module.exports = router
