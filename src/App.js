import React, { useState } from 'react';
import './App.css';
import AboutPage from './About.js';
import FirstPage from './First.js';
import SubBytesPage from './SubBytes.js';
import ShiftRowsPage from './ShiftRows.js';
import MixColumnsPage from './MixColumns.js';
import AddRoundKeyPage from './AddRoundKey.js';




//We are building the state matrix the wrong way round
//Just fill it out and transpose for the sake of sanity..
const test_data = [0x8e, 0x9f, 0xf1, 0xc6, 0x4d, 0xdc, 0x01, 0xc6, 0xa1, 0x58, 0x01, 0xc6, 0xbc, 0x9d, 0x01, 0xc6];
const test_key = [0xdb, 0xf2, 0x01, 0xc6, 0x13, 0x0a, 0x01, 0xc6, 0x53, 0x22, 0x01, 0xc6, 0x45, 0x5c, 0x01, 0xc6];
const coeffs = [3, 1, 1, 2];



function App() {
  const [page, setPage] = useState('first');
  const pageObjects = { 
    'about': <AboutPage className={'page'} />,
    'first': <FirstPage className={'page'} input={test_data} />,
    'subBytes': <SubBytesPage className={'page'} input={test_data} />,
    'shiftRows': <ShiftRowsPage className={'page'} input={test_data} />,
    'mixCols': <MixColumnsPage className={'page'} poly={coeffs} input={test_data} />,
    'addRoundKey': <AddRoundKeyPage className={'page'} input={{data: test_data, roundKey: test_key}} />
  };

  /*
  const MathJaxInclude = document.createElement('script');
  MathJaxInclude.id = "MathJax-script";
  MathJaxInclude.async = true;
  MathJaxInclude.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  document.head.appendChild(MathJaxInclude);*/
  


/*
  let mjAPI = require('mathjax-node');
  mjAPI.config({
    MathJax: {
      // traditional MathJax configuration
    }
  });
  var yourMath = 'E = mc^2';

  mjAPI.typeset({
    math: yourMath,
    format: "TeX", // or "inline-TeX", "MathML"
    mml:true,      // or svg:true, or html:true
  }, function (data) {
    if (!data.errors) {console.log(data.mml)} 
  });
  */


  const KatexCssInclude = document.createElement('link');
  KatexCssInclude.href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css";
  KatexCssInclude.rel="stylesheet";
  document.head.appendChild(KatexCssInclude);

  const updatePage = (p) => {
    setPage(p);

  };

  return (
    <div id='sub'>
      <div class='topNav'>
        <div class='navElt' onClick={() => updatePage('about')}>About</div>
        <div class='navElt' onClick={() => updatePage('first')}>Prerequisites</div>
        <div class='navElt' onClick={() => updatePage('subBytes')}>SubBytes</div>
        <div class='navElt' onClick={() => updatePage('shiftRows')}>ShiftRows</div>
        <div class='navElt' onClick={() => updatePage('mixCols')}>MixCols</div>
        <div class='navElt' onClick={() => updatePage('addRoundKey')}>AddRoundKey</div>
      </div>

      {<div id='main'>{pageObjects[page]}</div>}
      
    </div>
  );
}

export default App;
