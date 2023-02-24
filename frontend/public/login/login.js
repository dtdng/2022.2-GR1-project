var jwt = localStorage.getItem("jwt");
var role_id = localStorage.getItem("role_id")
if (jwt != null) {
  if (role_id == 0) {
    window.location.href = '../admin/admin.html'
  }
  else if (role_id == 1) {
    window.location.href = '../manager/manager.html'
  }
  else if (role_id == 2) {
    window.location.href = '../employee/employee.html'
  }
}

function checkLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/login/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "username": username,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      console.log(objects);
      if (objects['status'] == 'ok') {
        localStorage.setItem("jwt", objects['access_token']);
        localStorage.setItem("role_id", objects['role_id']);
        localStorage.setItem("account_id", objects['account_id']);
        console.log('login success')
        if (objects['role'] == 0) {
          window.location.href = '../admin/admin.html'
        }
        else if (objects['role'] == 1) {
          window.location.href = '../manager/manager.html'
        }
        else if (objects['role'] == 2) {
          window.location.href = '../employee/employee.html'
        }
      } else {
        alert('Login failed\n Username or password is incorrect')
      }
    }
  };
  return false;
}