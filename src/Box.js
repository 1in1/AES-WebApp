import React, { useState } from 'react'
import './Box.css'



const Square = (props) => (
    <button>{props.value.toString(16)}</button>
);

function Box (props) {
    const [values, setValues] = useState(props.data);
    return (
    <div className='box'>
        {values.map((n, i) => 
            <Square key={i} value={n} />
        )}
    </div>
    );
}

export default Box;