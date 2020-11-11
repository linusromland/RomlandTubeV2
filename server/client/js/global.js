function onLoad() {
    
    var theme = localStorage.getItem("theme");

    if(document.getElementById("themes") && document.getElementById("themes").value){
        document.getElementById("themes").value = theme
    }

    loadCSS(localStorage.getItem("theme"));
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