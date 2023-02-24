var jwt = localStorage.getItem("jwt");
var account_id = localStorage.getItem("account_id");
function logout() {
  localStorage.setItem("jwt", null);
  window.location.href = '/public/login/login.html?#'
}

function save_project_id(project_id) {
  localStorage.setItem("project_id", project_id);
  window.location.href = '../workflow/view_workflow.html'
}

function get_information() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/me");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

}

function createProject() {
  const name_project = document.getElementById("name_project").value;
  const description = document.getElementById("description").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/project");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name_project": name_project,
    "description": description
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

function updateProject() {
  const name_project = document.getElementById("name_project").value;
  const description = document.getElementById("description").value;
  const id_project = document.getElementById("id_project").value;
  const status = document.getElementById("status").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "http://localhost:8000/project/" + id_project);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name_project": name_project,
    "description": description,
    "id_project": id_project,
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

function get_all_project() {
  console.log("hello")
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/project/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  // const objects = JSON.parse(this.responseText);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      // console.log(objects)
      if (objects != null) {
        let placeholder = document.querySelector("#data-output")
        let out = ""
        for (let object of objects) {
          out += `
            <tr>
              <td>${object.name_project}</td>
              <td>${object.id_project}</td>
              <td>${object.create_time}</td>
              <td>${object.description}</td>
              <td><button onclick="view_project(${object.id_project})">Select</button></td>
            </tr>
          `;
        }
        placeholder.innerHTML = out;
      } else {
        alert("No project found")
        return
      }
    }
  }
}



function view_project(id) {
  console.log("project_id = ", id)
  const xhttp1 = new XMLHttpRequest();
  var status_rq;
  xhttp1.open("GET", "http://localhost:8000/project/status/" + id);
  xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp1.send();
  xhttp1.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      status_rq = JSON.parse(this.responseText)
    }
  }
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/project/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      // console.log(objects)
      if (objects != null) {
        let placeholder1 = document.querySelector("#project-display");
        let placeholder2 = document.querySelector("#data-output");
        let out = "";
        out += `
          Project name: ${objects.name_project} <br>
          Project ID: ${objects.id_project} <br>
          Project Status: ${status_rq.status} <br>
          <div><button id="update_project" onClick="save_project_id(${objects.id_project})">View Workflow</button></div>
        `
        placeholder1.innerHTML = out;
        // placeholder2.innerHTML = null;
      } else {
        alert("No project found")
        return
      }
    }
  }
}

function createTask() {
  const id_project = document.getElementById("project_id").value;
  const employee_id = document.getElementById("employee_id").value;
  const description = document.getElementById("description").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/task/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id_project": id_project,
    "id_employee": employee_id,
    "description": description
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

function get_all_employee() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/employee/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      // console.log(objects)
      if (objects != null) {
        let placeholder = document.querySelector("#data-output")
        let out = ""
        for (let object of objects) {
          out += `
            <tr>
              <td>${object.account_id}</td>
              <td>${object.name}</td>
              <td>${object.id_employee}</td>
              <td>${object.email}</td>
              </tr>
              `;
          // <td><button onclick="view_project(${object.id_project})">Select</button></td>
        }
        placeholder.innerHTML = out;
      } else {
        alert("No project found")
        return
      }
    }
  }
}

function get_task_status(id) {
  const xhttp1 = new XMLHttpRequest();
  var task_status;
  var status_rq;
  xhttp1.open("GET", "http://localhost:8000/task/" + id + "/status")
  xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp1.send();
  xhttp1.onreadystatechange = function () {
    if (this.readyState == 4) {
      task_status = JSON.parse(this.responseText);
      status_rq = task_status["status"];
      console.log(typeof status_rq)
      return status_rq
    }
  }
}

function get_all_task() {
  const xhttp = new XMLHttpRequest();
  const xhttp1 = new XMLHttpRequest();
  var task_status;
  var status_rq = [];
  xhttp1.open("GET", "http://localhost:8000/task/status")
  xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp1.send();
  xhttp1.onreadystatechange = function () {
    if (this.readyState == 4) {
      task_status = JSON.parse(this.responseText);
      for (var i = 0; i < task_status.length; i++) {
        status_rq.push(task_status[i].status);
      }
    }
  }
  xhttp.open("GET", "http://localhost:8000/task/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      // console.log(objects)
      if (objects != null) {
        let placeholder = document.querySelector("#data-output")
        let out = ""
        for (var i = 0; i < objects.length; i++) {
          out += `
            <tr>
              <td>${objects[i].id_task}</td>
              <td>${objects[i].id_project}</td>
              <td>${objects[i].description}</td>
              <td>${status_rq[i]}</td>
              <td><button onclick="select_status(${objects[i].id_task}, '${status_rq[i]}')">Update status</button></td>
              </tr>
              `;
        }
        placeholder.innerHTML = out;
      } else {
        alert("No project found")
        return
      }
    }
  }
}

function select_status(id, current_status) {
  let placeholder = document.querySelector("#status-display");
  let out =
    `
    <label for="update-status">Status of Task #${id}</label>
    <input type="text" id="update-status" name="update-status" placeholder="${current_status}" ><br><br>
    <button onclick="update_status_by_id(${id})">Update</button>
    `
  placeholder.innerHTML = out;
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

function get_workflow_by_id(){
  var project_id = localStorage.getItem("project_id");
  let placeholder1=document.querySelector('#title_workflow');
  let out1 = '';
  out1 +=  `Workflow ${project_id}`;
  placeholder1.innerHTML = out1;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET","http://localhost:8000/workflow/" + project_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      if (objects != null) {
        let placeholder = document.querySelector("#workflow_display")
        let out = `ID Project: ${project_id}<br><br>`
        for(let object of objects){
          out += `
            Phase: ${object.phase}<br>
            Description: ${object.description}<br><br>
          `;
        } 
        placeholder.innerHTML = out; 
      } else {
        alert('update failed')
      }
    }
  }
}


function get_information() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/manager/me?account_id="+account_id);
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
              Manager ID: ${objects.id_manager}</br>
              Email: ${objects.email}</br>
          `;
          placeholder.innerHTML = out;
        } else {
        }
      }
    }
}