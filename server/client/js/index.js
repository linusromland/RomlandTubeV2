

function clickedSubmit() {
    localStorage.setItem("theme", document.getElementById("themes").value);

    //alert(document.getElementById("cars").value)
    loadCSS(document.getElementById("themes").value);

    return false;
}

