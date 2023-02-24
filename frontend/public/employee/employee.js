var account_id = localStorage.getItem("account_id")
var id_employee = localStorage.getItem("id_employee")
function logout() {
    localStorage.setItem("jwt", null);
    localStorage.setItem("account_id", null);
    localStorage.setItem("id_employee", null);
    window.location.href = '../login/login.html?#'
}

function get_information() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8000/employee/me?account_id="+account_id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "account_id": account_id
    }))   
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          const objects = JSON.parse(this.responseText);
          localStorage.setItem("id_employee", objects.id_employee);
          if (objects != null) {
            let placeholder = document.querySelector("#infor_display")
            let out = ""
            out += `
                Account ID: ${objects.account_id}</br>
                Name: ${objects.name}</br>
                Employee ID: ${objects.id_employee}</br>
                Email: ${objects.email}</br>
            `;
            placeholder.innerHTML = out;
          } else {
          }
        }
      }
}

function get_all_task(){
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/employee/"+ id_employee + "/task");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
      "id_employee": id_employee
  }))   
  xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        if (objects != null) {
          let placeholder = document.querySelector("#data-output")
          let out = ""
          for (var i = 0; i < objects.length; i++) {
            out += `
              <tr>
                <td>${objects[i].id_task}</td>
                <td>${objects[i].id_project}</td>
                <td>${objects[i].create_time}</td>
                <td>${objects[i].description}</td>
                <td><button onclick="select_status(${objects[i].id_task})">Select</button></td>
              </tr>
            `;
          }
          placeholder.innerHTML = out;
        } else {
          
        }
      }
  }
}

function select_status(id, callback) {
  let status1;
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/task/"+id+"/status")
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id_task": id
  }))  
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      if (objects != null) {
        let placeholder = document.querySelector("#status-display");
        let out =
          `
          <label for="update-status">Status of Task #${id}</label>
          <input type="text" id="update-status" name="update-status" placeholder="${objects.status}" ><br><br>
          <button onclick="update_status_by_id(${id})">Update</button>
          `
        placeholder.innerHTML = out;
      } else {
        alert('get status failed!')
      }
    }
  }
  
}

function update_status_by_id(id) {
  var status = document.getElementById("update-status").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "http://localhost:8000/task/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id_task": id,
    "status": status
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      if (objects != null) {
        alert('update successfully')
      } else {
        alert('update failed')
      }
    }
  }
}