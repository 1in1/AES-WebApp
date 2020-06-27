import React, { useState } from 'react'

function HoverBox(props) {
    const [isShown, setIsShown] = useState(false);
    return (
      <div className='hoverable' onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
        {props.under}
        {isShown && <div class='reveal'>{props.over}</div>}
      </div>
    );
}

export default HoverBox;