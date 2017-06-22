/* ============
client.js
Front End code
============ */
// Modules
const server = io('http://localhost:3003/');

// Vars
const table = document.getElementById('todo-table'); // The List

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
  const input = document.getElementById('todo-input'); // Our input

  // KRUKAR: Prevent empty submissions
  // TODO KRUKAR: Some kind of notificaiton that it is required
  if(input.value){
    // Emit the new todo as some data to the server
    // KRUKAR: the é was super sneaky
    server.emit('make', input.value);

    input.value = ''; // Clear the input
    input.focus(); // KRUKAR: Refocuses
  }
}

// Deletes selected item
function del(i){
  server.emit('del', i);
}

// Completes an item
function complete(i){
  server.emit('complete', i);
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
  // KRUKAR: I realize that destroying and updating the entire list is not as efficient as just updating each individual item
  // The performance impact is extremely small when the lists are this tiny so for a first pass this is acceptable
  // If I was developing this further I would use React, since the virtual dom and how they handle updates solves this exact problem
  table.innerHTML = ''; // Clear the old list

  for(let [i, todo] of todos.entries()){
    render(i, todo)
  }
});
