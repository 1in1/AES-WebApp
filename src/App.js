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

  //Should be 257, but threw an error once and I'm cautious now...
  const data = () => Array.from({length: 16}, () => Math.floor(Math.random() * 256));

  const [page, setPage] = useState('about');
  const pageObjects = { 
    'about': <AboutPage className={'page'} tex={Latex} />,
    'first': <FirstPage className={'page'} input={data()} tex={Latex} />,
    'subBytes': <SubBytesPage className={'page'} input={data()} tex={Latex} />,
    'shiftRows': <ShiftRowsPage className={'page'} input={data()} tex={Latex} />,
    'mixCols': <MixColumnsPage className={'page'} input={data()} tex={Latex} />,
    'addRoundKey': <AddRoundKeyPage className={'page'} input={{data: data(), roundKey: data()}} tex={Latex} />
  };

  return (
    <>
      <div class='topNav'>
        <div class='navElt' onClick={() => setPage('about')}>About</div>
        <div class='navElt' onClick={() => setPage('first')}>Prerequisites</div>
        <div class='navElt' onClick={() => setPage('subBytes')}>SubBytes</div>
        <div class='navElt' onClick={() => setPage('shiftRows')}>ShiftRows</div>
        <div class='navElt' onClick={() => setPage('mixCols')}>MixCols</div>
        <div class='navElt' onClick={() => setPage('addRoundKey')}>AddRoundKey</div>
      </div>

      {<div id='main'>{pageObjects[page]}</div>}
      
    </>
  );
}

export default App;
