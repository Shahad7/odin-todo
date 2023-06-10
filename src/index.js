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

const taskConstructor = (title,description,dueDate,priority) => {
    return {title,description,dueDate,priority}

}

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

                // event listener for non-default projects
                elt.addEventListener('click',()=>{
                    currentProject = elt.getAttribute('data-title')
                    deleteProjectButton.style.display = 'flex'
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

    //viewing projects
    let currentProject = "";
    const inbox = document.querySelector("[data-title='inbox']");
    const today = document.querySelector("[data-title='today']");
    const week = document.querySelector("[data-title='week']");

    [inbox,today,week].forEach(elt=>{

        elt.addEventListener('click',()=>{
            currentProject = elt.getAttribute('data-title')
            deleteProjectButton.style.display = 'none'
        })
     }
    )

    //deleting projects
    const deleteProjectButton = document.querySelector('#delete-project-btn')
    deleteProjectButton.addEventListener('click',()=>{       
        if(currentProject!=="")
            {
            sidebar.removeChild(document.querySelector(`[data-title=${currentProject}]`))
            projectHandler.deleteProject(currentProject)
            currentProject = ""
            }
    })
    
    //saving task

    

})();

