var vin = document.querySelector('.vin');
var Chart = require('chart.js');

const menuButton = '<div class="button" onclick="menu(\'toggle\')"></div>';
var titleTimeNum = 0; //todays time for all tasks
var startTime = 0; //start time for every starting job (not sum of anything)
function showView(sw_view) {


  /// ---------------------------------- ///
  /// ------------ PLANNER ------------- ///
  /// ---------------------------------- ///
  // plan for every view
  // define content = '<div class="content">' + tasks + '</div>';
  content = '<div class="content"><div class="all-cented">We are having some troubles. You doomed -_-</div></div>';
  // define header = '<div class="header">' + menuButton + '<div class="title">Planner</div></div>';
  header = '<div class="header">' + menuButton + '<div class="title">Error view</div></div>';
  // define onready function
  onReady = function(){}

  
  if (sw_view == 'planner') {
    tasksObjects = d_getData('tasks');
    let tasks = '';
    if (Object.keys(tasksObjects).length > 0) {
      for (i = 0; i < Object.keys(tasksObjects).length; i++) {
        task = tasksObjects[Object.keys(tasksObjects)[i]];
        let childrenToggle = '<div class="task-children-toggle-margin"></div>';
        if (Object.keys(task.children).length > 0) {
          //childrenToggle = '<div class="task-children-toggle" onclick="toggleChildren(this)" children="' + Object.values(task.children).toString() + '"></div>';
        }
        tasks += '<div class="task ' + Object.keys(tasksObjects)[i] + ' ' + task.status + '" >' + childrenToggle + '<span class="task-name" >' + task.name + '</span><span class="task-menu context-task" taskId="' + Object.keys(tasksObjects)[i] + '" onclick=""></span></div>';
        // tasks += '<div class="task ' + Object.keys(tasksObjects)[i] + ' ' + task.status + '"  onclick="try{d_changeTask(\'' + Object.keys(tasksObjects)[i] + '\',\'status\',\'toggle\')}catch(e){}">' + childrenToggle + '<span class="task-name">' + task.name + '</span><span class="task-menu"></span></div>';
      }
      //add new task
      tasks += '<div class="task task_addnew_top" onclick="addTask(\'task_addnew_top\')"><div class="task-children-toggle-add"></div><span class="task-name">Add new task</span></div>';
    } else {
      //no tasks
      //tasks += '<div class="task"><div class="task-children-toggle-margin"></div><span class="task-name"></span></div>';
      //add new task
      tasks += '<div class="task task_addnew_top" onclick="addTask(\'task_addnew_top\')"><div class="task-children-toggle-add"></div><span class="task-name">Add new task</span></div>';
    }
    content = '<div class="content">' + tasks + '</div>';

    header = '<div class="header">' + menuButton + '<div class="title">Planner</div></div>';


    /// ---------------------------------- ///
    /// ---------- TIME TRACKER ---------- ///
    /// ---------------------------------- ///
  } else if (sw_view == 'tracker') {
    tasksObjects = d_getData('tasks');
    let tasks = '';
    let titleMoneyText = '$0';
    let titleTimeText = '00:00:00';
    titleTimeNum = 0;
    if (Object.keys(tasksObjects).length > 0) {
      for (i = 0; i < Object.keys(tasksObjects).length; i++) {
        task = tasksObjects[Object.keys(tasksObjects)[i]];
        if (Object.keys(task.children).length == 0 && task.status !== 'hah?ready') {
          task_id = Object.keys(tasksObjects)[i];
          //get task time
          taskFullTimeNum = 0; //from creting
          taskTodayTimeNum = 0; //todys time
          if (Object.keys(task.times).length > 0) {
            for (j = 0; j < Object.keys(task.times).length; j++) {
              durationTime = Number(task.times[Object.keys(task.times)[j]].duration);
              taskFullTimeNum += durationTime;
              //is todays
              date = new Date();
              lastMidnight = date.getTime() - (date.getSeconds() * 1000 + date.getMinutes() * 60000 + date.getHours() * 3600000);
              if (Number(task.times[Object.keys(task.times)[j]].end) > lastMidnight) {
                titleTimeNum += durationTime;
                taskTodayTimeNum += durationTime;
              }
            }
          }
          taskTimeSumText = formatTime('task', taskFullTimeNum);

          taskToggle = '<div class="task-toggle ' + task.status + '" onclick="d_changeTask(\'' + task_id + '\',\'status\',\'toggle\')" ><span class="task-toggle-blocky"></span></div>';
          if(task.status !== 'ready'){
            tasks += '<div class="task ' + task_id + ' ' + task.status + '" taskid="' + task_id + '">' + taskToggle + '<span class="task-name" >' + task.name + '</span><span class="task-time-sum" taskTodayDur="' + taskTodayTimeNum + '">' + taskTimeSumText + '</span><span class="task-timmer-tools"><span class="task-timmer-toggle" onclick="triggerTaskTimmer(\'' + task_id + '\')"></span></span></div>';
          }

        }
      }
    } else {
      //no tasks
      tasks += '<div class="task"><div class="task-children-toggle-margin"></div><span class="task-name">You\'re free to go</span></div>';
    }

    content = '<div class="content">' + tasks + '</div>';

    //set time and money
    titleTimeText = formatTime('title', titleTimeNum);
    titleMoneyText = '₴' + Math.round(((titleTimeNum / 3600000) * payment) * 100) / 100;

    header = '<div class="header">' + menuButton + '<div class="title">' + titleTimeText + '</div><div class="header-money-ticker">' + titleMoneyText + '</div></div>';

        /// ---------------------------------- ///
        /// ----------   ANALITICS  ---------- ///
        /// ---------------------------------- ///

  }else if(sw_view == 'analitics'){
    blocks = '';
    blocks += '<div class="ana-block ana-activity" style="width:100%;height:300px"></div>';
    blocks += '<div class="ana-block ana-progs" style="width:100%;height:300px"></div>';
    blocks += '<div class="ana-block ana-project" style="width:100%;height:0px"></div>';

    content = '<div class="content">' + blocks + '</div>';
    header = '<div class="header">' + menuButton + '<div class="title">Analitics</div></div>';
    onReady = function(){
      v_drawActivityStats(document.querySelector('.ana-activity'));
      v_drawProgsStats(document.querySelector('.ana-progs'));
      v_drawProjectStats(document.querySelector('.ana-project'));
    }
  } else {
    content = '<div class="content"><div class="all-cented">We are having some troubles. You doomed -_-</div></div>';
    header = '<div class="header">' + menuButton + '<div class="title">Error view</div></div>';
  }
  fixed = '<div class="context-menu hidden"></div>';
  vin.innerHTML = header + content + fixed;
  //specific function for this view
  onReady();

  document.querySelector(".vin").addEventListener("click", function(e) {
    //if context menu is shown
    if (!document.querySelector('.context-menu').classList.contains('hidden')) {
      //if button contains .context-task
      if (e.target.classList.contains('context-task')) {
        context(e.target, e.pageX, e.pageY);
      } else {
        context('close');
      }
    } else {
      context(e.target, e.pageX, e.pageY);
    }
    //if task is beeing edited
    if (document.querySelector('.task.editing') && !e.target.classList.contains('cm-option') && !e.target.classList.contains('task-name') && !e.target.classList.contains('task-name-input')) {
      cancelTaskEditing(e.target);
    }
    if (document.querySelector('.task.editingNew') && !e.target.classList.contains('cm-option') && !e.target.classList.contains('task-name-input') && !e.target.classList.contains('task-name')) {
      cancelTaskCreating(document.querySelector('.task.editingNew'));
    }
    //stoping timer
    if (document.querySelector('.vin.timmering') && e.target.classList.contains('button')) {
      saveTaskTimmer(document.querySelector('.task.timmering').getAttribute('taskid'));
    }
  });

  window.addEventListener("beforeunload", function() {
    if(document.querySelector('.vin.timmering')){
      saveTaskTimmer(document.querySelector('.task.timmering').getAttribute('taskid'));
    }
  })
}

