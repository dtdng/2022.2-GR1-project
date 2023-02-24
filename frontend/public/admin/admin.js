var jwt = localStorage.getItem("jwt");

function logout() {
  localStorage.setItem("jwt", null);
  window.location.href = '../login/login.html?#'
}

function get_information() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/me");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
}

function createRole() {
  const role_id = document.getElementById("role_id").value;
  const role_name = document.getElementById("role_name").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/roles");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "role_id": role_id,
    "role_name": role_name
  }));
}

function createAccount() {
  const role_id = document.getElementById("role_id").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  const id_card = document.getElementById("id_card").value;
  const name = document.getElementById("name").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/accounts");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "role_id": role_id,
    "username": username,
    "password": password,
    "email": email,
    "id_card": id_card,
    "name": name
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);

      if (objects != null) {
        alert('create successfully')
      } else {
        alert('create failed')
      }
    }
  }
}

function get_all_account(){
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/account")
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      if (objects != null) {
        let placeholder = document.querySelector("#data-output")
        let out = ""
        for(let object of objects){
          out+= `
            <tr>
              <td>${object.username}</td>
              <td>${object.role_id}</td>
              <td>${object.account_id}</td>
              <td><button onclick="view_project(${object.account_id})">Select</button></td>
            </tr>
          `;
        }
        placeholder.innerHTML = out;
      } else {
        alert('get data failed')
      }
    }
  }
}