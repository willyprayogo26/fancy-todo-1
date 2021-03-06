## Fancy Todo

#### List of basic routes:

| Route          | HTTP | Header(s) | Body                                | Description                                                  |
| -------------- | ---- | --------- | ----------------------------------- | ------------------------------------------------------------ |
| /registerAdmin | POST | none      | email: String<br />password: String | Create a user (role auto admin)<br />success:<br />(201), example: {"_id": String, "email": String, "password": String, "role": String}<br />errors:<br />(500), error |
| /register      | POST | none      | email: String<br />password: String | Create a user (role auto user)<br />success:<br />(201), example: {"_id": String, "email": String, "password": String, "role": String}<br />errors:<br />(500), error |
| /login         | POST | none      | email: String<br />password: String | Login and get token based on credentials<br />success:<br />(200), example: {"_id": String, "email": String, "password": String, "role": String, "token": String}<br />errors:<br />(400), {message: 'Invalid email/password'}<br />(500), error |
| /google-login  | POST | none      | email: String<br />password: String | Login using Oauth2 (Google)<br />success:<br />(200), example: {object}<br />errors:<br />(500), error |



#### List of user routes:

| Route             | HTTP   | Header(s)                                                    | Body                                                  | Description                                                  |
| ----------------- | :----- | :----------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| /users            | GET    | Authenticated:<br />(token),<br />Authorized:<br />(role: admin) | none                                                  | Get all users info (Admin only)<br />success:<br />(200), example: [{"_id": String, "name": String, "email": String, "password": String, "profilePicture": String, "role": String}, {"_id": String, "name": String, "email": String, "password": String, "profilePicture": String, "role": String}, etc]<br />errors:<br />(500), error |
| /users/:id        | GET    | Authenticated:<br />(token)                                  | none                                                  | Get a single user info (Admin and authenticated member)<br />success:<br />(200), example: {"_id": String, "name": String, "email": String, "password": String, "profilePicture": String, "role": String}<br />errors:<br />(404), example: {message: 'User not found'}<br />(500), error |
| /users/:id/:email | GET    | Authenticated:<br />(token)                                  | none                                                  | Get a single user info based on Email (Admin and authenticated member)<br />success:<br />(200), example: {"_id": String, "name": String, "email": String, "password": String, "profilePicture": String, "role": String}<br />errors:<br />(404), example: {message: 'User not found'}<br />(500), error |
| /users            | POST   | Authenticated:<br />(token),<br />Authorized:<br />(role: admin) | email: String<br />password: String<br />role: String | Create a user (admin only)<br />success:<br />(201), example: {"_id": String, "name": String, "email": String, "password": String, "profilePicture": String, "role": String}<br />errors:<br />(500), error |
| /users/:id        | PUT    | Authenticated:<br />(token)                                  | email: String                                         | Update a user with new info (admin and authenticated member)<br />success:<br />(200), example: {message: 'Updated'}<br />errors:<br />(404), example: {message: 'User not found'}<br />(500), error |
| /users/:id        | DELETE | Authenticated:<br />(token),<br />Authorized:<br />(role: admin) | none                                                  | Delete a user (admin only)<br />success:<br />(200), example: {message: 'Deleted'}<br />errors:<br />(404), example: {message: 'User not found'}<br />(500), error |



#### List of project routes:

