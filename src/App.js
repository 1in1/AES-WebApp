import React, { useState } from 'react';
import './App.css';
import AboutPage from './About.js';
import FirstPage from './First.js';
import SubBytesPage from './SubBytes.js';
import ShiftRowsPage from './ShiftRows.js';
import MixColumnsPage from './MixColumns.js';
import AddRoundKeyPage from './AddRoundKey.js';


function App() {
  document.title = 'Interactive AES - asg58'
  const KatexCssInclude = document.createElement('link');
  KatexCssInclude.href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css";
  KatexCssInclude.rel="stylesheet";
  document.head.appendChild(KatexCssInclude);
  const Latex = require('react-latex');

  //We are building the state matrix the wrong way round
  //Just fill it out and transpose for the sake of sanity..
  const test_data = [0x8e, 0x9f, 0xf1, 0xc6, 0x4d, 0xdc, 0x01, 0xc6, 0xa1, 0x58, 0x01, 0xc6, 0xbc, 0x9d, 0x01, 0xc6];
  const test_key = [0xdb, 0xf2, 0x01, 0xc6, 0x13, 0x0a, 0x01, 0xc6, 0x53, 0x22, 0x01, 0xc6, 0x45, 0x5c, 0x01, 0xc6];

  const [page, setPage] = useState('about');
  const pageObjects = { 
    'about': <AboutPage className={'page'} tex={Latex} />,
    'first': <FirstPage className={'page'} input={test_data} tex={Latex} />,
    'subBytes': <SubBytesPage className={'page'} input={test_data} tex={Latex} />,
    'shiftRows': <ShiftRowsPage className={'page'} input={test_data} tex={Latex} />,
    'mixCols': <MixColumnsPage className={'page'} input={test_data} tex={Latex} />,
    'addRoundKey': <AddRoundKeyPage className={'page'} input={{data: test_data, roundKey: test_key}} tex={Latex} />
  };

  return (
    <div id='sub'>
      <div class='topNav'>
        <div class='navElt' onClick={() => setPage('about')}>About</div>
        <div class='navElt' onClick={() => setPage('first')}>Prerequisites</div>
        <div class='navElt' onClick={() => setPage('subBytes')}>SubBytes</div>
        <div class='navElt' onClick={() => setPage('shiftRows')}>ShiftRows</div>
        <div class='navElt' onClick={() => setPage('mixCols')}>MixCols</div>
        <div class='navElt' onClick={() => setPage('addRoundKey')}>AddRoundKey</div>
      </div>

      {<div id='main'>{pageObjects[page]}</div>}
      
    </div>
  );
}

export default App;
