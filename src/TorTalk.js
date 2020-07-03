import React from 'react';
import './TorTalk.css';
import { Link } from 'react-router-dom';

function TorTalk() {
    document.title = 'Interactive AES - asg58';

    return (
        <>
        <div id='back'><Link to='' >Take me back</Link></div>
        <div id='main'>
            <h1>I'm a hidden service too!</h1> 
            <p>So, your government wants to stop you viewing this random student's information page about AES. You know you're under surveilance, but you need your fix... What do you do? You go <b>darkweb</b>.</p>

            <p>I decided to set a parallel site up to this as a hidden service for a couple of reasons. Firstly, I bought a new phone over a year ago, and while the previous one was murdering batteries like crazy, it was perfectly fine while plugged in - so why not turn it into a server and have it do something interesting? Second, it's an opportunity to learn something cool - so this page documents the process of setting this all up.</p>

            <h2>What is Tor?</h2>
            <p>This isn't intended to be an explanation of what Tor is or how it works, but take a look at <a href='https://2019.www.torproject.org/about/overview.html.en' target='_blank' rel='noopener noreferrer' >their website</a> for more info. <a href='https://2019.www.torproject.org/docs/onion-services' target='_blank' rel='noopener noreferrer' >Hidden services</a>, (now known as onion services) are sites that are accessible only over the Tor network, and as such provide a high level of annonymity.</p>

            <h2>Setting up the hardware</h2>
            <p>I'm using a Huawei/Google Nexus 6P (development name angler). This is still a good phone! Mine happened to develop a hardware fault out of warranty which forced me to replace it, but the specs are still pretty solid, and it can certainly handle the very occasional request as a server. Since it's a phone it's got a nice low power usage, and is pretty comfortable running for weeks on end. </p>
            <p>Let's start by degoogling the thing. For all the good things Google does, if we want this thing to stay underground we don't want it <a href='https://www.theverge.com/2017/11/21/16684818/google-location-tracking-cell-tower-data-android-os-firebase-privacy' target='_blank' rel='noopener noreferrer' >phoning home like crazy.</a> If we really want to secure this, we'd also gut the sim and wifi hardware, and plug the phone into a wired connection with an adapter to the USB-C port; seeing as I'd rather not kill this phone just for that, I won't be going this far.</p>
            <p>What we do want to do is flash a non-stock ROM. I'm going with <a href='https://lineageos.org/' target='_blank' rel='noopener noreferrer' >Lineage OS</a>, for no reason other than that I'm used to it. The Nexus 6P is no longer officially supported by the Lineage team, but there is a user on the XDA forums still building and packaging for it - a big thank you to <a href='https://forum.xda-developers.com/member.php?s=fb3b2939285c086e531518642897e530&u=8086838' target='_blank' rel='noopener noreferrer' >PixelBoot!</a> (Yes, we don't know if we can trust him, but he's a well-respected user - if we're hosting something real, we absolutely build it ourselves!)</p>
            <p>The process is the same as for any Android custom ROM; unlock the bootloader with adb and fastboot, install a custom recovery, and install Lineage from this. PixelBoot has given a pretty solid tutorial for my device, and if you're doing this on a device with Lineage support, by all means follow those instructions. I wanted root access, (though it's safer not to have it and you don't need it for any of this) so I rooted it at this point of the process. <b>The whole point of this is that we are not installing GApps.</b> If Google don't have any software on our phone, they can't know anything (...is the hope).</p>
            
            <h2>Setting up the software</h2> 
            <p>So how do we serve from this thing? I signed the phone in to my home wifi, sideloaded <a href='https://f-droid.org/' target='_blank' rel='noopener noreferrer' >F-Droid</a>, and installed <a href='https://f-droid.org/en/packages/com.termux/' target='_blank' rel='noopener noreferrer' >Termux</a> through this. Termux is amazing, and gives us access to everything we need. It'll be much easier to work with this on a computer with a proper keyboard, so the last thing we'll do on the phone is to install the openssh package in Termux and start it, with the lines: </p>
            <code className='codeBlock'>pkg install openssh<br />sshd</code>
            <p>When we're done and want to kill the server, stop it with <code>pkill sshd</code></p>
            <p>Make sure your computer is on the same local network as the phone, grab the phone's IP with <code>ifconfig</code>, the current user with <code>whoami</code>, set the password with <code>passwd</code>, and ssh in! (The Termux openssh package defaults to serving on port 8022)</p>

            <code className='codeBlock' >[louie@ltp ~]$ ssh u0_a104@192.168.1.73 -p 8022<br />
u0_a104@192.168.1.73's password: <br />
<br />
Welcome to Termux!<br />
<br />
Wiki:            https://wiki.termux.com<br />
Community forum: https://termux.com/community<br />
Gitter chat:     https://gitter.im/termux/termux<br />
IRC channel:     #termux on freenode<br />
<br />
Working with packages:<br />
<br />
 * Search packages:   pkg search &lt;query&gt;<br />
 * Install a package: pkg install &lt;package&gt;<br />
 * Upgrade packages:  pkg upgrade<br />
 <br />
Subscribing to additional repositories:<br />
<br />
 * Root:     pkg install root-repo<br />
 * Unstable: pkg install unstable-repo<br />
 * X11:      pkg install x11-repo<br />
 <br />
Report issues at https://termux.com/issues<br />
<br />
$ <br />

            </code>
            <p>Now things should be a lot easier! To get a hidden service up and running, we'll need the <code>tor</code> package on the phone. Grab this with <code>pkg</code>. We'll need content to serve too, so I've grabbed <code>git</code> so I can clone my repository straight down. And most importantly, we need a server - <code>nginx</code> is nice and small, so I've gone with that. </p>
            <code className='codeBlock'>pkg install nginx git tor vim</code>
            <p>It's worth noting that <code  className='codePath'>/data/data/com.termux/files/usr/</code> has the structure we'd usually expect to be found at  <code className='codePath'>/</code> .</p>
            <p>Confirm that nginx is working properly, and then go into the nginx config to set it to only listen on the localhost interface (this stops 'just anyone' from connecting, unless they're coming through the Tor network). Now edit torrc (<code  className='codePath'>/data/data/com.termux/files/usr/etc/tor/torrc</code>) to add the following: </p>

            <code className='codeBlock'>
            HiddenServiceDir /var/lib/tor/hidden_service/<br />
            HiddenServicePort 80 127.0.0.1:8080
            </code>

            <p>This points port 80 on the public-facing tor service to port 8080 on our local server. To check what address we need to publicise, we check <code className='codePath'>/data/data/code.termux/files/usr/var/lib/tor/hidden_service/hostname</code>: in this case, we're at <code>ca2m4yev3ofg5kt6ywbtzaf2cvlfg26ox5blwvfx6dbj4g3k2iczguqd.onion</code></p>
            <p>Now boot Tor on the phone, and we should be able to see the intro page through Tor. From here, I cloned the git repository of my page, copied the build folder to <code className='codePath'>/data/data/com.termux/files/usr/share/aes</code>, and pointed nginx at it from nginx.conf - from here, we should be good to go!</p>
            <p>Side note: restarting things is a bit awkward here - I found myself resorting to finding the nginx process with <code>ps -e</code> and killing it with <code>kill</code>, before restarting it manually.</p>
        </div>
        </>
    );
}

export default TorTalk;