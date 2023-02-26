var jwt = localStorage.getItem("jwt");
var account_id = localStorage.getItem("account_id");
var project_id_local = localStorage.getItem("project_id");
function logout() {
  localStorage.setItem("jwt", null);
  window.location.href = '../login/login.html'
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

function get_workflow_by_id() {
  var project_id = localStorage.getItem("project_id");
  let placeholder1 = document.querySelector('#title_workflow');
  let out1 = '';
  out1 += `Project ID ${project_id}`;
  placeholder1.innerHTML = out1;
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/workflow/" + project_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      if (objects != null) {
        let placeholder = document.querySelector("#workflow_display")
        let out = `<br><br>`
        for (let object of objects) {
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
  xhttp.open("GET", "http://localhost:8000/manager/me?account_id=" + account_id);
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

function create_workflow_by_id() {
  var project_id = localStorage.getItem("project_id");
  let placeholder1 = document.querySelector('#create-workflow-form');
  let out1 = '';
  out1 += `Create work flow for Project ID ${project_id} <br><br>
    <label for="phase">Phase: </label><br>
    <input type="text" id="phase" name="phase"><br><br>
    <label for="description">Description: </label><br>
    <input type="text" id="description" name="description"><br><br>
    <button onclick="create_workflow(${project_id})">Submit</button>
  `;
  placeholder1.innerHTML = out1;
}

function create_workflow(project_id) {
  const phase = document.getElementById("phase").value;
  const description = document.getElementById("description").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/workflow/description/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id_project": project_id,
    "phase": phase,
    "description": description
  }))
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

let reader = new FileReader();
reader.onload = function (event) {
  let content = event.target.result;
  localStorage.setItem("fileContent", content)
};

window.addEventListener("load", () => {
  var project_id = localStorage.getItem("project_id");
  let placeholder1 = document.querySelector('#workflow-title');
  placeholder1.innerHTML = `<p>Workflow Record for Project ID ${project_id} </p>`;

  const input = document.getElementById("fileInput");
  const submit = document.getElementById("btnUploadFile");

  submit.addEventListener("click", (e) => {
    const file = input.files[0];
    reader.readAsText(file);
    var log = localStorage.getItem("fileContent");
    var workflow_id = localStorage.getItem("workflow_id");
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8000/workflow/record/logfile");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
      "id_workflow": workflow_id,
      "type": "jenkins log build",
      "log": log,
    }))
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
  })

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/workflow/record/" + project_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id_project": project_id,
  }))
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      if (objects != null) {
        let placeholder = document.querySelector("#workflow-output")
        let out = ""
        for (let object of objects)
          out += `
            <tr>
              <td>${object.id_workflow}</td>
              <td>${object.execute_time}</td>
              <td>${object.status}</td>
              <td><button onclick="view_log_file_by_workflow_id(${object.id_workflow})">Select</button></td>
            </tr>
        `;
        placeholder.innerHTML = out;
      } else {
        alert("No JSON result")
      }
    }
  }

})

function view_log_file_by_workflow_id(id) {
  localStorage.setItem("workflow_id", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8000/workflow/record/" + id + "/log");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send()
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      if (objects != null) {
        let placeholder = document.querySelector("#showLogFile")
        let out = `Workflow Build #${id}<br><br>`
        for (let object of objects)
          out += `
              Phase:${object.phase}<br>
              Type: ${object.type}<br>
              Content:${object.log_description}<br><br>
              `;
        // <td><button onclick="view_log_file_by_workflow_id(${object.id_workflow})">Select</button></td>
        // out += '<button onclick="create_logfile_input_form()">Upload Logfile</button>'
        placeholder.innerHTML = out;
      } else {
        alert("No logfile with that workflow ")
      }
    }
  }
}

// function create_logfile_input_form(){
//   let placeholder = document.querySelector("#logFileInput")
//   let out = `
//   <label for="fileInput">Choose a file:</label><br>
//   <input type="file" id="fileInput" name="fileInput"><br>
//   <button id="upload_logfile" onclick="upload_logfile()">Upload</button>
//   `
//   placeholder.innerHTML = out;
// }

// C:\Users\Admin\AppData\Local\Jenkins\.jenkins\workspace\test_master\log-file


// function upload_logfile(){

// }
function add_logfile(workflow_id, log) {
  var log = localStorage.getItem("fileContent");
  var workflow_id = localStorage.getItem("workflow_id");
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8000/workflow/record/logfile");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id_workflow": 1,
    "type": "jenkins log build",
    "log": "test",
  }))
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