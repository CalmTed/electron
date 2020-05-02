var vin = document.querySelector('.vin');

function showView(sw_view) {
  /// ---------- PLANNER ---------- ///
  if (sw_view == 'planner') {
    tasksObjects = getData('tasks');
    let tasks = '';
    if (Object.keys(tasksObjects).length > 0) {
      for (i = 0; i < Object.keys(tasksObjects).length; i++) {
        task = tasksObjects[Object.keys(tasksObjects)[i]];
        let childrenToggle = '<div class="task-children-toggle-margin"></div>';
        if (Object.keys(task.children).length > 0) {
          childrenToggle = '<div class="task-children-toggle" onclick="toggleChildren(this)" children="' + Object.values(task.children).toString() + '"></div>';
        }
        tasks += '<div class="task ' + Object.keys(tasksObjects)[i] + ' ' + task.status + '" >' + childrenToggle + '<span class="task-name" >' + task.name + '</span><span class="task-menu context-task" taskId="' + Object.keys(tasksObjects)[i] + '" onclick=""></span></div>';
        // tasks += '<div class="task ' + Object.keys(tasksObjects)[i] + ' ' + task.status + '"  onclick="try{changeTask(\'' + Object.keys(tasksObjects)[i] + '\',\'status\',\'toggle\')}catch(e){}">' + childrenToggle + '<span class="task-name">' + task.name + '</span><span class="task-menu"></span></div>';
      }
      tasks += '<div class="task"><div class="task-children-toggle-add"></div><span class="task-name">Add new task</span></div>';
    } else {
      //no tasks
      tasks += '<div class="task"><div class="task-children-toggle-margin"></div><span class="task-name">You\'re free to go</span><span class="task-menu"></span></div>';
    }
    content = '<div class="content">' + tasks + '</div>';

    header = '<div class="header"><div class="button" onclick="showMenu()"></div><div class="title">Planner</div></div>';
    /// ---------- TIME TRACKER ---------- ///
  } else if (sw_view == 'tracker') {
    content = '<div class="content"></div>';
    header = '<div class="header"><div class="button"></div><div class="title"></div></div>';
  } else {
    content = '<div class="content"><div class="all-cented">We are having some troubles. You doomed -_-</div></div>';
    header = '<div class="header"><div class="button"></div><div class="title">View of error</div></div>';
  }
  fixed = '<div class="context-menu hidden"></div>';
  vin.innerHTML = header + content + fixed;


  document.querySelector(".vin").addEventListener("click", function(e) {
    //if context menu is shown
    if (!document.querySelector('.context-menu').classList.contains('hidden')) {
      if (e.target.classList.contains('context-task')) {
        context(e.target, e.pageX, e.pageY);
      } else {
        context('close');
      }
    } else {
      context(e.target, e.pageX, e.pageY)
    }
    //if task is beeing edited
      if (document.querySelector('.task.editing') && !e.target.classList.contains('cm-option') && !e.target.classList.contains('task-name') && !e.target.classList.contains('task-name-input')) {
      cancelTaskEditing();
    }
  });
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
  //day
  if (time > 6 && time < 20) {
    vin.style.setProperty('--bg', "#fff");
    vin.style.setProperty('--hover', "#eee");
    vin.style.setProperty('--mid', "#ccc");
    vin.style.setProperty('--color', "#000");
    //night
  } else {
    vin.style.setProperty('--bg', "#222");
    vin.style.setProperty('--hover', "#333");
    vin.style.setProperty('--mid', "#777");
    vin.style.setProperty('--color', "#bbb");
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
    options += '<div class="cm-option" onclick="editTaskName(\''+e.getAttribute('taskId')+'\')">Edit task</div>';
    options += '<div class="cm-option" onclick="">Add new task inside</div>';
    options += '<div class="cm-option" onclick="">Delete task</div>';
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
function editTaskName(task_id){
  document.querySelector('.'+task_id).classList.add('editing');
  let taskName = document.querySelector('.'+task_id+' .task-name');
  let namenow = taskName.innerHTML;
  taskName.innerHTML = '<input type="text" class="task-name-input" oldvalue="'+namenow+'" value="'+namenow+'"><input class="task-name-input" type="submit" onclick="saveTaskName()">';

}
function cancelTaskEditing(){
  let taskName = document.querySelector('.task.editing .task-name');
  oldName = document.querySelector('.task.editing .task-name input').getAttribute('oldvalue');
  taskName.innerHTML = oldName;
  document.querySelector('.task.editing').classList.remove('editing');
}
function saveTaskName(){
  console.log('save');
  let taskName = document.querySelector('.task.editing .task-name');
  newName = document.querySelector('.task.editing .task-name input').getAttribute('value');
  taskName.innerHTML = newName;
  changeTask('input_1','name',newName);
  document.querySelector('.task.editing').classList.remove('editing');
}

showView(selected_view);
