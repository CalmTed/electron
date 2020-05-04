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
      //add new task
      tasks += '<div class="task task_addnew_top" onclick="addTask(\'task_addnew_top\')"><div class="task-children-toggle-add"></div><span class="task-name">Add new task</span></div>';
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
      //if button contains .context-task
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
      cancelTaskEditing(e.target);
    }
    if (document.querySelector('.task.editingNew') && !e.target.classList.contains('cm-option') && !e.target.classList.contains('task-name-input') && !e.target.classList.contains('task-name')) {
      cancelTaskCreating(document.querySelector('.task.editingNew'));
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
    options += '<div class="cm-option" onclick="editTaskName(\'' + e.getAttribute('taskId') + '\')">Edit name</div>';
    options += '<div class="cm-option" onclick="addTask(\'' + e.getAttribute('taskId') + '\')">Add new task inside</div>';
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
    changeTask(taskId, 'name', newName);
    document.querySelector('.task.editing').classList.remove('editing');
  } else {
    cancelTaskEditing();
  }
}

function addTask(task_id) {
  //if its created from the top
  if (!document.querySelector('.task.editingNew')) {

    let addNewInput = '<input type="text" class="task-name-input" placeholder="Add new task"><input class="task-name-input" type="submit" onclick="saveNewTask(\'' + task_id + '\')">';

    if (document.querySelector('.' + task_id).classList.contains('task_addnew_top')) {
      document.querySelector('.' + task_id + ' .task-name').innerHTML = addNewInput;
      document.querySelector('.' + task_id).classList.add('task_addnew');
      //document.querySelector('.task.task_addnew').classList.remove('task_addnew_top');
    } else {//if selected taks closed open it
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
      } else {//if selected task is a leaf
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

function saveNewTask(parent_task){
  taskName = document.querySelector('.task_addnew .task-name-input').value;
  if (taskName.length > 0 && taskName.length < 80) {
    createTask(parent_task,taskName);
    if(document.querySelector('.task.editingNew').classList.contains('task_addnew_top')){

    }else{
      //remove add task-children-toggle-add
      //replace name
      //add menu
    }
  }else{
    cancelTaskCreating();
  }
}

function deleteElement(querySelector) {
  let elementToDelete = document.querySelector(querySelector);
  elementToDelete.parentNode.removeChild(elementToDelete);
}
showView(selected_view);
