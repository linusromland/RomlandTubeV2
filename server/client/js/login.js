function loginUser() {
    let errorArea = document.getElementById("errorText");
    let request = new XMLHttpRequest();
    let name = document.getElementById("username").value;
    let pass = CryptoJS.MD5(
        document.getElementById("password").value + name
    );
    request.open("POST", "/login", true);
    request.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );
    request.send(`name=${name}&password=${pass}`);
    request.onreadystatechange = function () {
        if (request.status == 200) window.location = "/"
        if (request.status == 401) {
            errorArea.innerHTML = "Wrong Username or Password!";
        }
    };
}