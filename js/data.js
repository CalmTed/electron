const {
  dialog
} = require('electron').remote;
var fs = require('fs');

function getData(c) {
  //let data = ["Get some healthy sleep", "Create electron example"];
  if (c == 'tasks') {
    if (localStorage.getItem('data') != null) {
      let data = JSON.parse(localStorage.getItem('data'));
      project = [];
      for (i = 0; i < Object.keys(data).length; i++) {
        if (data[selected_project] != null) {
          project = data[selected_project];
        }
      }

      if (Object.keys(project.tasks).length > 0 && Object.values(project.participants).filter(user => user = selected_user).length > 0) {
        data = project.tasks; //.filter(user => project == selected_project)
        return data;
      } else {
        console.error("No project found named: " + selected_project);
        return [];
      }
    } else {
      console.error("No data found!\nPlease connect to the internet or load offline JSON data file");
      return [];
    }

  }
}

function setData(c,value) {
  //let data = ["Get some healthy sleep", "Create electron example"];
  if (c == 'tasks') {
    if (localStorage.getItem('data') != null) {
      let data = JSON.parse(localStorage.getItem('data'));
      project = [];
      for (i = 0; i < Object.keys(data).length; i++) {
        if (data[selected_project] != null) {
          project = data[selected_project];
        }
      }

      if (Object.values(project.participants).filter(user => user = selected_user).length > 0) {
          data[selected_project].tasks = value;
          localStorage.setItem('data',JSON.stringify(data));
          return true;
      } else {
        console.error("No project found named: " + selected_project);
        return false;
      }
    } else {
      console.error("No data found!\nPlease connect to the internet or load offline JSON data file");
      return false;
    }

  }
}

function openFromJSON() {
  dialog.showOpenDialog({
    filters: [{
      name: 'JSON file',
      extensions: ['json']
    }],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      let filepath = result.filePaths[0];
      fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) {
          alert("An error ocurred reading the file :" + err.message);
          return;
        }
        localStorage.setItem('data', data);
        showView(selected_view);
        //convertFromTabulatedToJSON(data);
        //return data;
      });
    }
  }).catch(err => {
    console.log(err)
  });
};

function changeTask(task_id, task_prop, task_value) {
  tasksObjects = getData('tasks');
  //if we have any task
  if (Object.keys(tasksObjects).length > 0) {
    if (tasksObjects[task_id] !== null) {
      if (task_prop == 'status' && task_value == 'toggle') {
        let newvalue;
        console.log(tasksObjects[task_id].status);
        switch (tasksObjects[task_id].status) {
          case 'notready':
            newvalue = 'ready';
            break;
          case 'ready':
            newvalue = 'notready';
            break;
          default:
            'notready';
        }
        tasksObjects[task_id].status = newvalue;
        if(setData('tasks',tasksObjects)){
          updatedTask = document.querySelector('.'+task_id);
          updatedTask.classList.remove('ready');
          updatedTask.classList.remove('notready');
          updatedTask.classList.add(newvalue);
        }
      }
    }
  }
}


// TOO HARD and LONG FOR 1AM
//
// function convertFromTabulatedToJSON(text){
//     let textArray = text.split('\n');
//     let data = {};
//     data = cFtTjOr(textArray,'start',data,0,0);
//     return JSON.stringify(data);
// }
// //convert From Tabulated To JSON Object Resource
// function cFtTjOr(textArray,command,data,line,level){
//   if(line>=textArray.length){
//     return data;
//   }
//   if(typeof textArray[line] != 'undefined' && textArray[line] != '' ){
//
//   }
//   if(command == 'start'){
//     console.log('starting');
//       linelevel = 0;
//       //count spaces (for double spaces)
//       for(i=0;i<textArray[line].length;i++){
//         if(textArray[line][i] == ' '){
//           linelevel+=0.5;
//         }else{
//           //finish loop
//           i = textArray[line].length;
//         }
//       }
//       //trim line
//       textArray[line] = textArray[line].slice(linelevel);
//       if(linelevel>level){
//         data = cFtTjOr(textArray,'up',data,line++,level++);
//       }else if(linelevel<level){
//         data = cFtTjOr(textArray,'down',data,line--,linelevel);
//       }else{
//         data = cFtTjOr(textArray,'same',data,line--,linelevel);
//       }
//       console.log(level,linelevel,textArray[line]);
//     }
//   }else if(command = 'up'){
//
//   }else if(command = 'down'){
//
//   }else if(command = 'end'){
//
//   }else{
//     console.log('hm... strange');
//   }
// }
