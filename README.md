# Food Delivery App

A food delivery app with client and server side scripts with a frontend for user and an admin panel for admin

## How to run...

In the main directory, run the following command

#### npm install (in the main directory, in the client directory and in the server directory)
then
#### npm run dev
and run the below url in browser
#### http://localhost:3000/

### Technologies Used :

Frontend - ReactJs
Backend - NodeJs
Database - PostgreSQL  (Database credentials given below)
Database name : food
Database file included in the main directory (food).
Create new database 'food' in pgadmin and restore the above file.
Database credentials can be modified in /server/app/config/db.config.js
Frontend runs in http://localhost:3000/
Backend runs in http://localhost:3001/api

# USER ACCESS

## Signup Module :

1. User can create an account by signing up with their name, email address and a password. (The role for every new registered user is 'USER')
2. While signing up, user has to provide a strong password

## Password Reset Module :

1. If user forgets their password, an option to reset password has been given in the login screen.
2. User has to click on 'forgot password' link and enter their registered email Id.
3. A mail with a link to reset password will be sent to user's registered email Id.
4. User can reset their password with that link.

## Login Module :

1. User can login to their registered account with their email and password.
2. When user is logged in, they can access main menu page with options to add items to cart, cart page and orders page.

## Main Module for User :

1. In the menu page, user can specify quantities of item and can add the items to the cart.
2. When an item is added to the cart, user can change the quantity or remove the item from cart.
3. In the carts page, all the items in the cart along with its price are listed and the total amount is displayed at the bottom.
4. When user place the order, the items are added to orders.
5. User can view their previous orders in the orders page.

## Logout Module :

1. User or Admin can logout from their account and still can view the menu items from the index page.


# ADMIN ACCESS

Admin can login with the credentials and can access the admin dashboard.

## Admin Module :

1. Admin can add and delete an item to the menu which will be listed to every user of the app.
2. Admin can view all the orders placed and filter options with date filter, search filter, sorting are provided. 
2. Admin can view frequently ordered items with filters for menu type and sorting.


# CREDENTIALS

#### Admin :
email : admin@gmail.com
password : Admin@123

#### User : (User can create their own account)

email : user@gmail.com
password : User@123

email : user1@gmail.com
password : User@123

#### Database :
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "admin",
    DB: "food",