function toggleChildren(e) {
  //get children of clicked task
  tasksToHide = e.getAttribute('children').split(',');
  //create list of grangchildren
  let grandChildren = [];
  let recourceToggleChildren = function(task_id) {
    if (document.querySelector('.' + task_id)) {
      if (document.querySelector('.' + task_id + ' .task-children-toggle')) {
        //console.log(grandChildren);
        grandChildren = grandChildren.concat(document.querySelector('.' + task_id + ' .task-children-toggle').getAttribute('children').split(','));
        document.querySelector('.' + task_id + ' .task-children-toggle').getAttribute('children').split(',').map(function(children_id) {
          recourceToggleChildren(children_id);
        });
      }
    }
  }

  //save this child state
  let neededOpenState = !e.classList.contains('close');
  //toggle children view
  tasksToHide.map((task_id) => {
    if (document.querySelector('.' + task_id)) {
      document.querySelector('.' + task_id).classList.toggle('hidden');
      if (neededOpenState && document.querySelector('.' + task_id + ' .task-children-toggle')) {
        document.querySelector('.' + task_id + ' .task-children-toggle').classList.add('closed');
      }
    }
    recourceToggleChildren(task_id);
  });


  //toggle grandChildren view
  grandChildren.map(function(task_id) {
    //it tasks exists
    if (document.querySelector('.' + task_id)) {
      //if need to close all
      if (neededOpenState) {
        document.querySelector('.' + task_id).classList.add('hidden');
        if (document.querySelector('.' + task_id + ' .task-children-toggle')) {
          document.querySelector('.' + task_id + ' .task-children-toggle').classList.add('closed');
        }
      }
    }
  });
  //tiggle clicked task toggler
  e.classList.toggle('closed');
}

