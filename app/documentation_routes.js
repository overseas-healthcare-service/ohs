var express = require('express')
var fs = require('fs')
var marked = require('marked')
var path = require('path')
var router = express.Router()
var utils = require('../lib/utils.js')

// Page routes

// Docs index
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/install', function (req, res) {
  var url = utils.getLatestRelease()
  res.render('install', { 'releaseURL': url })
})

// Pages in install folder are markdown
router.get('/install/:page', function (req, res) {
  // If the link already has .md on the end (for GitHub docs)
  // remove this when we render the page
  if (req.params.page.slice(-3).toLowerCase() === '.md') {
    req.params.page = req.params.page.slice(0, -3)
  }
  redirectMarkdown(req.params.page, res)
  var doc = fs.readFileSync(path.join(__dirname, '/documentation/install/', req.params.page + '.md'), 'utf8')
  var html = marked(doc)
  res.render('install_template', {'document': html})
})

// Examples - exampes post here
router.post('/tutorials-and-examples', function (req, res) {
  res.redirect('tutorials-and-examples')
})

// Example routes

// Passing data into a page

router.get('/examples/template-data', function (req, res) {
  res.render('examples/template-data', { 'name': 'Foo' })
})

// Branching

router.get('/apply-for-state-healthcare-overseas/sign-in-register', function (req, res) {
  // get the answer from the query string (eg. ?over18=false)
  var signinregister = req.query.signinregister

  if (signinregister == 'signin') {
    // redirect to the relevant page
    res.redirect('/nada')
  } else if (signinregister == 'verify') {
    // if over18 is any other value (or is missing) render the page requested
    res.redirect('/nada')
  } else if (signinregister == 'register') {
    // if over18 is any other value (or is missing) render the page requested
    res.render('/apply-for-state-healthcare-overseas/create-account')
  }
})

module.exports = router

// Strip off markdown extensions if present and redirect
var redirectMarkdown = function (requestedPage, res) {
  if (requestedPage.slice(-3).toLowerCase() === '.md') {
    res.redirect(requestedPage.slice(0, -3))
  }
  if (requestedPage.slice(-9).toLowerCase() === '.markdown') {
    res.redirect(requestedPage.slice(0, -9))
  }
}
