# LearningHub Web Application

Web application for the course *Web Technologies and Programming*, the full project description can be found [here](assignment-description.pdf)..

The app connects to the [LearningHub API](https://learning-hub-1whk.onrender.com/) and provides:
- Browsing of categories and subcategories of educational material.
- Adding items (Books, Lectures) to a shopping cart (with authentication).
- Managing the shopping cart using a **React** component.

---

## Features
- **PX1**: Browse categories, subcategories, and learning items (using Handlebars templates).
- **PX2**: User login and adding items to the shopping cart.
- **PX3**: Shopping cart management with React (add/remove items, total cost).
- Node.js server with **Express** for authentication & cart services.
- Session management using **uuid**.
- (Optional Bonus) MongoDB persistence for shopping carts.

---

## Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Mariaboubi/LearningHubWebApp.git
cd LearningHubWebApp
```
### 2. Run the project
```bash
node index.js
```
Then, open the following URL in your browser: 'http://localhost:8080/public/index.html'

## List of Usernames and Passwords
The following users are preloaded in the application (defined in index.js, lines 11–18):
- Username: `user1`  
  Password: `Password123!`

- Username: `user2`  
  Password: `Password456`

- Username: `user3`  
  Password: `Password789!`

- Username: `user6`  
  Password: `Aaaaa12!`

---