function colorModeCheck() {
  let time = new Date().getHours();
  let target = document.querySelector('body');
  //day
  if (time > 6 && time < 20) {
    target.style.setProperty('--bg', "#fff");
    target.style.setProperty('--hover', "#eee");
    target.style.setProperty('--mid', "#ccc");
    target.style.setProperty('--color', "#000");
    //night
  } else {
    target.style.setProperty('--bg', "#222");
    target.style.setProperty('--hover', "#333");
    target.style.setProperty('--mid', "#777");
    target.style.setProperty('--color', "#bbb");
  }
}
colorModeCheck();
let colormode = setInterval(function() {
  colorModeCheck();
}, 60000); //check every min

//context menu
function context(e, x, y) {
  cm = document.querySelector('.context-menu');
  if (e == 'close') {
    cm.classList.add('hidden');
  } else if (e.classList.contains('context-task')) {
    //content
    options = '';
    options += '<div class="cm-option" onclick="editTaskName(\'' + e.getAttribute('taskId') + '\')">Edit name</div>';
    options += '<div class="cm-option" onclick="d_changeTask(\'' + e.getAttribute('taskId') + '\',\'status\',\'toggle\')">Toggle status</div>';
    //options += '<div class="cm-option" onclick="addTask(\'' + e.getAttribute('taskId') + '\')">Add new task inside</div>';
    options += '<div class="cm-option" onclick="deleteTask(\'' + e.getAttribute('taskId') + '\')">Delete task</div>';
    cm.innerHTML = options;
    //syze and position
    cm.style.right = 'auto';
    if (y > window.innerHeight - cm.clientHeight) {
      y = window.innerHeight - cm.clientHeight - 10;
      cm.style.top = 'auto';
      cm.style.bottom = '10px';
    } else {
      cm.style.top = y;
      cm.style.bottom = 'auto';
    }
    if (x > window.innerWidth - cm.clientWidth) {
      x = window.innerWidth - cm.clientWidth - 10;
      cm.style.left = 'auto';
      cm.style.right = '10px';
    } else {
      cm.style.left = x;
      cm.style.right = 'auto';
    }
    cm.classList.remove('hidden');
  }
}

//edit task name
function editTaskName(task_id) {
  document.querySelector('.' + task_id).classList.add('editing');
  let taskName = document.querySelector('.' + task_id + ' .task-name');
  let namenow = taskName.innerHTML;
  taskName.innerHTML = '<input type="text" class="task-name-input" oldvalue="' + namenow + '" value="' + namenow + '"><input class="task-name-input" type="submit" onclick="saveTaskName()" value="Save">';

}

function cancelTaskEditing() {
  let taskName = document.querySelector('.task.editing .task-name');
  oldName = document.querySelector('.task.editing .task-name input').getAttribute('oldvalue');
  taskName.innerHTML = oldName;
  document.querySelector('.task.editing').classList.remove('editing');
}

function saveTaskName() {
  console.log('save');
  newName = document.querySelector('.task.editing .task-name input').value;
  if (newName.length > 0 && newName.length < 80) {
    let taskName = document.querySelector('.task.editing .task-name');
    taskName.innerHTML = newName;
    taskId = document.querySelector('.task.editing .context-task').getAttribute('taskid');
    d_changeTask(taskId, 'name', newName);
    document.querySelector('.task.editing').classList.remove('editing');
  } else {
    cancelTaskEditing();
  }
}

