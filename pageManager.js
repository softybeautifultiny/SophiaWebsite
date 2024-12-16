// ============================================================ //
//
//  protect certain pages
//
// ============================================================ //

function askForPassword(password, inpt, location) {
    const input = document.getElementById(inpt);
    const value = input.value;
    console.log(value);

    if (value === '') {
        alert("You didn't type anything dickfart.");
        return;
    }

    if (password === value) {
        window.location = location;
    } else {
        alert(value + " is the wrong password dickfart, try again!!!");
    }

    input.value = '';
}