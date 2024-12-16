// ============================================================ //
//
//  protect certain pages
//
// ============================================================ //

function askForPassword() {
    var password
    var pass0 = "FUCKMEHARDER";
    password = prompt('Enter Password To View Page', ' ');

    if (password !== pass0) {
        alert("Incorrect Password Fucker!!! Try again!!!");
    } else {
        window.location="tetrisremake.html";
    }
}