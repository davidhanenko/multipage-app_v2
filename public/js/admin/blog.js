import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
global.jQuery = require('jquery')

import '../../css/admin/blog.css'

// post image upload prevew
$(function () {
  $('#postImage').on('change', function () {
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

// edit button and edit area for text manipulation on post title
$('.title-edit-button').on('click', function () {
  if ($(this).text().trim() == 'Edit') {
    $(this).text('Close')
  } else {
    $(this).text('Edit')
  }
  $('.title-edit-area').slideToggle('slow')
})

// edit button and edit area for text manipulation
$('.edit-button').on('click', function (event) {
  if ($(this).text().trim() == 'Edit') {
    $(this).text('Close')
  } else {
    $(this).text('Edit')
  }
  $(event.target).closest('.edit').children('.edit-area').slideToggle('slow')
})

// spinner for creating new post
$('#create-post-btn').on('click', function () {
  $('#loading-new-post-spinner').show()
})

// spinner for uodating post
$('#update-btn').on('click', function () {
  $('.update-spinner').show()
})


