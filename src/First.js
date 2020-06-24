import React, { useState, useEffect } from 'react'
import Box from './Box.js'
import './First.css'
const Latex = require('react-latex');

//This is an ugly (hopefully temporary solution) until I can get MathJax working
//with Node nicely
function Reveal(props) {
  useEffect(() => window.MathJax.typeset(document.getElementsByClassName('reveal')));
  return(<div class='reveal'>{props.over}</div>);
}

function HoverBox(props) {
  const [isShown, setIsShown] = useState(false);
  return (
    <div class='hoverable' onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
      {props.under}
      {isShown && <div class='reveal'><Tex>{props.over}</Tex></div>}
    </div>
  );
}

function FirstPage(props) {

  return (
    <div className='page'>
      <h1>AES stuff</h1>
      <h2>Prerequisites</h2>
      <p>For Rijndael, we work in the finite field of order \( 2^8 = 256\), which we denote \( \mathbb{'{'}F{'}'}(2^8)\) throughout. This is a pretty large object to try and think about, so it will help us to instead consider an isomorphism to a slightly nicer object. The authors of Rijndael chose to use:</p>
      <Tex>This is a $test$ my guy</Tex>
      <HoverBox under={
      <p>\[
        \mathbb{'{F}'}(2^8) \cong \frac{'{'}\mathbb{'{F}'}(2)[x]{'}'}{'{'}(x^8 + x^4 + x^3 + x + 1){'}'}
      \]</p>
      } over={<p>Why does this work? $ \mathbb{'{'}F{'}'}(2) $ is a field by definition, so its polynomial ring is a Euclidian domain. If we can quotient by a polynomial of order 8, then all elements in the quotient have a unique representative of order strictly less than 8, so the quotient ring will be of the correct order. Since $ x^8 + x^4 + x^3 + x + 1 $ is a prime element in this ring, this quotient is therefore an integral domain. All finite integral domains are fields, and finite fields are unique up to isomorphism, and so this is the field we want.</p>} />

      <p>It turns out this is a particularly nice object to study for a couple of reasons. Firstly, and most obviously, the width of a byte is 8, so the field has as many elements as there are possible bytes. Via the isomorphism above, we can represent each element as a polynomial of degree strictly less than 8, with coefficients in \(\mathbb{'{'}F{'}'}(2)\), which may be stored as a single byte. Here we will represent numbers in this field like this, with the bytes in green hexadecimal, e.g.
      \[
        x^5 + x^3 + x^2 = {'{\\color{green}\\{1c\\}}'}.
      \]</p>

      <p>We also note that each element is its own additive inverse; this is again immediately clear by thinking about the isomorphism.</p>

      <p>Rijndael works on two-dimensional blocks, which each have four rows and a fixed number of columns. The typical number of columns is four, so we chunk our plaintext into blocks of 16 bytes, and encrypt each block individually. We call this array the <i>state</i> when describing the algorithm. The box below represents a state of the algorithm - you can edit these to see how the algorithm behaves on different data.</p>

      <div className='boxContainerOuter'>
        <div className='boxContainerInner'>State:
          <Box data={props.input} />
        </div>
      </div>
      
      <p>As with all encryption schemes, we begin with two pieces of information: the <i>plaintext</i> and the <i>key</i>. The cipher consist of several rounds of the same four basic operations. To this end, we expand a given key into several, and one is used for each round - this is called <i>key expansion</i>, and produces a set of <i>round keys</i>. Each round consists of the steps:
      </p>
      <div id='steps'>
        <div className='step'>Substitute Bytes</div>
        <div className='step'>Shift Rows</div>
        <div className='step'>Mix Columns</div>
        <div className='step'>Add Round Key</div>
      </div>
      The AES specification states we go in the order:
      <div className='listContainer'><ul>
        <li>Add Round Key</li>
        <ul>
          -Repeat-
          <li>Sub Bytes</li>
          <li>Shift Rows</li>
          <li>Mix Colums</li>
          <li>Add Round Key</li>
          -9 times-
        </ul>
        <li>Sub Bytes</li>
        <li>Shift Rows</li>
        <li>Add Round Key</li>
      </ul></div>
      Note that we don't mix columns on the final go round; it adds no extra diffusion.
    </div>
  );
}

export default FirstPage;