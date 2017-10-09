### Application deployed at

https://evening-basin-24316.herokuapp.com

### About the project
* Created a large restful social media application with user registration,login and logout using passport js where users can have complete CRUD abilities of campgrounds posts and comments created by them.

* Implemented dynamic pricing for campgrounds and proper authentication and authorization by appropriate middleware.Added functionality to search through campgrounds and for resetting password. 

* Used mongodb for backend database as well as bootstrap for styling. Added support for viewing campgrounds location using google maps.

## Restful routes for campground
| name      |    url                    |    verb   |        desc.                                |
|---------- |:-------------------------:|----------:|--------------------------------------------:|
| INDEX     |   /campgrounds            |    GET    |         Display list of campgrounds         |
| NEW       |   /campgrounds/new        |    GET    |      Display form to create a new campground|
| CREATE    |   /campgrounds            |    POST   |       Add new campground to DB              |
| SHOW      |   /campgrounds/:id        |    GET    |       Shows info about 1 campground.        |
| EDIT      |   /campgrounds/:id/edit   |    GET    |       Shows edit page for 1 campground.     |
| UPDATE    |   /campgrounds/:id        |    PUT    |       updates info about 1 campground.      |
| DELETE    |   /campgrounds/:id        |    DELETE |      delete info about 1 campground.        |

## Restful routes for comments
| name      |      url                                  |     verb  |                desc.                          |
|---------- |:-----------------------------------------:|----------:|----------------------------------------------:|
| NEW       | /campgrounds/:id/comments/new             |   GET     |     display form for comment. Nested route.   | 
| CREATE    | /campgrounds/:id/comments                 |   POST    |     Add new comment for campground.           | 
| EDIT      | /campgrounds/:id/comments/:comment_id/edit|   GET     |    Shows edit page for 1 comment.             | 
| UPDATE    | /campgrounds/:id/comments/:comment_id     |   PUT     |     updates info about 1 campground.          | 
| DELETE    | /campgrounds/:id/comments/:comment_id     |   DELETE  |     updates info about 1 campground.          | 


## Auth Routes
| name          |    url                    |    verb   |        desc.                                |
|----------     |:-------------------------:|----------:|--------------------------------------------:|
| REGISTER      |       /register           |     GET   |           display form for signup.          | 
| REGISTER      |       /register           |     POST  |           Add new user                      | 
| LOGIN         |       /login              |     GET   |           display form for signin.          | 
| LOGIN         |       /login              |     POST  |           Authenticate existing user.       | 
| LOGOUT        |       /logout             |     GET   |           Logging out.                      | 
| User-profile  |       /users/:id          |     GET   |           Display user profile              |
| Forget Pass   |       /forgot             |     GET   |           Display forget password form      |
| Forget Pass   |       /forgot             |     POST  |           Send password form                |
| Reset Pass    |       /reset             |     GET   |           Display reset password form        |
| Reset Pass    |       /forgot             |     POST  |           Send reset form                   |


## Version History

### v1
* Setting up initial routes such as campgrounds and creating form for entering a new Campground.
 
### v2
* Installing mongodb for working and changed files to support mongooose backend.Basic Styling.

### v3
*  Created model directory and moved models in it. Created new model for comments and displaying them on campgrounds page.

### v4
* Created form for submitting new comments and saving comments to DB.Uses Nested Routes.

### v5
* Overall styling for comments and show page

### v6
* Adding authentication functionality to the Yelp camp page.

### v7
* Refactoring routes and cleaning up.

### v8 Users and Comments
* Associate users and comments. Save author's name to comment automatically

### v9 Users and Campgrounds
* Prevent unauthenticated user from creting campground. Save author's name and id to campground automatically

### v10
* Adding edit and delete features(metjod overrides needed for PUT and DELETE requests).

### v11
* Adding authorization functionality so only the user who created campground can delete/edit it.
* Only show edit and delete buttons for valid user.


### v12
* Editing and deleting comments. Adding necessary authentication and authorization. 
* Hide/show edit delete buttons to appropriate users.
* Refactor middleware.

### v13
* Flash messages.Add bootstrap alerts to header.
* Fixing edge case for invalid same length mongodb ids.
* nodemon installation.(npm install -g nodemon --save)


### v14
* Adding background slider.Refactoring landing page.
* Visit https://github.com/nax3t/background-slider
* Dynamic price feature.
* Login,Signup,Navbar styling
* Adding current time to campgrounds and comments with moment.js.
* Adding google maps support for campground locations using geocoder.js


### v15
* Making photos safe so that users can only give image urls from unsplash.
* Creating Admin user and giving user priviledges.
* Creating user profiles(Also page for displaying user information).
* Fuzzy search through Campgroungs using Ajax.
* Made Search form safe from regex DDOS attack using "safe" escaped regex.
https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb
* Added password reset feature thorugh emails.(Uses async,crypto(included in node) and Nodemailer)
(Not working as per expectations because of google email security)






