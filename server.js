/* ============
client.js
Back end code
============ */
// Third party libraries
const Q = require('q'); // Promises
const server = require('socket.io')(); // Real time communication

// Modules
const database = require('./database'); // Database configuration

server.on('connection', (client) => {
  // Sends a message to the client to reload all todos
  const reloadTodos = todos => {
    server.emit('load', todos);
  }

  // Returns the list from the database
  const getTodos = () => {
    let deferred = Q.defer();

    database.get('todo', (err, todos) => {
      if(err){
        deferred.reject(new Error(err));
      }

      deferred.resolve(todos);
    });

    return deferred.promise;
  }

  // Accepts when a client makes a new todo
  client.on('make', value => {
    // Get the current list
    getTodos().then(todos => {
      todos.push({title: value})

      database.put('todo', todos, err => {
        reloadTodos(todos);
      });
    });
  });

  // On server connect load the list
  getTodos().then(todos => {
    reloadTodos(todos);
  });
});

console.log('Waiting for clients to connect');
server.listen(3003);
