import React, { useState } from 'react'
import Box from './Box.js'
import './First.css'

//Temp solution
//function H() {
//  return {'\\{'}
//}

function FirstPage(props) {
  return (
    <div id='firstPage'>
      <h1>AES stuff</h1>
      <h2>Prerequisites</h2>
      <p>For Rijndael, we work in the finite field of order \( 2^8 = 256\), which we denote \( \mathbb{'{'}F{'}'}(2^8)\) throughout. This is a pretty large object to try and think about, so it will help us to instead consider an isomorphism to a slightly nicer object. The authors of Rijndael chose to use:
      
      \[
        \mathbb{'{'}F{'}'}(2^8) \cong \frac{'{'}\mathbb{'{'}F{'}'}(2)[x]{'}'}{'{'}(x^8 + x^4 + x^3 + x + 1){'}'}
      \]  
      It turns out this is a particularly nice object to study for a couple of reasons. Firstly, and most obviously, the width of a byte is 8, so the field has as many elements as there are possible bytes. Via the isomorphism above, we can represent each element as a polynomial of degree strictly less than 8, with coefficients in \(\mathbb{'{'}F{'}'}(2)\), which may be stored as a single byte. Here we will represent numbers in this field like this, with the bytes in green hexadecimal, e.g.
      \[
        x^5 + x^3 + x^2 = {'\\color\{green\}\{\\{'}1c{'\}\\}'}.
      \]
      Rijndael works on two-dimensional blocks, which each have four rows and a fixed number of columns. The typical number of columns is four, so we chunk our plaintext into blocks of 16 bytes, and encrypt each block individually. We call this array the <i>state</i> when describing the algorithm. The box below represents a state of the algorithm - edit this to see how the algorithm behaves on different data!

      As with all encryption schemes, we begin with two pieces of information: the <i>plaintext</i> and the <i>key</i>. 
      </p>
      <Box data={props.input}/>
    </div>
  );
}

export default FirstPage;