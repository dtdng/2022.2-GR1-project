
function logout() {
    localStorage.setItem("jwt", null);
    window.location.href = '../login/login.html?#'
}

function get_information() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8000/me");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
}