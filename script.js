let tasksData = {}

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
let draggedTask = null;
const columns = [todo, progress, done];

function addTask(title, desc, column){
    const div = document.createElement('div');

    div.classList.add('task');
    div.setAttribute('draggable', 'true');

    div.innerHTML = `<h2>${title}</h2>
    <p>${desc}</p>
    <button>Delete</button>
    `

    column.appendChild(div);

    div.addEventListener('drag', (e) => {
        draggedTask = div;
    });

    const deleteButton = div.querySelector('button');

    deleteButton.addEventListener('click', () => {
        div.remove();
        updateTaskCount();
    });



    return div;
}

function updateTaskCount(){
    columns.forEach(col =>{
            const tasks = col.querySelectorAll('.task');
            const count = col.querySelector('.right');

            tasksData[col.id] = Array.from(tasks).map(t =>{
                return {
                    title: t.querySelector('h2').innerText,
                    desc: t.querySelector('p').innerText
                }
            });

            localStorage.setItem('tasksData', JSON.stringify(tasksData));

            count.innerText = tasks.length;
        });
}

if(localStorage.getItem('tasksData')){
     const data = JSON.parse(localStorage.getItem('tasksData'));

     for(const col in data){
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task =>{
            addTask(task.title, task.desc, column);
        });

     }

     updateTaskCount();
}

const tasks = document.querySelectorAll('.task');

tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
        draggedTask = task;

    });
});


function addEventOnColumns(column) {
    column.addEventListener('dragenter', (e) => {
        e.preventDefault();
        column.classList.add('hover-over');
    });

    column.addEventListener('dragover', (e) => {
        e.preventDefault();

    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.appendChild(draggedTask);
        column.classList.remove('hover-over');


        columns.forEach(col =>{
            const tasks = col.querySelectorAll('.task');
            const count = col.querySelector('.right');

            count.innerText = tasks.length;
        });

        
        updateTaskCount();


    });

    column.addEventListener('dragleave', (e) => {
        e.preventDefault();
        column.classList.remove('hover-over');
    });

}

addEventOnColumns(todo);
addEventOnColumns(progress);
addEventOnColumns(done);

const toggleModalButton = document.querySelector('#toggle-modal');
const modal = document.querySelector('.modal');
const modalBg = document.querySelector('.modal .bg');
const addTaskButton = document.querySelector('#add-new-task');

toggleModalButton.addEventListener('click', () => {
    modal.classList.toggle('active');
});

modalBg.addEventListener('click', () => {
    modal.classList.remove('active');
});

addTaskButton.addEventListener('click', () => {
    const taskTitle = document.querySelector('#task-title-input').value;
    const taskDesc = document.querySelector('#task-desc-input').value;

   addTask(taskTitle, taskDesc, todo);
    updateTaskCount();
   modal.classList.remove('active');


   document.querySelector('#task-title-input').value = '';
   document.querySelector('#task-desc-input').value = '';
});