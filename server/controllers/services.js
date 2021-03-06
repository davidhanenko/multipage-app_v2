const Service = require('../models/service')
const Price = require('../models/service-price')
const DisplayContent = require('../models/display-content')
const { renderEJS } = require('../middleware/template')


// show service page
module.exports.services = async (req, res) => {
  // logout from admin
  req.logout()
  // service choosen by it template name
  const service = await Service.findOne({
    template: req.params.template
  }).populate('imageBeforeAfter')
  // all services for dropdown nav menu
  const services = await Service.find({})
  // all prices to be rendered  current service page
  const prices = await Price.find({}).populate('unitPrice')
  // display prices on website mode
  // display mode for prices
  const displayPrices = await DisplayContent.findOne({ content: 'prices' })
  // display mode for about page
  const displayAbout = await DisplayContent.findOne({ content: 'about' })
  // display mode for gallery page
  const displayGallery = await DisplayContent.findOne({ content: 'gallery' })
  // get current setvice file name from path and render it from views with custom renderEJS function (/server/middleware/template.js)
  await renderEJS(res, `our_services/${service.template}`, {
    title: `${
      // Upper casing first character for menu and title
      service.titleTag?.charAt(0).toUpperCase() + service.titleTag?.slice(1) ||
      service.title.charAt(0).toUpperCase() + service.title.slice(1)
    } | Facial treatments | Ilona beauty salon | Brooklyn`,
    page: service.title,
    cspNonce: res.locals.cspNonce,
    // description of page for SEO
    description: service.descriptionMain,
    service,
    services,
    prices,
    displayPrices,
    displayAbout,
    displayGallery
  })
}
