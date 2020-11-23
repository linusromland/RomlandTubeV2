function registerUser() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("passwordConfirm").value;
    let errorText = document.getElementById("errorText");

    if (password == confirmPassword) {
        console.log("usercreation maybe");
        let request = new XMLHttpRequest();
        let name = document.getElementById("username").value;
        let pass = CryptoJS.MD5(password + name);
        request.open("POST", "/register", true);
        request.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        request.send(`name=${name}&password=${pass}`);
        request.onreadystatechange = function () {
            if (request.response == "taken") {
                errorText.innerHTML = "Username taken!";
            } else if (request.status == 500) {
                errorText.innerHTML = "Error occured!";
            } else if (request.status == 201) {
                window.location = "/";
            }
        };
    } else {
        errorText.innerHTML = "Passwords do not match!";
    }
}