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
                if(task==projects[i].tasks[j].name)
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

    const updateTask = (obj,task,project) =>{
        let projects = projectHandler.getProjects()
        let projectIndex,taskIndex;
        for(let i in projects)
        {
            if(projects[i].title==project)
            {
                projectIndex = i;
                break;
            }
        }
    
        for(let j in projects[projectIndex].tasks)
        {
            if(projects[projectIndex].tasks[j].name==task)
            {
                taskIndex = j
                break;
            }
        } 
        projects[projectIndex].tasks[taskIndex] = obj;
    }

    const cleanUp = (project,task)=>{
        let projects = projectHandler.getProjects()
        let projectIndex,taskIndex;
        for(let i in projects)
        {
            if(projects[i].title==project)
            {
                projectIndex = i;
                break;
            }
        }
    
        for(let j in projects[projectIndex].tasks)
        {
            if(projects[projectIndex].tasks[j].name==task)
            {
                taskIndex = j
                break;
            }
        }
        projects[projectIndex].tasks.splice(taskIndex,1)

    }

    return {taskConstructor,isDuplicate,pushTask,updateTask,cleanUp}
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
        
    }

    return{projectConstructor,pushProject,getProjects,isDuplicate,deleteProject}

})();


const DOMHandler = (function (){


    //to change input range color based on chosen priority
    const range = document.getElementById('priority')
    range.value = '1';
    range.addEventListener('input',()=>{
        changeColor(range,range.value)
    })

    function changeColor(elt,value){
        if(value=='0')
           elt.style.accentColor = 'green'
        else if(value=='1')
            elt.style.accentColor = 'yellow'
        else if(value=='2')
            elt.style.accentColor = 'red'
    }


    //closing n opening task form
    const formCloseButton = document.querySelector('#form-close-button')
    const newTaskButton = document.querySelector('.add-task')
    const newTaskForm = document.querySelector('.add-task-form')
    const content = document.querySelector('.content')
    const taskName = document.querySelector('#task-name')
    const taskDesc = document.querySelector('#task-desc')
    const taskDue = document.querySelector('#date')
    const taskPriority = document.querySelector('#priority')

    formCloseButton.addEventListener('click',()=>{
        newTaskForm.style.visibility = 'hidden'
        newTaskForm.style.transform = 'scale(0.2)'
        content.style.filter = 'none'
        taskDesc.value = ""
        taskName.value = ""
        taskDue.value = null
        taskPriority.value = '1'
        taskPriority.style.accentColor = 'yellow'
    })

    newTaskButton.addEventListener('click',()=>{
        newTaskForm.style.visibility = 'visible'
        newTaskForm.style.transform = 'scale(1)'
        content.style.filter = 'blur(8px)'
    })


    //closing edit-task-from
    const editFormCloseButton = document.querySelector('#edit-close-button')
    const saveEditButton = document.querySelector('#edit-button')
    const editTaskForm = document.querySelector('.edit-task-form')
    const editTaskName = document.querySelector('#edit-task-name')
    const editTaskDesc = document.querySelector('#edit-task-desc')
    const editTaskDue = document.querySelector('#edit-date')
    const editTaskPriority = document.querySelector('#edit-priority')
    editTaskPriority.addEventListener('input',()=>{
        changeColor(editTaskPriority,editTaskPriority.value)
    })

    editFormCloseButton.addEventListener('click',()=>{
        editTaskForm.style.visibility = 'hidden'
        editTaskForm.style.transform = 'scale(0.2)'
        content.style.filter = 'none'
        editTaskDesc.value = ""
        editTaskName.value = ""
        editTaskDue.value = null
        editTaskPriority.value = '1'
        editTaskPriority.style.accentColor = 'yellow'
    })


    //saving edits to task
    saveEditButton.addEventListener('click',()=>{
        if(!taskHandler.isDuplicate(editTaskName.value))
        {
            if(editTaskName.value.trim().length!=0&&editTaskDesc.value.trim().length!=0&&
                editTaskDue.value.trim().length!=0&&editTaskPriority.value.trim().length!=0)
            {
                let modifiedTask = taskHandler.taskConstructor(editTaskName.value,editTaskDesc.value,
                    editTaskDue.value,editTaskPriority.value)
                taskHandler.updateTask(modifiedTask,currentTask,currentProject)
                addTasksToList()
                editTaskForm.style.visibility = 'hidden'
                editTaskForm.style.transform = 'scale(0.2)'
                content.style.filter = 'none'
                editTaskDesc.value = ""
                editTaskName.value = ""
                editTaskDue.value = null
                editTaskPriority.value = '1'
                editTaskPriority.style.accentColor = 'yellow'
            }
            else{
                alert('fields can\'t be empty')
            }
        }
        else{
            alert('task name must be unique')
        }
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
                    if(currentProject!="")
                    {
                        document.querySelector(`[data-title=${currentProject}]`).style.backgroundColor = 'initial'
                    }
                    elt.style.backgroundColor = 'rgba(255, 255, 255, .1)'
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
    const taskList = document.querySelector('.list')
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
            taskList.replaceChildren(...items)
        
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
                if(currentProject!="")
                    document.querySelector(`[data-title=${currentProject}]`).style.backgroundColor = 'initial'
                elt.style.backgroundColor = 'rgba(255, 255, 255, .1)'
                taskList.replaceChildren()
                currentProject = elt.getAttribute('data-title')
                addTasksToList()
                deleteProjectButton.style.display = 'none'
                newTaskButton.style.display = 'flex'
            })
        }
        else{
            elt.addEventListener('click',()=>{
                elt.style.backgroundColor = 'rgba(255, 255, 255, .1)'
                if(currentProject!="")
                    document.querySelector(`[data-title=${currentProject}]`).style.backgroundColor = 'initial'
                taskList.replaceChildren()
                currentProject = elt.getAttribute('data-title')
                deleteProjectButton.style.display = 'none'
                newTaskButton.style.display = 'none'
            })
        }
     }
    )

    //on page loading inbox must be automatically selected
    window.addEventListener('load',()=>{
        inbox.click()   
    })

    //deleting projects
    const deleteProjectButton = document.querySelector('#delete-project-btn')
    deleteProjectButton.addEventListener('click',()=>{       
        if(currentProject!=="")
            {
            sidebar.removeChild(document.querySelector(`[data-title=${currentProject}]`))
            taskList.replaceChildren()
            projectHandler.deleteProject(currentProject)
            currentProject = ""
            newTaskButton.style.display = 'none'
            deleteProjectButton.style.display = 'none'
            }
    })


    let currentTask;
    //function to create a task DOM element

    function constructTaskElement(nameArg,descArg,dueDateArg,priorityArg){

        let task = document.createElement('div')
        task.classList.add('item')
        task.setAttribute('data-title',nameArg)
        let name = document.createElement('div')
        name.textContent = nameArg
        name.setAttribute('id','task-DOM-name')
        let flag = document.createElement('img')
        flag.setAttribute('id','flag')
        flag.src = flagIcon

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

        //to view edit-task-form
        pencil.addEventListener('click',()=>{
            editTaskForm.style.visibility = 'visible'
            editTaskName.value = nameArg
            editTaskDesc.value = descArg
            editTaskDue.value = dueDateArg
            editTaskPriority.value = priorityArg

            currentTask = nameArg

            if(editTaskPriority.value=='0')
            editTaskPriority.style.accentColor = 'green'
            else if(editTaskPriority.value=='1')
            editTaskPriority.style.accentColor = 'yellow'
            else if(editTaskPriority.value=='2')
            editTaskPriority.style.accentColor = 'red'

            editTaskForm.style.transform = 'scale(1)'
            content.style.filter = 'blur(8px)'
        })

        let trash = document.createElement('img')
        trash.setAttribute('id','trash')
        trash.src = trashIcon

        //deleting task
        trash.addEventListener('click',()=>{
            taskList.removeChild(task)
            taskHandler.cleanUp(currentProject,nameArg)      
        })


        options.append(eye,pencil,trash)
        task.append(name,flag,dueDate,options)

        return task;

    }
    

    //saving task
    const saveTaskButton = document.querySelector('#save-button')

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

