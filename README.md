## Project Name
Full Stack - Ecommerce Application (Vite + React + TypeScript -  Frontend, Flask + Python - Backend)

## Description

This e-commerce application is a cutting-edge solution developed using Vite, React, and TypeScript for the frontend, ensuring a dynamic and interactive user interface. The backend is powered by Flask and Python, providing a robust and scalable server-side environment. Styled with Tailwind CSS, the frontend design is both modern and responsive, offering an exceptional shopping experience.

The application integrates with a variety of APIs to showcase products, manage inventory, and facilitate user interactions such as adding items to the cart, creating wishlists, and posting product reviews. User authentication is handled through a custom solution, ensuring a secure and seamless login process.

The administrative features of this application are comprehensive. Administrators have full control over product management, including the ability to add, edit, and remove products. The admin panel also enables to edit and manage users, products, and view sales.

Hosting on a Linode server with Gunicorn ensures efficient server-side handling, while Nginx is utilized to optimize client request processing, vital for maintaining fast response times and handling high user traffic typical in e-commerce settings. This full-stack architecture, leveraging the strengths of React, TypeScript, Flask, and Python, delivers a powerful, efficient, and user-friendly e-commerce platform.

Here are some of the key third-party libraries powering this application.

## Frameworks & Libraries
- **ReactJS with Vite** - ReactJS is a popular JavaScript library for building user interfaces, particularly single-page applications. Vite is a modern front-end build tool that provides a faster and leaner development experience for React projects. It offers features like hot module replacement and efficient bundling.
- **Tailwind CSS** - A utility-first CSS framework for rapidly building custom user interfaces without writing custom CSS.
- **Flask** - A lightweight web framework for Python, ideal for creating small to medium web applications.
- **python-dotenv** - Loads environment variables from a `.env` file, making it easier to manage configuration settings.
- **requests** - Python's go-to HTTP client library, used for making various HTTP requests.
- **Flask-Cors** - A Flask extension to handle Cross-Origin Resource Sharing (CORS) and allow web browsers to make requests across domains.
- **MongoDB** - MongoDB is a NoSQL database known for its flexibility and scalability. It uses a document-oriented data model and supports various data types. MongoDB is widely used in modern web applications for its performance and ability to handle large volumes of data.
- **pylint** - A static code analysis tool for Python, used to identify coding errors and enforce a coding standard.
- **Gunicorn**: A Python WSGI HTTP Server for UNIX, Gunicorn acts as an interface between Python web applications and the web server, known for its efficiency and ability to handle multiple requests simultaneously.
- **Nginx**: A high-performance web server, Nginx excels in serving static content, reverse proxying, and load balancing, commonly used in front of Python applications to manage HTTP requests and static files.
- **Supervisor**: A process control system for UNIX-like operating systems, Supervisor monitors and controls processes like Gunicorn, ensuring they are consistently running and restarting them if necessary.

## Installation

#### 🛠 Development Setup (Local Server)

1. Clone this Repository 
  ```sh
  git clone git@github.com:thatmissedsemicolon/Ecommerce-Application.git
  ``` 
2. Change working directory 
  ```sh
  cd Ecommerce-Application
  ```
3. Install the environment and libraries required
  ```sh
  ./setup.sh install
  ``` 
4. Start the server
  ```sh
  ./setup.sh start
  ``` 
5. Access the app 
  ```sh
  http://localhost:5173
  ```