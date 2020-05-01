import errorHandler from './errorHandler';

function login(idToken) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        console.log('Signed in as: ' + xhr.responseText);
    };
    xhr.send(JSON.stringify(idToken));
}

async function serverGet(url) {
    const req = await fetch(url);
    try {
        if (req.ok) {
        let json = await req.json();
        if (json.errors) {
            throw json.errors[0]
        }
        return json
        } 
        else {
         throw Error("HTTP-Error: " + req.status);
        }
    }  
    catch (e) {
        errorHandler(e);
    }
}

export {login, serverGet}