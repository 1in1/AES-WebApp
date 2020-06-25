import React, { useState } from 'react'
import Box from './Box.js'
import InverseWidget from './Inverse.js'
import EditBox from './EditBox.js'
import ATWidget from './Affine.js';
import HoverBox from './HoverBox.js';


const subs = [0x63 ,0x7c ,0x77 ,0x7b ,0xf2 ,0x6b ,0x6f ,0xc5 ,0x30 ,0x01 ,0x67 ,0x2b ,0xfe ,0xd7 ,0xab ,0x76 ,0xca ,0x82 ,0xc9 ,0x7d ,0xfa ,0x59 ,0x47 ,0xf0 ,0xad ,0xd4 ,0xa2 ,0xaf ,0x9c ,0xa4 ,0x72 ,0xc0 ,0xb7 ,0xfd ,0x93 ,0x26 ,0x36 ,0x3f ,0xf7 ,0xcc ,0x34 ,0xa5 ,0xe5 ,0xf1 ,0x71 ,0xd8 ,0x31 ,0x15 ,0x04 ,0xc7 ,0x23 ,0xc3 ,0x18 ,0x96 ,0x05 ,0x9a ,0x07 ,0x12 ,0x80 ,0xe2 ,0xeb ,0x27 ,0xb2 ,0x75 ,0x09 ,0x83 ,0x2c ,0x1a ,0x1b ,0x6e ,0x5a ,0xa0 ,0x52 ,0x3b ,0xd6 ,0xb3 ,0x29 ,0xe3 ,0x2f ,0x84 ,0x53 ,0xd1 ,0x00 ,0xed ,0x20 ,0xfc ,0xb1 ,0x5b ,0x6a ,0xcb ,0xbe ,0x39 ,0x4a ,0x4c ,0x58 ,0xcf ,0xd0 ,0xef ,0xaa ,0xfb ,0x43 ,0x4d ,0x33 ,0x85 ,0x45 ,0xf9 ,0x02 ,0x7f ,0x50 ,0x3c ,0x9f ,0xa8 ,0x51 ,0xa3 ,0x40 ,0x8f ,0x92 ,0x9d ,0x38 ,0xf5 ,0xbc ,0xb6 ,0xda ,0x21 ,0x10 ,0xff ,0xf3 ,0xd2 ,0xcd ,0x0c ,0x13 ,0xec ,0x5f ,0x97 ,0x44 ,0x17 ,0xc4 ,0xa7 ,0x7e ,0x3d ,0x64 ,0x5d ,0x19 ,0x73 ,0x60 ,0x81 ,0x4f ,0xdc ,0x22 ,0x2a ,0x90 ,0x88 ,0x46 ,0xee ,0xb8 ,0x14 ,0xde ,0x5e ,0x0b ,0xdb ,0xe0 ,0x32 ,0x3a ,0x0a ,0x49 ,0x06 ,0x24 ,0x5c ,0xc2 ,0xd3 ,0xac ,0x62 ,0x91 ,0x95 ,0xe4 ,0x79 ,0xe7 ,0xc8 ,0x37 ,0x6d ,0x8d ,0xd5 ,0x4e ,0xa9 ,0x6c ,0x56 ,0xf4 ,0xea ,0x65 ,0x7a ,0xae ,0x08 ,0xba ,0x78 ,0x25 ,0x2e ,0x1c ,0xa6 ,0xb4 ,0xc6 ,0xe8 ,0xdd ,0x74 ,0x1f ,0x4b ,0xbd ,0x8b ,0x8a ,0x70 ,0x3e ,0xb5 ,0x66 ,0x48 ,0x03 ,0xf6 ,0x0e ,0x61 ,0x35 ,0x57 ,0xb9 ,0x86 ,0xc1 ,0x1d ,0x9e ,0xe1 ,0xf8 ,0x98 ,0x11 ,0x69 ,0xd9 ,0x8e ,0x94 ,0x9b ,0x1e ,0x87 ,0xe9 ,0xce ,0x55 ,0x28 ,0xdf ,0x8c ,0xa1 ,0x89 ,0x0d ,0xbf ,0xe6 ,0x42 ,0x68 ,0x41 ,0x99 ,0x2d ,0x0f ,0xb0 ,0x54 ,0xbb ,0x16];


