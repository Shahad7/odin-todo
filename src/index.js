import './style.css'
import closeICon from './close.svg'
import pencilIcon from './pencil.svg'
import eyeIcon from './eye.svg'
import plusICon from './plus.svg'
import trashIcon from './trash.svg'
import tickIcon from './tick.svg';
import projectIcon from './project.svg'
import inboxIcon from './inbox.svg'
import todayIcon from './today.svg'
import weekIcon from './week.svg'
import flagIcon from './flag.svg';

//start
const taskHandler = (function (){

    const taskConstructor = (name,description,dueDate,priority) => {
        return {name,description,dueDate,priority}
    
    }

    const isDuplicate = (task,project)=>{
        let projects = projectHandler.getProjects()
        let found = 0
        for(let i in projects)
        {
            for(let j in projects[i].tasks)
            {
                if(task==projects[i].tasks[j])
                {
                    found = 1;
                    return true
                }
            }
        }
        if(found==0)
            return false;

    }

    const pushTask = (obj,project)=>{
        let projects = projectHandler.getProjects()
        let index;
        for(let i in projects)
        {
            if(projects[i].title==project)
            {
                index = i;
                break;
            }
        }
        projects[index].tasks.push(obj)
       
    }

    return {taskConstructor,isDuplicate,pushTask}
})();


const projectHandler = (function (){

    let projects = [];
    const projectConstructor = (title) => {
        return {"title":title,"tasks":[]}
    }

    projects.push(projectConstructor('inbox'))
    projects.push(projectConstructor('today'))
    projects.push(projectConstructor('week'))

    const pushProject = (obj)=>{
        projects.push(obj)
    }

    const getProjects = ()=>{
        return projects;
    }

    const isDuplicate = (str)=>{
        let found = 0
        for(let i in projects){
            if(projects[i].title==str)
            {
                found = 1
                return true
            }         
        }
        if(found==0)
        {
            return false
        }

    }

    const deleteProject = (str)=>{
        projects = projects.filter((project)=>{
            return project.title!=str
        })
        console.log(projects)
    }

    return{projectConstructor,pushProject,getProjects,isDuplicate,deleteProject}

})();


