var apple = false;

function moveOver(ele, type = 0) {
    switch (type) {
        case 0:
            var button = document.getElementById(ele);

            if (apple == false) {
                button.style.position = "relative";
                button.style.left = "-25%";
                button.style.top = "0";
                apple = true;
            } else {
                button.style.position = "relative";
                button.style.left = "0";
                button.style.top = "0";
                apple = false;
            }
            break;
        case 1:
            var button = document.getElementById(ele);

            button.style.position = "relative";
            button.style.left = "0";
            apple = false;
            break;
    } 
}