function SubBytesPage(props) {
    const [editOpen, setEditOpen] = useState(false);
    const [input, setInput] = useState(props.input);
    const Latex = props.tex;


    return (
        <div className='page'>
            <h2>Substitute Bytes</h2>
            <p>The first step in a round of Rijndael is to swap each byte with another. This is conceptually done in two operations. Let <Latex>{'$\\color{green}{\\{p\\}}$'}</Latex> be our input.</p>
            <p>First, we substitute this with its multiplicative inverse in <Latex>{'$ \\mathbb{F}(2^8) $. Of course, $\\color{green}{\\{00\\}}$'}</Latex> has no such inverse, but we define this to be self-inverse to make everything work.</p>

            <InverseWidget default={'00'} />

            <HoverBox under={
            <p><Latex>{'Let $ {\\color{green}\\{p\\}^{-1}} = {\\color{green}\\{q\\}} $'}</Latex>. Then, we apply a specific affine transformation <Latex>{'$ {\\color{green}\\{q\\}} \\to {\\color{green}\\{r\\}} $'}</Latex>. This transformation is best understood as taking the sum of rotations of the byte representing the number, with a constant at the end. The matrix below shows the transformation with respect to the natural basis <Latex>{'$ \\{01, 02, 04, ..., 80\\}$ of $\\mathbb{F}(2^8)$.'}</Latex></p>
            }
            over={
                <>
                    <p>Why is this a "natural choice of basis"? What we are doing here is considering <Latex>{'$\\mathbb{F}(2^8)$'}</Latex> a vector space over <Latex>{'$\\mathbb{F}(2)$'}</Latex>, using the isomorphism from earlier. The choice of basis induced by that map is <Latex>{'$ \\{1, x, x^2, ..., x^7\\} = \\{01, 02, 04, ..., 80\\}$'}</Latex>.</p>
                    <p>What do we mean about the "sum of rotations"? Have a think about how we might reformulate this in terms of byte rotations :) </p>
                </>
            } />

            <Latex displayMode={true}>{`$$
                \\begin{bmatrix} r_0\\\\r_1\\\\r_2\\\\r_3\\\\r_4\\\\r_5\\\\r_6\\\\r_7 \\end{bmatrix}
                =
                \\begin{bmatrix} 1&0&0&0&1&1&1&1\\\\1&1&0&0&0&1&1&1\\\\1&1&1&0&0&0&1&1&\\\\1&1&1&1&0&0&0&1\\\\1&1&1&1&1&0&0&0\\\\0&1&1&1&1&1&0&0\\\\0&0&1&1&1&1&1&0\\\\0&0&0&1&1&1&1&1 \\end{bmatrix}
                \\begin{bmatrix} q_0\\\\q_1\\\\q_2\\\\q_3\\\\q_4\\\\q_5\\\\q_6\\\\q_7 \\end{bmatrix}
                +
                \\begin{bmatrix} 1\\\\1\\\\0\\\\0\\\\0\\\\1\\\\1\\\\0 \\end{bmatrix}
            $$`}</Latex>

            <p>The widget below implements this transformation.</p>
            <ATWidget default={'00'} />
            
            <p>In practice, unless we have severe constraints on the amount of data we can store (think embedded systems), we simply store a table of the result of applying both operations consecutively, and look up the value to substitute, for efficiency reasons.</p>
            <p>It's also worth bearing in mind that this substition doesn't necessarily need to be exactly the one given here. The authors of Rijndael chose this one because it gives resistance against both differential and linear cryptanalysis techniques, but other suitable substitutions may be used - this is good reason to believe the NSA didn't build in a back door in the specification!</p>
            <p>Try the whole SubBytes step below - click anywhere on the state box to edit the initial values.</p>


            <div className='boxContainerOuter'>
                <div className='boxContainerInner' onClick={() => setEditOpen(true)}>State:
                    <Box key={'in'+input.toString()} data={input} /></div>
                <div className='boxContainerInner'>Output:
                    <Box key={'out'+input.toString()}
                    data={input.map( inByte => subs[inByte])} />
                </div>
            </div>

            {editOpen && 
            <div><div className='fadeBackground'
            onClick={() => setEditOpen(false)}></div>
            <div className='editBoxContainer'>
                <EditBox initial={input} editHandler={(v) => {
                    setInput(v);
                }}/>
            </div></div>
            }
        </div>
    );
}

export default SubBytesPage;