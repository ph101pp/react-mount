// NOTE: re-compile bundle with: webpack -d --display-reasons --display-chunks --progress

// ensure react and react-mount are in the bundle

import React from 'react'
import mount from 'react-mount'

// expose React and ExampleApplication component to global namespace

require('expose?React!react')
require('expose?ExampleApplication!./example')
