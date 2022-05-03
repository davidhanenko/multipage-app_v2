/* eslint-disable no-undef */
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
global.jQuery = require('jquery')

import '../../css/admin/about.css';



// image upload preview
$(function() {
  $('#image').on('change',function () {
    const file = this.files[0]
    if (file) {
      let reader = new FileReader()
      reader.onload = function (event) {
        $('.image-preview').attr('src', event.target.result)
      }
      reader.readAsDataURL(file)
    }
  })
})


// edit button and area for about
$('.edit-button').on('click', function (event) {
  if ($(this).text().trim() == 'Edit') {
    $(this).text('Close')
  } else {
    $(this).text('Edit')
  }
 $(event.target).closest('.edit').children('.edit-area').slideToggle('slow')
})



// create new about page form
$('.create-form-button').on('click', function () {
  if ($(this).text().trim() == 'Open create form') {
    $(this).text('Close form')
  } else {
    $(this).text('Open create form')
  }
  $('.create-form').slideToggle('slow')
})
