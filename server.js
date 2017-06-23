/* ============
client.js
Back end code
============ */
// Third party libraries
const Q = require('q'); // Promises
const server = require('socket.io')(); // Real time communication

// Modules
const database = require('./database'); // Database configuration

server.on('connection', client => {
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

  // Updates the DB
  const updateTodos = todos => {
    let deferred = Q.defer();

    database.put('todo', todos, err => {
      if(err){
        deferred.reject(new Error(err));
      }

      deferred.resolve(true);
    });

    return deferred.promise;
  }

  // Accepts when a client makes a new todo
  client.on('make', value => {
    getTodos().then(todos => {
      todos.push({
        title: value,
        user: client.request.connection.remoteAddress,
        status: 'active'
      });

      updateTodos(todos).then(response => {
        reloadTodos(todos);
      });
    });
  });

  // Complete entry
  client.on('complete', i => {
    getTodos().then(todos => {
      // If all was selected then
      if(i === 'all'){
        for(let todo of todos){
          todo.status = 'complete'
        }
      }
      else{
        // NOTE: I considered using a true false for completed BUT this can scale to different states (ie: Pending, In Progress, deleted, etc)
        todos[i].status = todos[i].status === 'active' ? 'complete' : 'active';
      }


      updateTodos(todos).then(response => {
        reloadTodos(todos);
      });
    });
  });

  // Deletes entry
  client.on('del', i => {
    getTodos().then(todos => {
      // If all was selected then clear the array
      if(i === 'all'){
        todos = [];
      }
      else{
        todos.splice(i, 1);
      }

      updateTodos(todos).then(response => {
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
