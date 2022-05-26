var t = true;

// Checks local storage if darkmode is enabled
$(document).ready(function() {
    var backgroundColour = localStorage.getItem('content-Colour-Storage');
    //console.log(backgroundColour);
    //console.log(t);

    if (backgroundColour === "black") {
        document.documentElement.style.setProperty('--content-Colour', '#181818');
        document.documentElement.style.setProperty('--text-Colour', 'white');
        t = false;
    }
    else {
        t = true;
    }
});

// Function to change css values
function darkmode() {
    if (t === true) {
        document.documentElement.style.setProperty('--content-Colour', '#181818');
        document.documentElement.style.setProperty('--text-Colour', 'white');
        localStorage.setItem('content-Colour-Storage', 'black');
        t = false;
    } else {
        document.documentElement.style.removeProperty('--content-Colour', '#181818');
        document.documentElement.style.removeProperty('--text-Colour', 'white');
        localStorage.setItem('content-Colour-Storage', 'white');
        t = true;
    }
}