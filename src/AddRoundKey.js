import React, { useState } from 'react'
import Box from './Box.js'
import EditBox from './EditBox.js'

function AddRoundKeyPage(props) {
    const [editInputOpen, setEditInputOpen] = useState(false);
    const [editKeyOpen, setEditKeyOpen] = useState(false);
    const [input, setInput] = useState(props.input.data);
    const [roundKey, setRoundKey] = useState(props.input.roundKey);

    const getOutput = (a, b) => {
        const output = new Array(a.length);
        for(let i=0; i<a.length; i++)
            output[i] = a[i]^b[i];
        return output;
    };    
    

    return (
        <div className='page'>
            <h2>Add Round Key</h2>
            <p>One very easy final step - we simply need to xor the state with the round key we generated. Both the input and round key boxes are editable here!</p>

            <div className='boxContainerOuter'>
                <div className='boxContainerInner' onClick={() => setEditInputOpen(true)}>State:
                    <Box key={'in'+input.toString()+roundKey.toString()} data={input} /></div>
                <div className='boxContainerInner' onClick={() => setEditKeyOpen(true)}>Round Key:
                    <Box key={'in'+input.toString()+roundKey.toString()} data={roundKey} /></div>
                <div className='boxContainerInner'>Output
                    <Box key={'out'+input.toString()+roundKey.toString()}
                    data={getOutput(input, roundKey)} />
                </div>
            </div>
            {editInputOpen && 
            <div><div className='fadeBackground'
            onClick={() => setEditInputOpen(false)}></div>
            <div className='editBoxContainer'>
                <EditBox initial={input} editHandler={(v) => {
                    setInput(v);
                }}/>
            </div></div>
            }
            {editKeyOpen && 
                <div><div className='fadeBackground'
                onClick={() => setEditKeyOpen(false)}></div>
                <div className='editBoxContainer'>
                    <EditBox initial={roundKey} editHandler={(v) => {
                        setRoundKey(v);
                    }}/>
                </div></div>
            }
        </div>
    );
}

export default AddRoundKeyPage;