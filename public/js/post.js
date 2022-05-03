import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
global.jQuery = require('jquery')

import '../css/post.css'
import './go-to-top-button'
import './bottom-menu'
import './header'

// open posts menu on small screens
$('.posts-button-toggle').on('click', function () {
  $('.menu-dropdown').slideToggle('slow')
})

// loader
// spinner
document.onreadystatechange = function () {
  if (document.readyState !== 'complete') {
    document.querySelector('#post-body').style.visibility = 'hidden'
    document.querySelector('#post-loading-spinner').style.visibility = 'visible'
  } else {
    document.querySelector('#post-loading-spinner').style.display = 'none'
    document.querySelector('#post-body').style.visibility = 'visible'
  }
}
