import React from 'react'
import './Box.css'



const Square = (props) => (
    <div className='cell'>{props.value.toString(16)}</div>
);

function Box (props) {
    return (
    <div className='box'>
        {props.data.map((n, i) => 
            <Square key={i} value={n} />
        )}
    </div>
    );
}

export default Box;