const baseUrl = 'http://localhost:3000'
let updateId = ''
let projectId = ''

$(document).ready(function () {
    $(function(){
        let date = new Date()

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        if(month < 10) {
            month = '0' + month.toString();
        }
        if(day < 10) {
            day = '0' + day.toString();
        }

        let minDate = `${year}-${month}-${day}`
        $('#todoDate, #update-todo-date').attr('min', minDate)
    });
    if (!localStorage.getItem('token')) {
        $("#todo-list").hide()
        $('#project-list').hide()
        $('#project-details').hide()
        getLoginForm()
    } else {
        getContent()
        getInfo()
    }

})

function getRegisForm() {
    $("#loginForm").hide()
    $("#regisForm").show()
}

function getLoginForm() {
    $("#regisForm").hide()
    $('#btn-logout').hide()
    $("#todo-list").hide()
    $('#project-list').hide()
    $('#project-details').hide()
    $('#btn-regis').show()
    $('#btn-login').show()
    $("#loginForm").show()
    $('#navContent').empty()
    $('#user').empty()

    localStorage.clear()
}

function getContent() {
    $("#regisForm").hide()
    $("#loginForm").hide()
    $('#btn-regis').hide()
    $('#btn-login').hide()
    $('#addTodoForm').hide()

    let navContent =
        `
    <li class="nav-item active">
        <a onclick="getProject()" class="nav-link text-white" href="#">My Project</a>
    </li>
    <li class="nav-item active">
        <a onclick="getTodo()" class="nav-link text-white" href="#">My Todo</a>
    </li>
    `
    $('#navContent').empty()
    $('#navContent').append(navContent)
    getInfo()
    getTodo()
}

