import React, { useState } from 'react'
import Box from './Box.js'

function FirstPage(props) {
    return (
      <Box data={props.input}/>
    );
  }

export default FirstPage;