function addTask(task_id) {
  //if its created from the top
  if (!document.querySelector('.task.editingNew')) {

    let addNewInput = '<input type="text" class="task-name-input" placeholder="Add new task"><input class="task-name-input" type="submit" value="Create"   onclick="saveNewTask(\'' + task_id + '\')">';

    if (document.querySelector('.' + task_id).classList.contains('task_addnew_top')) {
      document.querySelector('.' + task_id + ' .task-name').innerHTML = addNewInput;
      document.querySelector('.' + task_id).classList.add('task_addnew');
      document.querySelector('.' + task_id + ' .task-name input').focus();
    } else { //if selected taks closed open it
      if (document.querySelector('.' + task_id + ' .task-children-toggle')) {
        //open every chilren
        if (document.querySelector('.' + task_id + ' .task-children-toggle').classList.contains('closed')) {
          document.querySelector('.' + task_id + ' .task-children-toggle').classList.remove('closed');
          childList = document.querySelector('.' + task_id + ' .task-children-toggle').getAttribute('children').split(',');
          childList.map(function(t_id) {
            if (document.querySelector('.' + t_id)) {
              document.querySelector('.' + t_id).classList.remove('hidden');
            }
          });
        }
      } else { //if selected task is a leaf
        //create trigger with children
        console.log(task_id);
        triggerToAdd = document.createElement('div');
        triggerToAdd.classList.add('task-children-toggle');
        triggerToAdd.onclick = "toggleChildren(this)";
        triggerToAdd.setAttribute('children', 'task_addnew');
        document.querySelector('.' + task_id + ' .task-name').before(triggerToAdd);
        //remove margin block
        deleteElement('.' + task_id + ' .task-children-toggle-margin');
      }
      //put new task inside
      newTask = document.createElement('div');
      newTask.classList.add('task');
      newTask.classList.add('task_addnew');
      newTask.innerHTML = '<div class="task task_addnew"><div class="task-children-toggle-add"></div><span class="task-name">' + addNewInput + '</span></div>';
      document.querySelector('.' + task_id).after(newTask);
    }
    document.querySelector('.' + task_id).classList.add('editingNew');
  }
}

function cancelTaskCreating(parent_task) {
  //if there is something to cancel edit
  if (document.querySelector('.task.editingNew')) {
    //if id is task_addnew_top
    if (document.querySelector('.task.editingNew').classList.contains('task_addnew_top')) {
      document.querySelector('.task.task_addnew_top').innerHTML = '<div class="task task_addnew_top" onclick="addTask(\'task_addnew_top\')"><div class="task-children-toggle-add"></div><span class="task-name">Add new task</span></div>';
      document.querySelector('.task.task_addnew_top').classList.remove('editingNew');
    } else {
      //if this is in other task id
      childElements = parent_task.children; //.filter(t => t.classList.contains('task-menu'));
      let menuElement;
      for (let i = 0; i < childElements.length; i++) {
        if (childElements[i].classList.contains('task-menu')) {
          menuElement = childElements[i];
        }
      }
      //get task_id
      task_id = menuElement.getAttribute('taskid');
      //if there is any toggle inside
      if (document.querySelector('.' + task_id + ' .task-children-toggle')) { //if it have trigger
        //if children is task_oddnew
        if (document.querySelector('.' + task_id + ' .task-children-toggle').getAttribute('children') == 'task_addnew') {
          //remove trigger
          deleteElement('.' + task_id + ' .task-children-toggle');
          //add margin
          elementToAdd = document.createElement('div');
          elementToAdd.classList.add('task-children-toggle-margin');
          document.querySelector('.' + task_id + ' .task-name').before(elementToAdd);
        }
      }
      parent_task.classList.remove('editingNew');
      deleteElement('.task.task_addnew');
    }
  }
}

