const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : 'fakepassword',
      database : 'aula'
    }
  });


  module.exports = knex
  