function getProject() {
    $('#todo-list').hide()
    $('#project-details').hide()
    $('#project-list').show()
    $.ajax({
        method: 'GET',
        url: `${baseUrl}/projects`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(data => {
            let projects = ''
            let index = 1
            data.forEach(e => {
                projects += `
                <tr>
                <td class="text-center">${index++}</td>
                <td class="text-center">${e.name}</td>
                <td class="text-center">
                <a href="#" onclick="getDetailsProject('${e._id}')">Details</a> | <a href="#" onclick="getProjectUpdate('${e._id}')">Update</a> | <a href="#" onclick="toDeleteProject('${e._id}')">Delete</a>
                </td>
                </tr>`
            });
            
            $('#allProject').empty()
            $('#allProject').append(projects)
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function getTodo() {
    projectId = ''

    $('#project-list').hide()
    $('#project-details').hide()
    $('#todo-list').show()

    $.ajax({
        method: 'GET',
        url: `${baseUrl}/todos/${localStorage.getItem('id')}`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(data => {
            let todos = ''
            let index = 1
            if(data) {
                data.forEach(e => {
                    if(e.status === 'done') {
                        todos += `
                        <tr>
                        <td class="text-center">${index++}</td>
                        <td>${e.name}</td>
                        <td>${e.description}</td>
                        <td class="text-center">${e.status}</td>
                        <td class="text-center">${e.due_date.slice(0,10)}</td>
                        <td class="text-center">
                        <a href="#" onclick="undoneStatus('${e._id}')">Undone</a>
                        </td>
                        </tr>`
                    } else {
                        todos += `
                        <tr>
                        <td class="text-center">${index++}</td>
                        <td>${e.name}</td>
                        <td>${e.description}</td>
                        <td class="text-center">${e.status}</td>
                        <td class="text-center">${e.due_date.slice(0,10)}</td>
                        <td class="text-center">
                        <a href="#" onclick="getInfoUpdate('${e._id}')">Update</a> | <a href="#" onclick="toDeleteTodo('${e._id}')">Delete</a> | <a href="#" onclick="updateStatus('${e._id}')">Done</a>
                        </td>
                        </tr>`
                    }
                });
            }
            
            $('#allTodo').empty()
            $('#allTodo').append(todos)
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function getInfo() {
    let html = `<div class="navbar-brand text-white" style="font-size: 1rem;">${localStorage.getItem('name')}</div>
                <a href="#" onclick="getLoginForm();" class="m-2 text-danger"><i class="fas fa-power-off" style="color: white;"></i></a>`

    $('#user').empty()
    $('#user').append(html)
}

function getInfoUpdate(id) {
    $.ajax({
        method: 'GET',
        url: `${baseUrl}/todos/${localStorage.getItem('id')}/${id}`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(data => {
            updateId = data._id
            $('#update-todo-title').val(data.name)
            $('#update-todo-description').val(data.description)
            $('#update-todo-date').val(data.due_date.slice(0, 10))
            
            $('#updateTodoModal').modal('toggle')
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function getProjectUpdate(id) {
    $.ajax({
        method: 'GET',
        url: `${baseUrl}/projects/${id}`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(data => {
            projectId = data._id
            $('#update-project-title').val(data.name)
            
            $('#updateProjectModal').modal('toggle')
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function toRegis() {
    event.preventDefault()
    $.ajax({
        method: 'POST',
        url: `${baseUrl}/register`,
        data: {
            name: $("#regisFullname").val(),
            email: $("#regisEmail").val(),
            password: $("#regisPassword").val()
        }
    })
        .done(() => {
            $('#regisFullname').val('')
            $('#regisEmail').val('')
            $('#regisPassword').val('')

            Swal.fire({
                type: 'success',
                title: 'Successfully registered',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function toLogin() {
    event.preventDefault()
    $.ajax({
        method: 'POST',
        url: `${baseUrl}/login`,
        data: {
            email: $("#loginEmail").val(),
            password: $("#loginPassword").val()
        }
    })
        .done(user => {
            localStorage.setItem('token', user.token)
            localStorage.setItem('id', user.id)
            localStorage.setItem('name', user.name)
            localStorage.setItem('email', user.email)
            $('#loginEmail').val('')
            $('#loginPassword').val('')

            getInfo()
            getContent()
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function toAddProject() {
    event.preventDefault()
    $.ajax({
        method: 'POST',
        url: `${baseUrl}/projects`,
        data: {
            name: $("#projectTitle").val(),
            createdBy: localStorage.getItem('id'),
            members: localStorage.getItem('id')
        },
        headers: { token: localStorage.getItem('token') }
    })
        .done(user => {
            $("#projectTitle").val('')

            Swal.fire({
                type: 'success',
                title: 'Project has been added',
                showConfirmButton: false,
                timer: 1500
            })

            $('#addProjectModal').modal('toggle')
            getProject()
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function toUpdateProject() {
    event.preventDefault()
    $.ajax({
        method: 'PUT',
        url: `${baseUrl}/projects/${projectId}`,
        data: {
            name: $("#update-project-title").val()
        },
        headers: { token: localStorage.getItem('token') }
    })
        .done(user => {
            $("#update-todo-title").val('')

            Swal.fire({
                type: 'success',
                title: 'Project has been updated',
                showConfirmButton: false,
                timer: 1500
            })

            $('#updateProjectModal').modal('toggle')
            getProject()
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function toDeleteProject(id) {
    event.preventDefault()
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                method: 'DELETE',
                url: `${baseUrl}/projects/${id}`,
                headers: { token: localStorage.getItem('token') }
            })
                .done(() => {
                    Swal.fire({
                        type: 'success',
                        title: 'Todo has been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
        
                    getProject()
                })
                .fail((err, textStatus) => {
                    Swal.fire({
                        title: err.responseJSON.message,
                        animation: false,
                        customClass: {
                            popup: 'animated swing'
                        }
                    })
                })
        }
      })
}

function toAddMember() {
    event.preventDefault()
    $.ajax({
        method: 'GET',
        url: `${baseUrl}/users/${localStorage.getItem('id')}/${$("#memberEmail").val()}`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(user => {
            $("#memberEmail").val('')

            if(user) {
                $.ajax({
                    method: 'PATCH',
                    url: `${baseUrl}/projects/add-member/${projectId}`,
                    data: {
                        id: user._id
                    },
                    headers: { token: localStorage.getItem('token') }
                })
                .done(user => {
                    Swal.fire({
                        type: 'success',
                        title: 'Member has been added',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    $('#addMemberModal').modal('toggle')
                    getDetailsProject()
                })
                .fail((err, textStatus) => {
                    Swal.fire({
                        title: err.responseJSON.message,
                        animation: false,
                        customClass: {
                            popup: 'animated swing'
                        }
                    })
                })
            }
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function toDeleteMember(userId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                method: 'PATCH',
                url: `${baseUrl}/projects/delete-member/${projectId}`,
                data: {
                    id: userId
                },
                headers: { token: localStorage.getItem('token') }
            })
            .done(user => {
                Swal.fire({
                    type: 'success',
                    title: 'Member has been deleted',
                    showConfirmButton: false,
                    timer: 1500
                })
                
                getDetailsProject()
            })
            .fail((err, textStatus) => {
                Swal.fire({
                    title: err.responseJSON.message,
                    animation: false,
                    customClass: {
                        popup: 'animated swing'
                    }
                })
            })
        }
      })
}

function getDetailsProject(id) {
    if(id === undefined) {
        id = projectId
    }
    projectId = id

    getMember()

    $.ajax({
        method: 'GET',
        url: `${baseUrl}/todos/project/${id}`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(data => {
            let details = ''
            let index = 1
            if(data) {
                data.forEach(e => {
                    if(e.status === 'done') {
                        details += `
                        <tr>
                        <td class="text-center">${index++}</td>
                        <td>${e.name}</td>
                        <td>${e.description}</td>
                        <td class="text-center">${e.status}</td>
                        <td class="text-center">${e.due_date.slice(0,10)}</td>
                        <td class="text-center">
                        <a href="#" onclick="undoneStatus('${e._id}')">Undone</a>
                        </td>
                        </tr>`
                    } else {
                        details += `
                        <tr>
                        <td class="text-center">${index++}</td>
                        <td>${e.name}</td>
                        <td>${e.description}</td>
                        <td class="text-center">${e.status}</td>
                        <td class="text-center">${e.due_date.slice(0,10)}</td>
                        <td class="text-center">
                        <a href="#" onclick="getInfoUpdate('${e._id}')">Update</a> | <a href="#" onclick="toDeleteTodo('${e._id}')">Delete</a> | <a href="#" onclick="updateStatus('${e._id}')">Done</a>
                        </td>
                        </tr>`
                    }
                })
            }

            $('#allProjectTodo').empty()
            $('#allProjectTodo').append(details)
            $('#project-list').hide()
            $('#todo-list').hide()
            $('#project-details').show()
            
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function getMember() {
    $.ajax({
        method: 'GET',
        url: `${baseUrl}/projects/${projectId}`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(data => {
            let members = ''
            let index = 1
            if(data.members) {
                data.members.forEach(e => {
                    if(data.createdBy === localStorage.getItem('id')) {
                        members += `
                        <tr>
                        <td class="text-center">${index++}</td>
                        <td>${e.name}</td>
                        <td>${e.email}</td>
                        <td class="text-center">
                        <a href="#" onclick="toDeleteMember('${e._id}')">Delete</a>
                        </td>
                        </tr>`
                    } else {
                        members += `
                        <tr>
                        <td class="text-center">${index++}</td>
                        <td>${e.name}</td>
                        <td>${e.email}</td>
                        <td class="text-center">-</td>
                        </tr>`
                    }
                })
            }

            $('#allProjectMember').empty()
            $('#allProjectMember').append(members)
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function toAddTodo() {
    event.preventDefault()
    let newTodo = {}
    if($('#todoDate').val() === '') {
        Swal.fire({
            title: 'Please input date',
            animation: false,
            customClass: {
                popup: 'animated swing'
            }
        })
    } else {
        if(projectId.length !== 0) {
            newTodo = {
                name: $("#todoTitle").val(),
                description: $("#todoDescription").val(),
                status: "undone",
                due_date: $("#todoDate").val(),
                userId: localStorage.getItem('id'),
                projectId: projectId
            }
        } else {
            newTodo = {
                name: $("#todoTitle").val(),
                description: $("#todoDescription").val(),
                status: "undone",
                due_date: $("#todoDate").val(),
                userId: localStorage.getItem('id')
            }
        }
        $.ajax({
            method: 'POST',
            url: `${baseUrl}/todos/${localStorage.getItem('id')}`,
            data: newTodo,
            headers: { token: localStorage.getItem('token') }
        })
            .done(user => {
                $("#todoTitle").val('')
                $("#todoDescription").val('')
                $("#todoDate").val('')
    
                Swal.fire({
                    type: 'success',
                    title: 'Todo has been added',
                    showConfirmButton: false,
                    timer: 1500
                })
    
                $('#addTodoModal').modal('toggle')
                
                if(projectId.length !== 0) {
                    getDetailsProject()
                } else {
                    getTodo()
                }
            })
            .fail((err, textStatus) => {
                Swal.fire({
                    title: err.responseJSON.message,
                    animation: false,
                    customClass: {
                        popup: 'animated swing'
                    }
                })
            })
    }

}

function toUpdateTodo() {
    event.preventDefault()

    if($("#update-todo-date").val() == '') {
        Swal.fire({
            title: 'Please input date',
            animation: false,
            customClass: {
                popup: 'animated swing'
            }
        })
    } else {
        $.ajax({
            method: 'PUT',
            url: `${baseUrl}/todos/${localStorage.getItem('id')}/${updateId}`,
            data: {
                name: $("#update-todo-title").val(),
                description: $("#update-todo-description").val(),
                due_date: $("#update-todo-date").val()
            },
            headers: { token: localStorage.getItem('token') }
        })
            .done(user => {
                $("#update-todo-title").val('')
                $("#update-todo-description").val('')
                $("#update-todo-date").val('')
    
                Swal.fire({
                    type: 'success',
                    title: 'Todo has been updated',
                    showConfirmButton: false,
                    timer: 1500
                })
    
                $('#updateTodoModal').modal('toggle')
                
                if(projectId.length !== 0) {
                    getDetailsProject()
                } else {
                    getTodo()
                }
            })
            .fail((err, textStatus) => {
                Swal.fire({
                    title: err.responseJSON.message,
                    animation: false,
                    customClass: {
                        popup: 'animated swing'
                    }
                })
            })
    }
}

function toDeleteTodo(todoId) {
    event.preventDefault()
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                method: 'DELETE',
                url: `${baseUrl}/todos/${localStorage.getItem('id')}/${todoId}`,
                headers: { token: localStorage.getItem('token') }
            })
                .done(() => {
                    Swal.fire({
                        type: 'success',
                        title: 'Todo has been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    
                    if(projectId.length !== 0) {
                        getDetailsProject()
                    } else {
                        getTodo()
                    }
                })
                .fail((err, textStatus) => {
                    Swal.fire({
                        title: err.responseJSON.message,
                        animation: false,
                        customClass: {
                            popup: 'animated swing'
                        }
                    })
                })
        }
      })
}

function updateStatus(todoId) {
    event.preventDefault()
    $.ajax({
        method: 'PUT',
        url: `${baseUrl}/todos/${localStorage.getItem('id')}/${todoId}`,
        data: {
            status: 'done'
        },
        headers: { token: localStorage.getItem('token') }
    })
        .done(() => {
            if(projectId.length !== 0) {
                getDetailsProject()
            } else {
                getTodo()
            }
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function undoneStatus(todoId) {
    event.preventDefault()
    $.ajax({
        method: 'PUT',
        url: `${baseUrl}/todos/${localStorage.getItem('id')}/${todoId}`,
        data: {
            status: 'undone'
        },
        headers: { token: localStorage.getItem('token') }
    })
        .done(() => {
            if(projectId.length !== 0) {
                getDetailsProject()
            } else {
                getTodo()
            }
        })
        .fail((err, textStatus) => {
            Swal.fire({
                title: err.responseJSON.message,
                animation: false,
                customClass: {
                    popup: 'animated swing'
                }
            })
        })
}

function onSignIn(googleUser) {
    if (!localStorage.getItem('token')) {
        const id_token = googleUser.getAuthResponse().id_token
        $.post(`${baseUrl}/google-login`, {
            token: id_token
        })
            .done(response => {
                localStorage.setItem('token', response.token)
                localStorage.setItem('id', response.id)
                localStorage.setItem('name', response.name)
                localStorage.setItem('email', response.email)

                getContent()
            })
            .fail(err => {
                console.log(err)
            })
    }
    const profile = googleUser.getBasicProfile();

    let html = `<div class="navbar-brand text-white" style="font-size: 1rem;">${profile.getName()}</div>
    <img src="${profile.getImageUrl()}" alt="userImage" style="border-radius: 8px; width: 40px;">
    <a href="#" onclick="signOut();" class="m-2 text-danger"><i class="fas fa-power-off"></i></a>`

    $('#user').empty()
    $('#user').append(html)
    $("#user").show()
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        localStorage.clear()
    });

    $("#user").hide()
    $("#todo-list").hide()
    
    getLoginForm()
}