function saveNewTask(parent_task) {
  taskName = document.querySelector('.task_addnew .task-name-input').value;
  if (taskName.length > 0 && taskName.length < 80) {
    let new_task_id = '';
    try {
      new_task_id = d_createTask(parent_task, taskName);
      //if this new task is on top level
      if (document.querySelector('.task.editingNew').classList.contains('task_addnew_top')) {

        document.querySelector('.task_addnew_top .task-name').innerHTML = 'Add new task';
        document.querySelector('.task_addnew_top').classList.remove('editingNew');

        let newTask = document.createElement('div');
        newTask.classList.add('task');
        newTask.classList.add(new_task_id);
        newTask.classList.add('notready');
        newTask.innerHTML = '<div class="task-children-toggle-margin"></div><span class="task-name" >' + taskName + '</span><span class="task-menu context-task" taskId="' + new_task_id + '" onclick=""></span>';
        document.querySelector('.content').insertBefore(newTask, document.querySelector('.task_addnew_top'));

      } else {
        //remove add task-children-toggle-add
        //replace name
        //add menu
      }
    } catch (e) {
      console.log('Error creating new task with name: ' + taskName);
      console.error(e);
    }
  } else {
    cancelTaskCreating();
  }
}

function deleteTask(task_id) {
  if (d_deleteTaskFromData(task_id)) {
    deleteElement('.' + task_id);
  }
}

function deleteElement(querySelector) {
  try {
    let elementToDelete = document.querySelector(querySelector);
    elementToDelete.parentNode.removeChild(elementToDelete);
  } catch (e) {
    console.log('Error on deleting DOM element on query: ' + task_id);
    console.log(e);
  }
}
showView(selected_view);

function menu(command) {
  let menu = document.querySelector('.menu');
  let overlay = document.querySelector('.overlay');
  switch (command) {
    case 'toggle':
      menu.classList.toggle('hidden');
      overlay.classList.toggle('hidden');
      break;
    case 'open':
      break;
    case 'close':

      break;
    default:
      console.log('There are no command for menu: ' + command);

  }
}


function triggerTaskTimmer(task_id) {
  if (!vin.classList.contains('timmering')) {
    startTimmer(task_id);
  } else {
    if (document.querySelector('.' + task_id).classList.contains('timmering')) {
      saveTaskTimmer(task_id);
    }
  }
}

var timmerInterval = 0;

function startTimmer(task_id) {
  vin.classList.add('timmering');
  //save start time
  startTime = new Date().getTime();
  //change task class
  document.querySelector('.' + task_id).classList.add('timmering');
  //change trigger button
  timmerInterval = setInterval(function() {
    //header
    timeNow = new Date().getTime();
    durNow = timeNow - startTime;
    document.querySelector('.header .title').innerHTML = formatTime('title', titleTimeNum + durNow);
    document.querySelector('.header .header-money-ticker').innerHTML = '₴' + Math.round((((titleTimeNum + durNow) / 3600000) * payment) * 100) / 100;
    document.querySelector('.task.timmering .task-time-sum').innerHTML = formatTime('title', Number(document.querySelector('.task.timmering .task-time-sum').getAttribute('tasktodaydur')) + durNow);

  }, 1000);

  //start python keylogger
  d_writeFile('python/workstatus', 'onair');

  //play sound
  let playsound = function(){
    if(document.querySelector('.task.timmering')){
        sound = document.createElement('audio');
      timeNow = new Date().getTime();
      durNow = (timeNow - startTime)/3600000;
      if(Math.abs(durNow - Math.round(durNow)) < 0.1){
        sound.src = './static/aberrian_long.mp3';
      }else{
        sound.src = './static/aberrian_short.mp3';
      }
      sound.volume = 0.2;
      sound.classList.add('sound-player');
      sound.play();
      setTimeout(function(){
        playsound();
      },1000*60*15);//15 mins
    }
  }
  playsound();
}

function saveTaskTimmer(task_id) {
  endTime = new Date().getTime();
  durNow = endTime - startTime;
  titleTimeNum = Number(titleTimeNum + durNow);
  newtaskTimeNum = Number(document.querySelector('.task.timmering .task-time-sum').getAttribute('tasktodaydur')) + durNow;
  document.querySelector('.task.timmering .task-time-sum').setAttribute('tasktodaydur', newtaskTimeNum);
  document.querySelector('.task.timmering .task-time-sum').innerHTML = formatTime('task', newtaskTimeNum);

  clearInterval(timmerInterval);
  stats = d_getKeyLog();
  d_changeTask(task_id, 'times',{'startTime':startTime, 'endTime':endTime, 'durNow':durNow,'mins':JSON.stringify(stats)});

  vin.classList.remove('timmering');
  document.querySelector('.' + task_id).classList.remove('timmering');
  //clear log file
  d_writeFile('python/log','');
  //finish python keylogger
  d_writeFile('python/workstatus', 'notonair');
}

