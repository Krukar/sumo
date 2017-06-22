const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
  const input = document.getElementById('todo-input');

  // KRUKAR: Preventy empty submissions
  // TODO KRUKAR: Some kind of notificaiton that it is required
  if(input.value){
    // Emit the new todo as some data to the server
    // KRUKAR: the é was super sneaky
    server.emit('make', input.value);

    // Clear the input
    input.value = '';
    // TODO: refocus the element
    // KRUKAR: refocuses
    input.focus();
  }

}

function render(todo) {
  const listItem = document.createElement('li');
  const listItemText = document.createTextNode(todo.title);
  listItem.appendChild(listItemText);
  list.append(listItem);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', todos => {
  todos.forEach((todo) => render(todo));
});
