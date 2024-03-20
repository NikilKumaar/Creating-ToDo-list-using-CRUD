let jsonData = []

const getAllTodos = async() =>
{
    const url = "http://localhost:3000/todos";
    const response = await fetch(url)
    jsonData = await response.json()
    console.log(jsonData)
    displayData()
}

window.onload = () =>
{
    getAllTodos()
}

const displayData = () =>
{
    const todosDiv = document.getElementById("todos")
    todosDiv.innerHTML = ""
    jsonData.forEach(todo =>
    {
        todosDiv.innerHTML += `
        <div class="todo ${todo.status}">
        <h3>${todo.user}</h3>
        <p>${todo.task}</p>
        <button onclick="changeStatus('${todo.id}','${todo.status}')">${todo.status}</button>
        <button  id="delete" onclick="deleteTodo('${todo.id}')">DELETE</button>
        </div>`
        })
}

const changeStatus = async(id,status) =>
{
    console.log(id, status)
    const statusToChange = {
        "pending": "Ongoing",
        "Ongoing": "completed",
        "completed":"pending"
    }
    console.log(statusToChange[status])
    const url = "http://localhost:3000/todos"
    const response = await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify({
            status: statusToChange[status]
        })

    });
    const data = await response.json();
    jsonData = jsonData.map(todo =>
    {
        if (todo.id === data.id)
        {
            return data
        }
        else
        {
            return todo
        }
    })
    displayData()


}

const form = document.getElementById("todoform")
form.addEventListener("submit", async(e) =>
{
    e.preventDefault()
    const task = document.getElementById("task").value
    const user = document.getElementById("user").value
    const deadline = document.getElementById("deadline").value
    const status = "pending"
    const todo = {
        user,task,deadline,status
    }
    //console.log(todo)
    const url = "http://localhost:3000/todos";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "content-Type" : "application/json"
        },
        body: JSON.stringify(todo)
    })
    const data = response.json()
    jsonData.push(data)
    displayData()
})


document.querySelectorAll("input").forEach(element =>
    element.addEventListener("blur", (event) =>
    {
        event.target.value = event.target.value.trim()
    }))


// deleting a todo

const deleteTodo = async (id) =>
{
    const url = "http://localhost:3000/todos";
    const response = await fetch(`${url}/${id}`, {
        method: "DELETE"
    })
    const data = await response.json()
    jsonData = jsonData.filter(todo => todo.id !== data.id)
    displayData()
}