function formatTime(c, t) { //command, time
  let formtedTime = '';
  if (c == 'title') {
    dayS = t / 1000;
    dayM = Math.floor(dayS / 60);
    dayH = Math.floor(dayM / 60);
    dayM = Math.floor(dayM - (dayH * 60));
    dayS = Math.floor(dayS - (dayM * 60) - (dayH * 60 * 60));
    if (dayS < 10) {
      dayS = '0' + dayS
    }
    if (dayM < 10) {
      dayM = '0' + dayM
    }
    if (dayH < 10) {
      dayH = '0' + dayH
    }
    formtedTime = dayH + ':' + dayM + ':' + dayS;
  } else if (c == 'task') {
    timeS = t / 1000;
    timeM = Math.floor(timeS / 60);
    timeH = Math.floor(timeM / 60);
    timeD = Math.floor(timeH / 24);
    timeH = Math.floor(timeH - timeD * 24);
    timeM = Math.floor(timeM - timeH * 60 - timeD * 60 * 24);
    timeS = Math.floor(timeS - timeM * 60 - timeH * 60 * 60 - timeD * 60 * 60 * 24);
    if (t == 0) {
      formtedTime = 'NEW';
    } else if (t < 60 * 1000) {
      formtedTime = timeS + 's';
    } else if (t < 60 * 60 * 1000) {
      formtedTime = timeM + 'm';
      if (timeS > 5 && timeM < 15) {
        formtedTime += ' ' + timeS + 's'
      }
    } else if (t < 24 * 60 * 60 * 1000) {
      if(timeH<2){
        formtedTime = timeH + 'hr';
      }else{
        formtedTime = timeH + 'hrs';
      }
      if (timeM > 5 && timeH < 5) {
        formtedTime += ' ' + timeM + 'm'
      }
    } else if (t < 2 * 24 * 60 * 60 * 1000) {
      formtedTime = timeD + 'day';
      if (timeH > 2) {
        formtedTime += ' ' + timeH + 'hrs'
      }
    } else if (t < 7 * 24 * 60 * 60 * 1000) {
      formtedTime = timeD + 'days';
    } else if (timeD < 14 * 24 * 60 * 60 * 1000) {
      formtedTime = Math.round((timeD / 7)) + 'week';
    } else {
      formtedTime = Math.round((timeD / 7)) + 'weeks';
    }

  }

  return formtedTime;
}


function v_drawActivityStats(e){
  ctx = document.createElement('canvas');
  dataData = [];
  dataDur = [];
  dataLabels = [];
  activity = d_getActivity();
  for(dot in activity){
    dataData.push(activity[dot].clicks);
    dataDur.push(activity[dot].dur);
    dataLabels.push(activity[dot].x);
  }

  data = {
        datasets: [{
            data: dataData,
            backgroundColor:'rgba(255, 99, 132, 0.5)',
            label: 'Activity',
            yAxisID: 'left-y-axis'
        },{
            data: dataDur,
            backgroundColor:'rgba(54, 162, 235, 0.5)',
            label: 'Time',
            yAxisID: 'right-y-axis'
        }],
        labels: dataLabels
    }
    options = {
          scales: {
              yAxes: [{
                  id: 'left-y-axis',
                  type: 'linear',
                  position: 'left'
              },{
                  id: 'right-y-axis',
                  type: 'linear',
                  position: 'right'
              }]
          }
      }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
  e.innerHTML = '';
  e.append(ctx);
}
function v_drawProgsStats(e){

  progStats = d_getProgsStats('today');
  dataData = [];
  dataTitles = [];
  for(prog in progStats ){
    dataData.push(progStats[prog][1]);
    dataTitles.push(atob(progStats[prog][0]));
  }

  //group 'other' titles
  countDataValueAfter10 = 0;
  dataId = 0;
  for(data in dataData){
    if(dataId>4){
      countDataValueAfter10 += Number(data);
    }
    dataId++;
  }
  dataData = dataData.splice(0,4);
  dataTitles = dataTitles.splice(0,4);
  dataData.push(countDataValueAfter10);
  dataTitles.push('Other');
  // console.log(dataData);
  // console.log(dataTitles);
  ctx = document.createElement('canvas');
  data = {
    datasets: [{
        data: dataData,
        backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
            borderWidth: 0
    }],
    labels: dataTitles
  };
  options = {

  };
  var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  });
  e.innerHTML = '';
  e.append(ctx);
}
function v_drawProjectStats(){
  return '';

}
