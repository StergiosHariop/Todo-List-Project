import { project,task} from "./objectConstructors";

export const toDoApp = () => {

    /* Selectors */

    const container = document.querySelector('[data-list]');
    const newContainerForm = document.querySelector('[data-new-container-form]');
    const newContainerInput = document.querySelector('[data-new-container-input]');
    const deleteButton = document.querySelector('[data-delete-button]');
    const clearButton = document.querySelector('[data-clear]');
    const tasksContainer = document.querySelector('[data-tasks]');
    const newTaskForm = document.querySelector('[data-new-task-form]');
    const newTaskInput = document.querySelector('[data-new-task-input]');
    const LOCAL_STORAGE_KEY = 'task.projects';
    const LOCAL_STORAGE_PROJECT_ID_KEY = 'task.projectsSelectedId';

    /* Array and Local Storage variables */

    let projectList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_PROJECT_ID_KEY);

    /* Event Listeners */

    container.addEventListener('click', event => {
        if(event.target.tagName.toLowerCase() === 'li'){
            selectedProjectId = event.target.dataset.projectId;
            saveAndRender();
        }
    });
    clearButton.addEventListener('click', () => {
        clear();
        saveAndRender();
    });
    newContainerForm.addEventListener('submit', event => {

        event.preventDefault();
        const projectName = newContainerInput.value;

        if(projectName === null || projectName === '') { 
            newContainerInput.style.border = '1px solid red';
            return;
        }
        else{
            newContainerInput.style.border = '1px solid black';
            const newProject = new project(projectName);

            newContainerInput.value = null;

            projectList.push(newProject);

            saveAndRender();
        }
    });
    deleteButton.addEventListener('click', () => {
        projectList = projectList.filter(project => project.id !== selectedProjectId);
        selectedProjectId = null;
        saveAndRender();
        
    });
    newTaskForm.addEventListener('submit', event => {

        event.preventDefault();
        
        const taskName = newTaskInput.value;

        if( taskName === '' || taskName === null){
            newTaskInput.style.border = '1px solid red';
            return; 
        }
        else{
            newTaskInput.style.border = '1px solid black';
            const newTask = new task(taskName);
            newTaskInput.value = null;
            const selectedProject = projectList.find(project => project.id === selectedProjectId);
        
            if(taskName !== '' && selectedProject === undefined)return;
            
            selectedProject.tasks.push(newTask);
            saveAndRender();
        }
    });

    /* Functions */

    function saveAndRender(){

        save();
        render();
    }

    function save(){

        localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(projectList));
        localStorage.setItem(LOCAL_STORAGE_PROJECT_ID_KEY, selectedProjectId);
    }

    /* Rendering everything in DOM */

    function render(){

        clearElement(container);
        renderList(); 

        const selectedProject = projectList.find(project => project.id === selectedProjectId);
        
        clearElement(tasksContainer);
        renderTasks(selectedProject);   
    }

    /* Rendering tasks in the DOM */

    function renderTasks(selectedProject){

        if(selectedProject === undefined) return;
        selectedProject.tasks.forEach( task => {

            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');

            const taskLabel = document.createElement('label');
            taskLabel.classList.add('task-label');
            taskLabel.htmlFor = task.id;
            taskLabel.append(task.name);

            const taskCheck = document.createElement('input');
            taskCheck.setAttribute('type','checkbox');
            taskCheck.id = task.id;
            taskCheck.checked = task.complete;

            const taskRemove = document.createElement('button');
            taskRemove.classList.add('btn-task-remove');
            taskRemove.innerText = 'x';

            taskRemove.addEventListener('click', () => {
                
                selectedProject.tasks.splice(selectedProject.tasks.indexOf(task),1);
                saveAndRender();
            });
            taskDiv.addEventListener('change', () => {
                task.complete = !task.complete;
                if(task.complete === true) alert(task.name + ' done!');
                saveAndRender();
            });
            tasksContainer.appendChild(taskDiv);
            taskDiv.appendChild(taskCheck);
            taskDiv.appendChild(taskLabel);
            taskDiv.appendChild(taskRemove);
        });
    }

    /* Rendering projects in the DOM */

    function renderList(){
        projectList.forEach( project => {

            const projectElement = document.createElement('li');

            projectElement.dataset.projectId = project.id;

            projectElement.classList.add('list-name');

            projectElement.innerHTML = project.name;


            if(project.id === selectedProjectId){
                projectElement.classList.add('active-project');
            }
            container.appendChild(projectElement);
        });
    }

    /* Clear functions for DOM and Local Storage */

    function clearElement(element){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
    }
      
    function clear(){
        localStorage.clear();
        projectList = [];
    }

    render();
};

