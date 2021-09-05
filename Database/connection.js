const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : 'senhaFake',
      database : 'aula'
    }
  });


  module.exports = knex
  