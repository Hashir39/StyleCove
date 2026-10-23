StyleCove

StyleCove is a full-stack e-commerce web application for fashion and clothing. It features a customer-facing storefront (frontend submodule), a Node.js/Express backend with MongoDB, and a React + Vite admin panel for managing products.

Features





Product Management





Add, remove, and list products



New collections and popular items (e.g. women’s section)



Image upload support via Multer



User Authentication





Sign up and login with JWT



Cart management (add, remove, get cart items)



Admin Panel





React + Vite based dashboard for product operations



Database





MongoDB with Mongoose (Users and Products schemas)

Project Structure

StyleCove/
├── backend/
│   ├── admin/                 # React + Vite admin panel
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── assets/
│   │   └── package.json
│   ├── models/
│   │   ├── Userschema.js
│   │   └── productschema.js
│   ├── routes/
│   │   └── auth.js            # Auth, products, cart routes
│   ├── upload/                # Image storage
│   ├── database.js
│   ├── index.js               # Main server entry
│   └── package.json
└── frontend/                  # Git submodule (customer storefront)

Tech Stack

Backend





Node.js



Express.js



MongoDB + Mongoose



JWT (jsonwebtoken)



Multer (file uploads)



bcrypt / bcryptjs



CORS

Admin Panel





React 18



Vite



React Router

Frontend





Separate repository (linked as Git submodule)

Getting Started

Prerequisites





Node.js (v18+ recommended)



MongoDB Atlas account (or local MongoDB)



Git

1. Clone the Repository

git clone https://github.com/Hashir39/StyleCove.git
cd StyleCove

If the frontend is a submodule, initialize it:

git submodule update --init --recursive

2. Backend Setup

cd backend
npm install

Create a .env file (recommended — do not hardcode credentials):

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret



Note: The current database.js contains a hardcoded connection string. Move it to environment variables for security.

Start the server:

node index.js
# or add a start script in package.json

Server runs on http://localhost:4000.

3. Admin Panel Setup

cd backend/admin
npm install
npm run dev

Admin panel typically runs on http://localhost:5173.

4. Frontend

Navigate to the frontend directory (after submodule init) and follow its own setup instructions (usually npm install + npm run dev).

API Endpoints (Main)







Method



Endpoint



Description





POST



/api/auth/signup



Register user





POST



/api/auth/login



Login user





POST



/api/auth/addproduct



Add product





POST



/api/auth/removeproduct



Remove product





GET



/api/auth/allproducts



Get all products





GET



/api/auth/newcollections



New collections





GET



/api/auth/popularinwomen



Popular in women





POST



/api/auth/addtocart



Add to cart (auth required)





POST



/api/auth/removefromcart



Remove from cart





POST



/api/auth/getcart



Get user cart





POST



/upload



Upload product image

Security Notes





Passwords are currently compared in plain text. Hash them with bcrypt before saving.



JWT secret and MongoDB URI are hardcoded — use environment variables.



Add proper input validation and rate limiting for production.