const DOMHandler = (function (){

    //event listeners

    //to change input range color based on chosen priority
    const range = document.getElementById('priority')
    range.value = '1';
    range.addEventListener('input',()=>{
        changeColor()
    })

    function changeColor(){
        if(range.value=='0')
            range.style.accentColor = 'green'
        else if(range.value=='1')
            range.style.accentColor = 'yellow'
        else if(range.value=='2')
            range.style.accentColor = 'red'
    }


    //closing n opening task form
    const formCloseButton = document.querySelector('#form-close-button')
    const newTaskButton = document.querySelector('.add-task')
    const newTaskForm = document.querySelector('.add-task-form')
    const content = document.querySelector('.content')

    formCloseButton.addEventListener('click',()=>{
        newTaskForm.style.visibility = 'hidden'
        newTaskForm.style.transform = 'scale(0.2)'
        content.style.filter = 'none'
    })

    newTaskButton.addEventListener('click',()=>{
        newTaskForm.style.visibility = 'visible'
        newTaskForm.style.transform = 'scale(1)'
        content.style.filter = 'blur(8px)'
    })


    //new project opening n closing
    const newProjectButton = document.querySelector('#add-project-btn')
    const newProjectForm = document.querySelector('.project-form')
    const cancelProjectButton = document.querySelector('#cancel-project-btn')


    newProjectButton.addEventListener('click',()=>{
        newProjectForm.style.display = 'block';
        newProjectButton.style.display = 'none';
    })

    cancelProjectButton.addEventListener('click',()=>{
        newProjectForm.style.display = 'none';
        newProjectButton.style.display = 'flex';
    })

    //saving project n appending new project to DOM
    let projectTitle;
    const projectInput = document.querySelector('#project-title')
    const saveProjectButton = document.querySelector('#save-project-btn')
    const sidebar = document.querySelector('.sidebar')

    saveProjectButton.addEventListener('click',()=>{
        if(projectInput.value.trim().length!=0)
        {
            projectTitle = projectInput.value.trim()
            if(!(projectHandler.isDuplicate(projectTitle)))
            {
                let newProject = projectHandler.projectConstructor(projectTitle)
                projectHandler.pushProject(newProject)
                projectInput.value = ""
                newProjectForm.style.display = 'none';
                newProjectButton.style.display = 'flex';
                let elt = document.createElement('div')
                let temp = document.createElement('div')
                elt.classList.add('project-item')

                // event listener for non-default projects to add their tasks to DOM
                elt.addEventListener('click',()=>{
                    taskList.replaceChildren()
                    currentProject = elt.getAttribute('data-title')
                    addTasksToList()
                    deleteProjectButton.style.display = 'flex'
                    newTaskButton.style.display = 'flex'
                
                })

                elt.setAttribute('data-title',projectTitle)
                elt.setAttribute('tabindex','1')
                temp.textContent = projectTitle
                let icon = document.createElement('img')
                icon.src = projectIcon;
                elt.append(icon,temp)
                sidebar.appendChild(elt)

            }
            else{
                alert('project title already exists')
                projectInput.value = ""
            }
        }
        else{
            alert("project title can't be empty")

        }
    })

    //viewing non-default projects

    const addTasksToList = ()=>{
        let projects = projectHandler.getProjects()
        let index;
        for(let i in projects)
        {
            if(projects[i].title==currentProject)
            {
                index = i;
                break;
            }
        }
        if(projects[index].tasks.length!=0)
        {         
            let tasks = projects[index].tasks
            let items = []
            for(let j in tasks)
            {
                items.push(constructTaskElement(tasks[j].name,tasks[j].description,
                    tasks[j].dueDate,tasks[j].priority))
            }
            taskList.replaceChildren(items)
            console.log(items)
            //start from here next time
        }
    }

    //viewing default projects
    let currentProject = "";
    const inbox = document.querySelector("[data-title='inbox']");
    const today = document.querySelector("[data-title='today']");
    const week = document.querySelector("[data-title='week']");

    [inbox,today,week].forEach(elt=>{

        if(elt==inbox)
        {
            elt.addEventListener('click',()=>{
                currentProject = elt.getAttribute('data-title')
                deleteProjectButton.style.display = 'none'
                newTaskButton.style.display = 'flex'
            })
        }
        else{
            elt.addEventListener('click',()=>{
                currentProject = elt.getAttribute('data-title')
                deleteProjectButton.style.display = 'none'
                newTaskButton.style.display = 'none'
            })
        }
     }
    )

    //deleting projects
    const deleteProjectButton = document.querySelector('#delete-project-btn')
    deleteProjectButton.addEventListener('click',()=>{       
        if(currentProject!=="")
            {
            sidebar.removeChild(document.querySelector(`[data-title=${currentProject}]`))
            taskList.replaceChildren()
            projectHandler.deleteProject(currentProject)
            currentProject = ""
            }
    })


    //function to create a task DOM element
    function constructTaskElement(nameArg,descArg,dueDateArg,priorityArg){
     
    let task = document.createElement('div')
    task.classList.add('item')
    let name = document.createElement('div')
    name.textContent = nameArg
    name.setAttribute('id','task-DOM-name')
    let flag = document.createElement('img')
    flag.setAttribute('id','flag')
    flag.src = flagIcon
    console.log(nameArg+priorityArg)
    if(priorityArg=='0')
        flag.style.filter = 'invert(30%) sepia(83%) saturate(402%) hue-rotate(31deg) brightness(95%) contrast(86%)'
    else if(priorityArg=='2')
        flag.style.filter = 'invert(91%) sepia(148%) saturate(4729%) hue-rotate(359deg) brightness(137%) contrast(175%)'
    else
        flag.style.filter = 'invert(21%) sepia(88%) saturate(6850%) hue-rotate(357deg) brightness(96%) contrast(112%)'        

    let dueDate = document.createElement('div')
    dueDate.textContent = dueDateArg
    let options = document.createElement('div')
    options.classList.add('options')
    let eye = document.createElement('img')
    eye.setAttribute('id','eye')
    eye.src = eyeIcon
    let pencil = document.createElement('img')
    pencil.setAttribute('id','pencil')
    pencil.src = pencilIcon
    let trash = document.createElement('img')
    trash.setAttribute('id','trash')
    trash.src = trashIcon
    options.append(eye,pencil,trash)
    task.append(name,flag,dueDate,options)

    return task;

    }
    

    //saving task
    const saveTaskButton = document.querySelector('#save-button')
    const taskName = document.querySelector('#task-name')
    const taskDesc = document.querySelector('#task-desc')
    const taskDue = document.querySelector('#date')
    const taskPriority = document.querySelector('#priority')
    const taskList = document.querySelector('.list')

    saveTaskButton.addEventListener('click',()=>{

        if(!taskHandler.isDuplicate(taskName.value.trim(),currentProject))
        {
            if(taskName.value.trim().length!=0&&taskDesc.value.trim().length!=0
            &&taskDue.value.length!=0&&taskPriority.value.length!=0)
            {
                let newTask = taskHandler.taskConstructor(taskName.value.trim(),taskDesc.value.trim(),
                taskDue.value,taskPriority.value)
                
                taskHandler.pushTask(newTask,currentProject)
                let taskELT = constructTaskElement(newTask.name,newTask.description,
                    newTask.dueDate,newTask.priority)
                taskList.appendChild(taskELT);

                //closing form
                taskName.value = ""
                taskDesc.value = ""
                taskDue.value = null
                taskPriority.value = '1'
                taskPriority.style.accentColor = 'yellow'
                newTaskForm.style.visibility = 'hidden'
                newTaskForm.style.transform = 'scale(0.2)'
                content.style.filter = 'none'
            }
            else{
                alert('fields can\'t be empty')
            }

        }
        else{
            alert('task name must be unique')
        }
        
    })
    

})();

