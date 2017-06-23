/* ============
client.js
Front End code
============ */
// Modules
const server = io('http://localhost:3003/');

let temporary = false; // I'm using this to determine if I injected a temp todo list during a connection error

// If you could not connect then
server.on('connect_error', error =>{
  if(!temporary){
    // On load if the person has a ToDo list in local storage immediately make it available to them
    // NOTE: Yes this is kind of a ghetto solution but within the 6 hour time limit this is a viable solution for a demo
    let localTodos = JSON.parse(localStorage.getItem('todos'))
    if(localTodos.length){
      table.innerHTML = ''; // Clear the old list

      for(let [i, todo] of localTodos.entries()){
        render(i, todo)
      }
    }
    temporary = true;
  };
});

// Vars
const table = document.getElementById('todo-table'); // The List
const form = document.getElementById('todo-form'); // The Form



// This function adds a new todo from the input
form.addEventListener('submit', e => {
  e.preventDefault(); // I wanted to add submitting via Enter, which triggers a page refresh. So I added this event handler to prevent that from happening
  const input = document.getElementById('todo-input'); // Our input

  // Prevent empty submissions
  // TODO: Some kind of notificaiton that it is required
  if(input.value){
    // Emit the new todo as some data to the server
    // NOTE: the é was super sneaky
    server.emit('make', input.value);

    input.value = ''; // Clear the input
    input.focus(); // Refocus
  }
});

// Completes an item
function complete(i){
  server.emit('complete', i);
}

// Deletes all items
function completeAll(){
  server.emit('complete', 'all');
}

// Deletes selected item
function del(i){
  server.emit('del', i);
}

// Deletes all items
function delAll(){
  server.emit('del', 'all');
}

// Renders a new list
function render(i, todo) {
  const row = document.createElement('tr'); // Create row
  if(todo.status === 'complete'){
    row.className = 'complete';
  }

  row.insertCell(0).innerHTML = '<i class="fa fa-check-circle" aria-hidden="true" onclick="complete(' + i + ')"></i>';
  row.insertCell(1).innerHTML = todo.title;
  row.insertCell(2).innerHTML = todo.user;
  row.insertCell(3).innerHTML = '<i class="fa fa-trash" aria-hidden="true" onclick="del(' + i + ')"></i>';
  table.appendChild(row);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', todos => {
  // NOTE: I realize that destroying and updating the entire list is not as efficient as just updating each individual item
  // The performance impact is extremely small when the lists are this tiny so for a first pass this is acceptable
  // If I was developing this further I would use React, since the virtual dom and how they handle updates solves this exact problem
  table.innerHTML = ''; // Clear the old list

  for(let [i, todo] of todos.entries()){
    render(i, todo)
  }

  // After rendering, store it in local storage so that it works offline
  localStorage.setItem('todos', JSON.stringify(todos));
});
