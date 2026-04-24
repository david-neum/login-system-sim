//Variables
let state = "login";
let wipeConfirm = false;
let currentUser = null;
let userIndex = null;
let link = document.getElementById("toggleLink");

const savedTheme = localStorage.getItem("theme");
const title = document.getElementById("title");
const dialogue = document.getElementById("Dialogue");
//signup/login VISUAL
const uError = document.getElementById("uLengthDialogue");
const uoError = document.getElementById("uOverlapDialogue");
const uneError = document.getElementById("uNoExistDialogue")
const pError = document.getElementById("pLengthDialogue");
const pcError = document.getElementById("pcWrongDialogue");
const ipError = document.getElementById("pWrongDialogue");
const createdMsg = document.getElementById("createdDialogue")
//loggedin VISUAL
const uChangeError = document.getElementById("uChangeLengthDialogue");
const uoChangeError = document.getElementById("uChangeOverlapDialogue");
const pChangeError = document.getElementById("pChangeLengthDialogue");
const pcChangeError = document.getElementById("pcChangeWrongDialogue");
//
const signWindow = document.getElementById("signWindow");
const userWindow = document.getElementById("userWindow");
const userTitle = document.getElementById("userTitle")
//signup/login FUNCTIONAL
const uIN = document.getElementById("username");
const pIN = document.getElementById("pass");
const pcIN = document.getElementById("passconfirm");
const btn1 = document.getElementById("button1");
//loggedin FUNCTIONAL
const changeuIN = document.getElementById("changedusername");
const changepIN = document.getElementById("changedpass");
const changepcIN = document.getElementById("passchangeconfirm")
const deleteBtn = document.getElementById("deleteBtn");
const logoutBtn = document.getElementById("logoutBtn");
const changeUBtn = document.getElementById("changeUsername");
const changePBtn = document.getElementById("changePassword");
const cancelBtn = document.getElementById("cancelBtn");

const themeBtn = document.getElementById("themeBtn");
const wipeBtn = document.getElementById("wipeLocalStorageBtn");


// --> Decided against Classes due to overcomplication with localStorage for a project of this size
let users = JSON.parse(localStorage.getItem("users")) || [];

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

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

function userLengthCheck(user) {
    if (user.length < 5) {
        if (state == "signup") {
            uError.style.display = "block";
        } else {
            uChangeError.style.display = "block";
        }
        return false;
    } else if (user.length >= 5) {
        if (state == "signup") {
            uError.style.display = "none";
        } else {
            uChangeError.style.display = "none";
        }
        return true;
    }
}

function passLengthCheck(pass) {
    if (pass.length < 6 && (state == "signup" || state == "changingpass")) {
        if (state == "signup") {
            pError.style.display = "block";
        } else {
            pChangeError.style.display = "block";
        }
        return false;
    } else if (pass.length >= 6 && (state == "signup" || state == "changingpass")) {
        if (state == "signup") {
            pError.style.display = "none";
        } else {
            pChangeError.style.display = "none";
        }
        return true;
    }
}

function passMatchCheck(pass, passcon) {
    if (pass != passcon && passcon.length > 0) {
        if (state == "signup") {
            pcError.style.display = "block";
        } else if (state == "changingpass"){
            pcChangeError.style.display = "block";
        }
        return false;
    } else {
        if (state == "signup") {
            pcError.style.display = "none";
        } else if (state == "changingpass"){
            pcChangeError.style.display = "none";
        }
        return true;
    }
}

function userOverlapCheck(user) {
    if (state == "signup" || state == "changingname") {
        let overlap = false;
        for (let i=0; i<users.length; i++) {
            if (users[i].username.toLowerCase() == user.toLowerCase()) {
                overlap = true;
                break;
            }
        }

        if (overlap == true) {
            if (state == "signup") {
                uoError.style.display = "block";
            } else {
                uoChangeError.style.display = "block";
            }
            return false;
        } else {
            if (state == "signup") {
                uoError.style.display = "none";
            } else {
                uoChangeError.style.display = "none";
            }
            return true;
        }
    } else {
        return false;
    }
}

function accountAction(user, pass, passcon) {
    if (state == "login"){
        if (users.length > 0) {
            for (let i=0; i<users.length; i++){
                if (users[i].username == user) {
                    if (users[i].password == pass) {
                        state = "loggedin";
                        currentUser = users[i].username;
                        userIndex = i;
                        user = "";
                        pass = "";
                        signWindow.style.display = "none";
                        userWindow.style.display = "block";
                        userTitle.innerHTML = "Welcome, " + currentUser + ".";
                    } else {
                        pass = "";
                        ipError.style.display = "block";
                    }
                } else {
                    user = "";
                    pass = "";
                    uneError.style.display = "block";
                }
            }
        } else {
            user = "";
            pass = "";
            uneError.style.display = "block";            
        }

    } else if (state == "signup") {
        if (userLengthCheck(user) && userOverlapCheck(user) && passLengthCheck(pass) && passMatchCheck(pass, passcon)) {
            users.push({username: user, password: pass});
            saveAccounts();
            createdMsg.style.display = "block";
            loginToggle();
        } else {
            console.log("Something went wrong!");
        }
    }
}

function logout(){
    currentUser = null;
    userIndex = null;
    state = "login";
    userWindow.style.display = "none";
    uneError.style.display = "none";
    signWindow.style.display = "block";
}

