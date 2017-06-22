const levelup = require('levelup')

let options = {
  keyEncoding: 'json',
  valueEncoding: 'json'
}

const database = levelup('./database', options)

// init db
database.get('todo', function(err, value){
  if(err){
    let todo = [
        {
            "title" : "My First Todo Item",
            "user"  : "Example",
            "status": "active"
        },
    ]

    database.put('todo', todo, function(err){
      console.log('New database init')
    });
  }
});

module.exports = database
