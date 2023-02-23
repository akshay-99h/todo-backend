
const express = require('express');
const fs = require('fs');
const { request } = require('http');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    return response.send('Hello World!');
})

app.get('/todos', (request, response) => {
    const showPending = request.query.showPending;

    fs.readFile('./store/todos.json', 'utf-8', (err, data) => {
        if (err) {
            return response.status(500).send('Server Error, Something went wrong!');
        }
        let todos = JSON.parse(data);
        if(showPending!=="1")
            return response.json({ todos: todos });
        else {
            return response.json({ todos: todos.filter(t => { return t.complete === false }) });
        }
    });
})

app.put('/todos/:id/complete', (request, response) => {
    const id = request.params.id;

    const findTodoById=(todos, id)=>{
        for (let i = 0; i < todos.length; i++){
            if (todos[i].id === parseInt(id)) {
                return i;
            }
        }
        return -1;
    }
    fs.readFile('./store/todos.json', 'utf-8', (err, data) => {

        if (err) {
            return response.status(500).send('Server Error, Something went wrong!');
        }
        const todos = JSON.parse(data);
        const todoIndex = findTodoById(todos, id);
        if (todoIndex===-1) {
            return response.status(404).send('Todo not found!');
        }
        
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

app.post('/todo', (request, response) => {
    if (!request.body.name) {
        return response.status(400).send('Name is required!');
    }
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
        todos.push(todo);
        fs.writeFile('./store/todos.json', JSON.stringify(todos), (err) => {
            if (err) {
                return response.status(500).send('Server Error, Something went wrong!');
            }
            return response.json({ "status": "ok" });
        })
    })
})

app.listen(3000, () => { 
    console.log('Server is running on port 3000, i.e. http://localhost:3000/todos');
})