function changeUsername(){
    if (state == "loggedin") {
        state = "changingname";
        userTitle.innerHTML = "Change username";
        changeuIN.style.display = "block";
        cancelBtn.style.display = "block";
        changePBtn.style.display = "none";
        deleteBtn.style.display = "none";
        logoutBtn.style.display = "none";
    } else {
        if (userLengthCheck(changeuIN.value) && userOverlapCheck(changeuIN.value)) {
            state = "loggedin";
            users[userIndex].username = changeuIN.value;
            currentUser = changeuIN.value;
            userTitle.innerHTML = "Welcome, " + currentUser + ".";
            saveAccounts();
            changeuIN.style.display = "none";
            cancelBtn.style.display = "none";
            changePBtn.style.display = "block";
            deleteBtn.style.display = "block";
            logoutBtn.style.display = "block";
        }
    }
}

function changePassword(){
    if (state == "loggedin") {
        state = "changingpass";
        userTitle.innerHTML = "Change password";
        changepIN.style.display = "block";
        changepcIN.style.display = "block";
        cancelBtn.style.display = "block";
        changePBtn.style.display = "block";
        changeUBtn.style.display = "none";
        deleteBtn.style.display = "none";
        logoutBtn.style.display = "none";   
    } else {
        if (passLengthCheck(changepIN.value) && passMatchCheck(changepIN.value, changepcIN.value)) {
            state = "loggedin";
            users[userIndex].password = changepIN.value;
            userTitle.innerHTML = "Welcome, " + currentUser + ".";
            saveAccounts();
            changepIN.style.display = "none";
            changepcIN.style.display = "none";
            cancelBtn.style.display = "none";
            changeUBtn.style.display = "block";
            deleteBtn.style.display = "block";
            logoutBtn.style.display = "block";
        }
    }
}

function cancel(){
    if (state == "changingname") {
        uoChangeError.style.display = "none";
        uChangeError.style.display = "none";
        changeuIN.style.display = "none";
        cancelBtn.style.display = "none";
        changePBtn.style.display = "block";
        deleteBtn.style.display = "block";
        logoutBtn.style.display = "block";
    } else {
        pChangeError.style.display = "none";
        pcChangeError.style.display = "none";
        changepIN.style.display = "none";
        changepcIN.style.display = "none";
        cancelBtn.style.display = "none";
        changeUBtn.style.display = "block";
        deleteBtn.style.display = "block";
        logoutBtn.style.display = "block";
    }
    state = "loggedin";
    userTitle.innerHTML = "Welcome, " + currentUser + ".";
}

function deleteAccount(){
    users.splice(userIndex, 1);
    saveAccounts();
    logout();
}

//general
function saveAccounts(){
    localStorage.setItem("users", JSON.stringify(users));
}

//login/signup EVENTLISTENERS
link.addEventListener("click", loginToggle);
uIN.addEventListener("keyup", () => {
    userLengthCheck(uIN.value);
});
uIN.addEventListener("focusout", () => {
    userOverlapCheck(uIN.value);
});
pIN.addEventListener("keyup", () => {
    passLengthCheck(pIN.value);
});
pIN.addEventListener("keyup", () => {
    passMatchCheck(pIN.value, pcIN.value);
});
pcIN.addEventListener("keyup", () => {
    passMatchCheck(pIN.value, pcIN.value);
});
    //Hiding messages once activity to correct user inputs is detected
uIN.addEventListener("focusin", () => {
    if (state == "login") {
        uneError.style.display = "none";
        createdMsg.style.display = "none";
    } else {
        uoError.style.display = "none";
    }
})

pIN.addEventListener("focusin", () => {
    if (state == "login") {
        ipError.style.display = "none";
        createdMsg.style.display = "none";
    }
})

btn1.addEventListener("click", () => {
    accountAction(uIN.value, pIN.value, pcIN.value);
});

//logged in EVENTLISTENERS
logoutBtn.addEventListener("click", logout);
deleteBtn.addEventListener("click", deleteAccount);
changeUBtn.addEventListener("click", changeUsername);
changePBtn.addEventListener("click", changePassword);
cancelBtn.addEventListener("click", cancel);

changeuIN.addEventListener("keyup", () => {
    userLengthCheck(changeuIN.value);
});
changeuIN.addEventListener("focusout", () => {
    userOverlapCheck(changeuIN.value);
});
changepIN.addEventListener("keyup", () => {
    passLengthCheck(changepIN.value);
});
changepIN.addEventListener("keyup", () => {
    passMatchCheck(changepIN.value, changepcIN.value);
});
changepcIN.addEventListener("keyup", () => {
    passMatchCheck(changepIN.value, changepcIN.value);
});

changeuIN.addEventListener("focusin", () => {
    uoChangeError.style.display = "none";
})

changepIN.addEventListener("focusin", () => {
    pChangeError.style.display = "none";
})

wipeBtn.addEventListener("click", () => {
    if (wipeConfirm == false) {
        wipeConfirm = true;
        wipeBtn.textContent = "Click again to confirm"
    } else if (wipeConfirm == true) {
        wipeConfirm = false;
        users = [];
        logout(); 
        saveAccounts();
        wipeBtn.textContent = "Accounts deleted";
    }
})

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
})

wipeBtn.addEventListener("mouseleave", () => {
    if (wipeConfirm == false) {
        wipeBtn.textContent = "Delete all accounts";
    } else if (wipeConfirm == true) {
        wipeConfirm = false;
        wipeBtn.textContent = "Delete all accounts";
    }
})