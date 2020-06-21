import React from 'react';
//import logo from './logo.svg';
import './App.css';
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
  const polyfillInclude = document.createElement('script');
  polyfillInclude.src = "https://polyfill.io/v3/polyfill.min.js?features=es6";
  const MathJaxInclude = document.createElement('script');
  MathJaxInclude.id = "MathJax-script";
  MathJaxInclude.async = true;
  MathJaxInclude.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  document.head.appendChild(polyfillInclude);
  document.head.appendChild(MathJaxInclude);

  return (
    <div id='sub'>
      <FirstPage className={'page'} input={test_data} />
    </div>
    /*
      <hr />
      <SubBytesPage className={'page'} input={test_data} />
      <hr />
      <ShiftRowsPage className={'page'} input={test_data} />
      <hr />
      <MixColumnsPage className={'page'} poly={coeffs} input={test_data} />
      <hr />
      <AddRoundKeyPage className={'page'} input={{data: test_data, roundKey: test_key}} />
    </div>*/
  );
}

export default App;
