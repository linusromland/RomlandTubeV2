function onLoad() {

    var theme = localStorage.getItem("theme");

    if (theme) {
        if(document.getElementById("themes") && document.getElementById("themes").value){
            document.getElementById("themes").value = theme

        }
        
        loadCSS(theme);
    }
    if(!theme && document.getElementById("themes") && document.getElementById("themes").value){
        loadCSS(document.getElementById("themes").value)
    }
}

function loadCSS(theme) {
    var link = document.getElementById("customCSS");

    if (!link) {
        // Get HTML head element 
        var head = document.getElementsByTagName('HEAD')[0];

        // Create new link Element 
        link = document.createElement('link');

        // set the attributes for link element  
        link.rel = 'stylesheet';

        link.type = 'text/css';

        link.id = "customCSS"

        // Append link element to HTML head 
        head.appendChild(link);
    }

    link.href = `/themes/${theme}.css`;
}

function clickedSubmit() {
    localStorage.setItem("theme", document.getElementById("themes").value);
    
    loadCSS(document.getElementById("themes").value);
    
    return false;
}

