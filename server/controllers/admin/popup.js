const Popup = require('../../models/popup')
const Service = require('../../models/service')
const Price = require('../../models/service-price')
// const cloudinary = require('../../utils/cloudinary')
const { renderEJS } = require('../../middleware/template')
// const { validationResult } = require('express-validator')
const logger = require('../../utils/logger')

//show popup page
module.exports.showPopupPage = async (req, res) => {
  const popupCurrent = await Popup.findOne({ current: true })
  const popups = await Popup.find({})
  const services = await Service.find({}, 'title template')
  const prices = await Price.find({}, 'serviceTitle')
  await renderEJS(res, 'admin/popup/popup', {
    csrfToken: req.csrfToken(),
    cspNonce: res.locals.cspNonce,
    popups,
    popupCurrent,
    services,
    prices,
    title: 'Popup messages',
    page: 'popup'
  })
}

// create new popup message
module.exports.createNewMessage = async (req, res) => {
  try {
    const {
      message,
      title,
      titleFontSize,
      titleColor,
      titlePosition,
      msgFontSize,
      msgColor,
      msgBgColor
    } = req.body

    let newMessage = {
      message,
      title,
      titleFontSize,
      titleColor,
      titlePosition,
      msgFontSize,
      msgColor,
      msgBgColor
    }

    await Popup.create(newMessage)
    res.redirect('/admin/popups')
  } catch (err) {
    logger.error('From admin/popup page:' + err.message)
    req.flash('error', err.message)
    res.redirect('back')
  }
}

// remove from main page
module.exports.removeMsg = async (req, res) => {
  try {
    await Popup.findOneAndUpdate({ current: true }, { current: false })
    req.flash('success', 'Message removed from main page')
    res.redirect('/admin/popups')
  } catch (err) {
    logger.error('From Popups/delete:' + err)
    req.flash('error', err.message)
  }
}

// set as current on main page
module.exports.setMsg = async (req, res) => {
  const popup = await Popup.find({ current: true })

  try {
    // not possible set current message if one is already selected
    if (popup && popup.length > 0) {
      req.flash('error', 'Before set new, remove current popup message')
      return res.redirect('back')
    } else {
      await Popup.findByIdAndUpdate(req.params.id, { current: true })
      req.flash('success', 'Message set as current')
      res.redirect('/admin/popups')
    }
  } catch (err) {
    logger.error('From Popups/set:' + err)
    req.flash('error', err.message)
  }
}

// delete popup-message
module.exports.deleteMsg = async (req, res) => {
  try {
    await Popup.findByIdAndDelete(req.params.id)
    req.flash('success', 'Message deleted')
    res.redirect('/admin/popups')
  } catch (err) {
    logger.error('From Popups/delete:' + err)
    req.flash('error', err.message)
  }
}

//show popup-message edit page
module.exports.showPopupEditPage = async (req, res) => {
  const popup = await Popup.findById(req.params.id)
  const services = await Service.find({}, 'title template')
  const prices = await Price.find({}, 'serviceTitle')
  await renderEJS(res, 'admin/popup/popup-message', {
    csrfToken: req.csrfToken(),
    cspNonce: res.locals.cspNonce,
    popup,
    services,
    prices,
    title: 'Edit popup message',
    page: 'popup-message'
  })
}

// update popup message
module.exports.updateMessage = async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id)

    const {
      message,
      title,
      titleFontSize,
      titleColor,
      titlePosition,
      msgFontSize,
      msgColor,
      msgBgColor
    } = req.body

    popup.message = message
    popup.title = title
    popup.titleFontSize = titleFontSize
    popup.titleColor = titleColor
    popup.titlePosition = titlePosition
    popup.msgFontSize = msgFontSize
    popup.msgColor = msgColor
    popup.msgBgColor = msgBgColor

    popup.save()
    req.flash('success', 'Message updated!')
    res.redirect(`/admin/popups/popup-message/${popup.id}`)
  } catch (err) {
    logger.error('From admin/popup page:' + err.message)
    req.flash('error', err.message)
    res.redirect('back')
  }
}
