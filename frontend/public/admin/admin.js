
function logout(){
    localStorage.setItem("jwt", null);
    window.location.href='../login/login.html?#'
}