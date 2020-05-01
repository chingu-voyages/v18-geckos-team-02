import React, {useState, useEffect} from 'react';
import { login } from '../services/api';
import errorHandler from '../services/errorHandler';

function GoogleAuth() {
    const [user, setUser] = useState(null);

    function signOut() {
        var auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut()
        .then(function () {
            setUser(false);
            renderButton(window.gapi.signin2);
        });
    }

    function onSuccess(googleUser) {
        const profile = googleUser.getBasicProfile();
        setUser({
            name: profile.name,
            pic: profile.getImageUrl()
        })
        login(googleUser.getAuthResponse());
    }
    function onFailure(error) {
        errorHandler(Error(error));
    }
    function renderButton(signin2) {
        signin2.render('my-signin2', {
            'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.appdata',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': onSuccess,
            'onfailure': onFailure
        });
    } 

    useEffect(() => {
        if (window.gapi && !user) {
            renderButton(window.gapi.signin2);
        }
    })

return (
<>
    <div id="my-signin2" style={{display: user ? 'none' : 'inline-block'}}></div>
    {user && <> 
        <img src={user.pic} title={user.name} alt={user.name+'s profile pic'} />
        <a href="/" onClick={signOut}>Sign out</a>
    </>}
    
</>
);
}

export default GoogleAuth;
