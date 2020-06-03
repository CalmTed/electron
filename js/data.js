const {
  dialog
} = require('electron').remote;

var fs = require('fs');

function d_getData(c) {
  //let data = ["Get some healthy sleep", "Create electron example"];
  if (c == 'tasks') {
    if (localStorage.getItem('data') != null) {
      let data = JSON.parse(localStorage.getItem('data'));
      project = {};
      for (i = 0; i < Object.keys(data).length; i++) {
        if (data[selected_project] != null) {
          project = data[selected_project];
        } else {
          project = {
            name: selected_project,
            tasks: {},
            tasks: {},
            participants: {
              'user_1': selected_user
            }
          }
          data[selected_project] = project;
          d_setData(data);
        }
      }
      if (Object.values(project.participants).filter(user => user = selected_user).length > 0) {
        data = project.tasks;
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

function d_setData(c, value) {
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

  } else if (c == 'data') {
    localStorage.setItem('data', JSON.stringify(value));
  }
}

function d_openFromJSON() {
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
      });
    }
  }).catch(err => {
    console.log(err)
  });
};

function d_saveToJSON() {
  date = new Date();
  datevalues = [
    date.getFullYear(),
    date.getMonth() + 1,
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
    title: 'save_' + datevalues.join('-'),
    properties: ['saveFile']
  }).then(fileName => {
    console.log(fileName.filePath);
    fs.writeFile(fileName.filePath, localStorage.getItem('data'), function(err) {
      if (err) return console.log(err);
    });
  }).catch(err => {
    console.log(err)
  });
};

function d_changeTask(task_id, task_prop, task_value) {
  tasksObjects = d_getData('tasks');
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
        if (d_setData('tasks', tasksObjects)) {
          updatedTask = document.querySelector('.' + task_id);
          updatedTask.classList.remove('ready');
          updatedTask.classList.remove('notready');
          updatedTask.classList.add(newvalue);
          document.querySelector('.' + task_id + ' .task-toggle').classList.toggle('ready');
        }
      } else if (task_prop == 'name') {
        tasksObjects[task_id].name = task_value;
        d_setData('tasks', tasksObjects);
      } else if (task_prop == 'times') {
        let newTime = {};
        newTime.start = task_value.startTime;
        newTime.end = task_value.endTime;
        newTime.duration = task_value.durNow;
        newTime.mins = JSON.parse(JSON.parse(task_value.mins));
        tasksObjects[task_id].times[Object.keys(tasksObjects[task_id].times).length + 1] = newTime;
        d_setData('tasks', tasksObjects);
      }
    }
  }
}

function d_createTask(parent, task_name, [data] = []) {
  tasksObjects = d_getData('tasks');
  //create random id
  task_id = 'task_' + d_getRandomId(5);
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
  d_setData('tasks', tasksObjects);
}

function d_deleteTaskFromData(task_id) {
  try {
    tasksObjects = d_getData('tasks');
    delete tasksObjects[task_id];
    d_setData('tasks', tasksObjects);
    return true;
  } catch (e) {
    console.log('Error on deleting ' + task_id);
    return false;
  }
}

function d_getRandomId(length) {
  chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  let word = '';
  for (let i = 0; i < length; i++) {
    word += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return word;
}

function d_readFile(filepath) {
  let text = fs.readFileSync(filepath, 'utf8', (err, data) => {
    if (err) {
      text = 'ERROR: ' + err;
    } else {
      text = data;
    }
  });
  return text;
}

function d_writeFile(filepath, text) {
  fs.writeFile(filepath, text, function(err) {
    if (err) return alert(err);
  });
}

function d_getKeyLog() {
  kLData = d_readFile('python/log');
  if (kLData[0] == ',') {
    kLData = kLData.slice(1);
  }
  return '{' + kLData + '}';
}

function d_getMins(since) {
  date = new Date();
  if (since == 'today') {
    lastMidnight = date.getTime() - (date.getSeconds() * 1000 + date.getMinutes() * 60000 + date.getHours() * 3600000);
  } else {
    lastMidnight = 0
  }
  tasksObjects = d_getData('tasks');
  allTimesToday = {}
  allTimesToday[lastMidnight] = {
    'start': String(lastMidnight),
    'end': String(lastMidnight + 1),
    'duration': '1'
  }
  allTimesThisWeek = {}
  //gett all times from today
  for (task in tasksObjects) {
    for (times in tasksObjects[task].times) {
      if (tasksObjects[task].times[times].start > lastMidnight) {
        allTimesToday[tasksObjects[task].times[times].start] = tasksObjects[task].times[times];
      }
    }
  }
  return allTimesToday;
}

function d_getActivity(since) {
  let allTimesToday = d_getMins('today');
  //analize activity
  let activity = [];
  //gee activity for every hour
  for (i = 0; i <= 24; i++) {
    minTime = lastMidnight + (1000 * 60 * 60 * i);
    maxTime = lastMidnight + (1000 * 60 * 60 * i) + (1000 * 60 * 59);
    timeActivity = 0
    timeDuration = 0
    for (time in allTimesToday) {
      for (min in allTimesToday[time].mins) {
        if (min > minTime && min < maxTime) {
          timeDuration += 1
          timeActivity += Number(allTimesToday[time].mins[min].keys)
          timeActivity += Number(allTimesToday[time].mins[min].mouse)
        }
      }
    }
    activity.push({
      x: i,
      dur: timeDuration,
      clicks: timeActivity
    });
    //
    // activity.push({
    //   x: (date.getTime() - lastMidnight) / 1000,
    //   y: 0
    // });
    //
    // activity.push({
    //   x: 60 * 60 * 24,
    //   y: 0
    // });
  }
  return activity;
}

function d_getProgsStats(since) {
  let allTimesToday = d_getMins(since);
  let progs = [];

  for (time in allTimesToday) {
    for (min in allTimesToday[time].mins) {
      for (prog in allTimesToday[time].mins[min].progs) {
        timeActivity = 0;

        if (allTimesToday[time].mins[min].progs[prog].keyboard)
          timeActivity += Number(allTimesToday[time].mins[min].progs[prog].keyboard);
        if (allTimesToday[time].mins[min].progs[prog].mouse)
          timeActivity += Number(allTimesToday[time].mins[min].progs[prog].mouse);
        if (allTimesToday[time].mins[min].progs[prog].duration)
          timeActivity += Number(allTimesToday[time].mins[min].progs[prog].duration);

        title = allTimesToday[time].mins[min].progs[prog].title;
        //decode title
        title = atob(title);
        //grouping classes, works manualy now
        titleClasses = ['Atom$','YouTube$','Google Chrome$','^Telegram'];
        titleClassesNames = ['Atom','YouTube','Google Chrome','Telegram'];
        for(titleClass in titleClasses){
          re = new RegExp(titleClasses[titleClass],'gi');
          if(re.test(title)){
            title = titleClassesNames[titleClass];
          }
        }
        //encode title
        title = btoa(title);

        if(typeof progs[title] == 'undefined') {
          progs[title] = 0;
        }
        progs[title] += timeActivity;
      }
    }
  }
  newprog = []
  activityCount = 0;
  //convert for more sortable array
  for(prog in progs){
    newprog.push([prog,progs[prog]]);
  }
  progs = newprog;
  progs.sort(function(a,b){
    return b[1] - a[1];
  });
  return progs;
}
