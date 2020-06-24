import React from 'react'

function AboutPage(props) {
    return (
        <div className='page'>
            <h2>AES Web App</h2>
            <p>This is a small web app written to give me a bit of experience with React more than anything else. It gives an explanation of the AES algorithm that should be more than enough to allow someone with a mathematical background to implement the algorithm themselves (minus key expansion - probably coming soon). I'd only written my first line with React two days before starting this, so there could well be things that break! The source is available on my GitHub <a href='https://www.github.com/1in1'>here</a>.</p>
        </div>
    );
}

export default AboutPage;