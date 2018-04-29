const express = require('express')
const cookieParser = require('cookie-parser')

var app = express()

app.use(cookieParser())