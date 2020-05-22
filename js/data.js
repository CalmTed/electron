const {
  dialog
} = require('electron').remote;
// const { globalShortcut } = require('electron');
//var monitor = require('active-window');

var fs = require('fs');

function getData(c) {
  //let data = ["Get some healthy sleep", "Create electron example"];
  if (c == 'tasks') {
    if (localStorage.getItem('data') != null) {
      let data = JSON.parse(localStorage.getItem('data'));
      project = {};
      for (i = 0; i < Object.keys(data).length; i++) {
        if (data[selected_project] != null) {
          project = data[selected_project];
        }else{
          project = {
            name: selected_project,
            tasks:{},
            tasks:{},
            participants:{
              'user_1': selected_user
            }
          }
            data[selected_project] = project;
            setData(data);
        }
      }
      //Object.keys(project.tasks).length > 0 &&
      if ( Object.values(project.participants).filter(user => user = selected_user).length > 0) {
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

function setData(c, value) {
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
        localStorage.setItem('data', JSON.stringify(data));
        return true;
      } else {
        console.error("No project found named: " + selected_project);
        return false;
      }
    } else {
      console.error("No data found!\nPlease connect to the internet or load offline JSON data file");
      return false;
    }

  }else if( c == 'data'){
    localStorage.setItem('data', JSON.stringify(value));
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

function saveToJSON() {
  date = new Date();
  datevalues = [
     date.getFullYear(),
     date.getMonth()+1,
     date.getDate(),
     date.getHours(),
     date.getMinutes(),
     date.getSeconds(),
  ];
  dialog.showSaveDialog({
    filters: [{
      name: 'JSON file',
      extensions: ['json']
    }],
    title: 'save_'+ datevalues.join('-'),
    properties: ['saveFile']
  }).then(fileName => {
      console.log(fileName.filePath);
      fs.writeFile(fileName.filePath,localStorage.getItem('data'), function(err) {
        if (err) return console.log(err);
      });
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
        if (setData('tasks', tasksObjects)) {
          updatedTask = document.querySelector('.' + task_id);
          updatedTask.classList.remove('ready');
          updatedTask.classList.remove('notready');
          updatedTask.classList.add(newvalue);
          document.querySelector('.' + task_id + ' .task-toggle').classList.toggle('ready');
        }
      } else if (task_prop == 'name') {
        tasksObjects[task_id].name = task_value;
        setData('tasks', tasksObjects);
      } else if (task_prop == 'times') {
        let newTime = {};
        task_value = task_value.split(' ');
        newTime.start = task_value[0];
        newTime.end = task_value[1];
        newTime.duration = task_value[2];
        tasksObjects[task_id].times[Object.keys(tasksObjects[task_id].times).length + 1] = newTime;
        setData('tasks', tasksObjects);
      }
    }
  }
}

function createTask(parent, task_name, [data] = []) {
  console.log('creating');
  tasksObjects = getData('tasks');
  //create random id
  task_id = 'task_' + getRandomId(5);
  //create new task
  newObject = new Object();
  newObject.name = task_name;
  newObject.times = {};
  newObject.status = 'notready';
  newObject.children = {};
  //add child id to parent

  //tasksObjects[parent].children[Object.keys(tasksObjects[parent].children).length+1] = task_id;
  //add to all tasks
  tasksObjects[task_id] = newObject;
  setData('tasks', tasksObjects);
}

function deleteTaskFromData(task_id) {
  try {
    tasksObjects = getData('tasks');
    delete tasksObjects[task_id];
    setData('tasks', tasksObjects);
    return true;
  } catch (e) {
    console.log('Error on deleting ' + task_id);
    return false;
  }
}

function getRandomId(length) {
  chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  let word = '';
  for (let i = 0; i < length; i++) {
    word += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return word;
}

// globalShortcut.registerAll(['Space','Enter','Tab','Shift','Backspace','9'], () => {
//  console.log('something is pressed')
// })


// setInterval(function () {
// },4000);


// TOO HARD and LONG FOR 1AM
//
// function convertFromTabula tedToJSON(text){
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
