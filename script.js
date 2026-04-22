//Variables
let state = "login";
let currentUser = null;
let link = document.getElementById("toggleLink");

const title = document.getElementById("title");
const dialogue = document.getElementById("Dialogue");
const uError = document.getElementById("uLengthDialogue");
const uoError = document.getElementById("uOverlapDialogue");
const uneError = document.getElementById("uNoExistDialogue")
const pError = document.getElementById("pLengthDialogue");
const pcError = document.getElementById("pcLengthDialogue");
const ipError = document.getElementById("pWrongDialogue");
const createdMsg = document.getElementById("createdDialogue")
const signWindow = document.getElementById("signWindow");

const uIN = document.getElementById("username");
const pIN = document.getElementById("pass");
const pcIN = document.getElementById("passconfirm");
const btn1 = document.getElementById("button1");

// --> Decided against Classes due to overcomplication with localStorage for a project of this size
let users = [];

//Functions
function loginToggle() {
    if (state == "login"){
        //Visual handling
        state = "signup";
        pcIN.style.display = "block";
        uneError.style.display = "none";
        ipError.style.display = "none";
        createdMsg.style.display = "none";
        btn1.textContent = "Create account";
        title.innerHTML = "Create an account";
        dialogue.innerHTML = "Already a member? <span class='link' id='toggleLink'> Log in to an existing account! </span>";
        uIN.value = "";
        pIN.value = "";
        //Reassign
        link = document.getElementById("toggleLink");
        link.addEventListener("click", loginToggle);
    } else {
        //Visual handling
        state = "login";
        pcIN.style.display = "none";
        uError.style.display = "none";
        uoError.style.display = "none";
        pError.style.display = "none";
        pcError.style.display = "none";
        btn1.textContent = "Log in";
        title.innerHTML = "Log in to an existing account";
        dialogue.innerHTML = "New here? <span class='link' id='toggleLink'> Create an account! </span>";
        uIN.value = "";
        pIN.value = "";
        pcIN.value = "";
        //Reassign
        link = document.getElementById("toggleLink");
        link.addEventListener("click", loginToggle);
    }
}

function userLengthCheck() {
    if (uIN.value.length < 5 && state == "signup") {
        uError.style.display = "block";
        return false;
    } else if (uIN.value.length >= 5 && state == "signup") {
        uError.style.display = "none";
        return true;
    }
}

function passLengthCheck() {
    if (pIN.value.length < 6 && state == "signup") {
        pError.style.display = "block";
        return false;
    } else if (pIN.value.length >= 6 && state == "signup") {
        pError.style.display = "none";
        return true;
    }
}

function passMatchCheck() {
    if (pcIN.value != pIN.value && pcIN.value.length > 0) {
        pcError.style.display = "block";
        return false;
    } else {
        pcError.style.display = "none";
        return true;
    }
}

function userOverlapCheck() {
    if (state == "signup") {
        let overlap = false;
        for (let i=0; i<users.length; i++) {
            if (users[i].username == uIN.value) {
                overlap = true;
                break;
            }
        }

        if (overlap == true){
            uoError.style.display = "block";
            return false;
        } else {
            uoError.style.display = "none";
            return true;
        }
    }
}

function accountAction(user, pass) {
    if (state == "login"){
        if (users.length > 0) {
            for (let i=0; i<users.length; i++){
                if (users[i].username == user) {
                    if (users[i].password == pass) {
                        currentUser = users[i].username;
                        signWindow.style.display = "none";
                    } else {
                        pIN.value = "";
                        ipError.style.display = "block";
                    }
                } else {
                    uIN.value = "";
                    pIN.value = "";
                    uneError.style.display = "block";
                }
            }
        } else {
            uIN.value = "";
            pIN.value = "";
            uneError.style.display = "block";            
        }

    } else {
        if (userLengthCheck() && userOverlapCheck() && passLengthCheck() && passMatchCheck()) {
            users.push({username: user, password: pass});
            createdMsg.style.display = "block";
            loginToggle();
        } else {
            console.log("Something went wrong!");
        }
    }
}

link.addEventListener("click", loginToggle);
uIN.addEventListener("keyup", userLengthCheck);
uIN.addEventListener("focusout", userOverlapCheck);
pIN.addEventListener("keyup", passLengthCheck);
pIN.addEventListener("keyup", passMatchCheck);
pcIN.addEventListener("keyup", passMatchCheck);

uIN.addEventListener("focusin", function() {
    if (state == "login") {
        uneError.style.display = "none";
        createdMsg.style.display = "none";
    } else {
        uoError.style.display = "none";
    }
})

pIN.addEventListener("focusin", function() {
    if (state == "login") {
        ipError.style.display = "none";
        createdMsg.style.display = "none";
    }
})

btn1.addEventListener("click", () => {
    accountAction(uIN.value, pIN.value)
});