| Route                       | HTTP   | Header(s)                                                    | Body          | Description                                                  |
| --------------------------- | :----- | :----------------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| /projects                   | GET    | Authenticated:<br />(token)                                  | none          | Get all project info<br />success:<br />(200), example: [{"name": String, "createdBy": String, "members": [ObjectId]}, {"name": String, "createdBy": String, "members": [ObjectId]}, etc]<br />errors:<br />(500), error |
| /projects/:id               | GET    | Authenticated:<br />(token)<br />Authorized:<br />(check is Registered memberId) | none          | Get a single project info<br />success:<br />(200), example: {"name": String, "createdBy": String, "members": [ObjectId]}<br />errors:<br />(404), example: {message: 'Project not found'}<br />(500), error |
| /projects                   | POST   | Authenticated:<br />(token),<br />Authorized:<br />(check isUser) | name: String  | Create a project (authorized user)<br />success:<br />(201), example: {"name": String, "createdBy": String, "members": [ObjectId]}<br />errors:<br />(500), error |
| /projects/:id               | PUT    | Authenticated:<br />(token)<br />Authorized:<br />(check is Registered memberId) | name: String  | Update a project name with new info (owner Project only)<br />success:<br />(200), example: {message: 'Updated'}<br />errors:<br />(404), example: {message: 'Project not found'}<br />(500), error |
| /projects/add-member/:id    | PATCH  | Authenticated:<br />(token)<br />Authorized:<br />(check is Registered memberId) | email: String | Add a new member to the project<br />(200), example: {message: 'Member successfully added'}<br />errors:<br />(404), example: {message: 'User not found'}<br />(500), error |
| /projects/delete-member/:id | PATCH  | Authenticated:<br />(token)<br />Authorized:<br />(check is Registered memberId) | none          | Delete a member (owner Project only)<br />success:<br />(200), example: {message: 'Member successfully deleted'}<br />errors:<br />(404), example: {message: 'Member not found'}<br />(500), error |
| /projects/:id               | DELETE | Authenticated:<br />(token),<br />Authorized:<br />(check is Registered memberId) | none          | Delete a book (owner Project only)<br />success:<br />(200), example: {message: 'Project successfully deleted'}<br />errors:<br />(404), example: {message: 'Project not found'}<br />(500), error |



#### List of todo routes:

| Route                     | HTTP   | Header(s)                                                    | Body                                                        | Description                                                  |
| ------------------------- | :----- | :----------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| /todos/project/:projectId | GET    | Authenticated:<br />(token)                                  | none                                                        | Get todo that has based on projectId<br />success:<br />(200), example: [{"name": String, "description": String, "status": String, "due_date": String, "userId": {ObjectId}, projectId: {ObjectId}}, {"name": String, "description": String, "status": String, "due_date": String, "userId": {ObjectId}, projectId: {ObjectId}}, etc]<br />errors:<br />(500), error |
| /todos/:id                | GET    | Authenticated:<br />(token)<br />Authorized:<br />(check isUser) | none                                                        | Get todo that has based on userId<br />success:<br />(200), example: [{"name": String, "description": String, "status": String, "due_date": String, "userId": {ObjectId}, projectId: null}, {"name": String, "description": String, "status": String, "due_date": String, "userId": {ObjectId}, projectId: null}, etc]<br />errors:<br />(500), error |
| /todos/:id/:todoId        | GET    | Authenticated:<br />(token)<br />Authorized:<br />(check isUser) | none                                                        | Get a single todo info<br />success:<br />(200), example: {"name": String, "description": String, "status": String, "due_date": String, "userId": {ObjectId}, projectId: null}<br />errors:<br />(404), example: {message: 'Todo not found'}<br />(500), error |
| /todos/:id                | POST   | Authenticated:<br />(token),<br />Authorized:<br />(check isUser) | name: String<br />description: String<br />due_date: String | Create a todo<br />success:<br />(201), example: {"name": String, "description": String, "status": String, "due_date": String, "userId": {ObjectId}, projectId: null}<br />errors:<br />(400), example: {"message": String}<br />(500), error |
| /todos/:id/:todoId        | PUT    | Authenticated:<br />(token)<br />Authorized:<br />(check isUser) | email: String                                               | Update a todo with new info<br />success:<br />(200), example:{"name": String, "description": String, "status": String, "due_date": String, "userId": {ObjectId}, projectId: {ObjectId}}<br />errors:<br />(404), example: {message: 'Todo not found'}<br />(500), error |
| /todos/:id/:todoId        | DELETE | Authenticated:<br />(token),<br />Authorized:<br />(check isUser) | none                                                        | Delete a todo<br />success:<br />(200), example: {message: 'Todo successfully deleted'}<br />errors:<br />(404), example: {message: 'Todo not found'}<br />(500), error |



### Link Deploy

Server:

<http://fancy-todo-server.willyprayogo26.xyz/>



Client:

<http://willy-fancytodo.s3-website-ap-southeast-1.amazonaws.com>

