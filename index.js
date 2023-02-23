//
// This is the main file of the application. It is responsible for starting the server and
// handling the requests.
//
// You should not need to modify this file.
//
// You can run this file using the command `node index.js` from the root of the project.
// You can also run this file using the command `npm start` from the root of the project.
//
// You can run the tests for this file using the command `npm test` from the root of the project.

// Here in the code, the author has generated a lot of extra documentation for better understanding.


/* Importing the express and fs modules. */
const express = require('express');
const fs = require('fs');
const { request } = require('http');


/* Creating an instance of the express application. */
const app = express();


/* A middleware that parses the body of the request. */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* This is a route handler. It is a function that is called when a request is made to the server. */
app.get('/', (request, response) => {
    return response.send('Hey totally random person! Go to /todos to check the todolist and to /todo to update it.');
})

app.get('/todos', (request, response) => {
    const showPending = request.query.showPending;

    fs.readFile('./store/todos.json', 'utf-8', (err, data) => {
        /* Checking if there is an error. If there is, it will return a 500 status code and a message. */
        if (err) {
            return response.status(500).send('Server Error, Something went wrong!');
        }
        let todos = JSON.parse(data);

        // Checking if the query parameter showPending is set to 1. If it is, it will return only the
        // todos that are not complete.
        if(showPending!=="1")
            return response.json({ todos: todos });
        else {
            return response.json({ todos: todos.filter(t => { return t.complete === false }) });
        }
    });
})

/* A route handler. It is a function that is called when a request is made to the server. */
app.put('/todos/:id/complete', (request, response) => {
    const id = request.params.id;

    /**
     * It takes in an array of todos and an id, and returns the index of the todo with the matching id
     * @param todos - the array of todos
     * @param id - The id of the todo we want to find
     * @returns The index of the todo item in the array.
     */
    const findTodoById=(todos, id)=>{
        for (let i = 0; i < todos.length; i++){
            if (todos[i].id === parseInt(id)) {
                return i;
            }
        }
        return -1;
    }
    /* Reading the file todos.json and then parsing it into a JSON object. */
    fs.readFile('./store/todos.json', 'utf-8', (err, data) => {

        if (err) {
            return response.status(500).send('Server Error, Something went wrong!');
        }
        const todos = JSON.parse(data);
        const todoIndex = findTodoById(todos, id);
        if (todoIndex===-1) {
            return response.status(404).send('Todo not found!');
        }
        
        /* Changing the complete status of the todo item to true and then writing the updated todos
        array to the file. */
        todos[todoIndex].complete = true;
        fs.writeFile('./store/todos.json', JSON.stringify(todos), (err) => {
            if (err) {
                return response.status(500).send('Server Error, Something went wrong!');
            }
            return response.json({ "status": "ok" });
        }
        )
    })
}) 

/* A route handler. It is a function that is called when a request is made to the server. */
app.post('/todo', (request, response) => {
    /* Checking if the request body has a name property. If it doesn't, it will return a 400 status
    code and a message. */
    if (!request.body.name) {
        return response.status(400).send('Name is required!');
    }
    /* Reading the file todos.json and then parsing it into a JSON object. */
    fs.readFile('./store/todos.json', 'utf-8', (err, data) => {
        if (err) {
            return response.status(500).send('Server Error, Something went wrong!');
        }
        const todos = JSON.parse(data);
        const todo = {
            id: todos.length + 1,
            name: request.body.name,
            complete: false
        }
        /* Pushing the new todo item into the todos array and then writing the updated array to the
        file. */
        todos.push(todo);
        fs.writeFile('./store/todos.json', JSON.stringify(todos), (err) => {
            if (err) {
                return response.status(500).send('Server Error, Something went wrong!');
            }
            return response.json({ "status": "ok" });
        })
    })
})

/* Starting the server on port 3000. */
app.listen(3000, () => { 
    console.log('Server is running on port 3000, i.e. http://localhost:3000/todos');
})