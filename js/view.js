var vin = document.querySelector('.vin');
function showView(sw_view){
  /// ---------- PLANNER ---------- ///
  if(sw_view == 'planner'){
    tasksObjects = getData('tasks');
    let tasks = '';
    if(Object.keys(tasksObjects).length>0){
      for(i=0;i<Object.keys(tasksObjects).length;i++){
        task = tasksObjects[Object.keys(tasksObjects)[i]];
        tasks += '<div class="task '+ Object.keys(tasksObjects)[i] +' '+task.status+'"  onclick="try{changeTask(\''+ Object.keys(tasksObjects)[i] +'\',\'status\',\'toggle\')}catch(e){}"><span class="task-name">'+task.name+'</span><span class="task-menu"></span></div>';
      };
    }else{
      tasks += '<div class="task"><span class="task-name">You\'re free to go</span><span class="task-menu"></span></div>';
    }
    content = '<div class="content">'+tasks+'</div>';


    header = '<div class="header"><div class="button" onclick="openFromJSON()"></div><div class="title">Planner</div></div>';
  /// ---------- TIME TRACKER ---------- ///
  }else if(sw_view == 'tracker'){

    content = '<div class="content"></div>';
    header = '<div class="header"><div class="button"></div><div class="title"></div></div>';
  }else{
    content = '<div class="content"><div class="all-cented">We are having some troubles. You doomed -_-</div></div>';
    header = '<div class="header"><div class="button"></div><div class="title">View of error</div></div>';
  }
  vin.innerHTML = header+content;
}
function colorModeCheck(){
  let  time = new Date().getHours();
  //day
  if(time>6&&time<20){
    vin.style.setProperty('--bg', "#fff");
    vin.style.setProperty('--hover', "#eee");
    vin.style.setProperty('--color', "#000");
  //night
  }else{
    vin.style.setProperty('--bg', "#222");
    vin.style.setProperty('--hover', "#333");
    vin.style.setProperty('--color', "#bbb");
  }
}
colorModeCheck();
let colormode = setInterval(function(){
  colorModeCheck();
},1800000);//check every 30min

showView(selected_view);
