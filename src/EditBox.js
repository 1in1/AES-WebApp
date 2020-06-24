import React from 'react'

function EditBox(props) {
    const values = props.initial.map(n => n.toString(16));
    return (
    <div className='editBox'>
        {values.map((n, i) => 
            <div className='cell'>
            <input type='text'
            value={n}
            onChange={event => {
                if(event.target.value==='') {
                    values[i]='00';
                    props.editHandler(values.map(m => parseInt(m, 16)));
                } else {
                    let a = parseInt(event.target.value, 16);
                    if(a >=0 && a < 256) {
                        values[i]=event.target.value;
                        props.editHandler(values.map(m => parseInt(m, 16)));
                    }
                }
            }}
            />
            </div>
        )}
    </div>
    );
}

export default EditBox;