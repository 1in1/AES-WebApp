import React from 'react'

function AboutPage(props) {
    return (
        <div className='page'>
            <h1>AES Web App thing</h1>
            <p>This is a very small web app written to give me a bit of experience with React more than anything else. It gives an explanation of the AES algorithm that should be more than enough to allow someone with a basic understanding of fields to implement the algorithm themselves (minus key expansion - probably coming soon), but hopefully with a little bit more explanation of what's actually happening to the data. I'm planning to have more detailed explanations appear when the reader hovers over sections of interest. I'd only written my first line with React two days before starting this, so there could well be things that break! Let me know if this happens :) The source is available on my GitHub <a href='https://github.com/1in1/AES-WebApp'>here</a>.</p>
            <p>This only covers the encryption direction - obviously all of these steps are invertible, and it is very easy to find their inverses.</p>
            <p>The <a href='https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf'>FIPS specification</a> has been my information source, and invaluable for writing this.</p>
        </div>
    );
}

export default AboutPage;