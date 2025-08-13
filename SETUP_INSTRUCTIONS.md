# 🚗 Car Rental System - Complete Setup Guide

## 📋 Prerequisites

1. **XAMPP** - For MySQL database
2. **Node.js** (v16 or higher) - For React frontend
3. **Java 17** - For Spring Boot backend
4. **Maven** - For building the backend

## 🗄️ Step 1: Database Setup

### 1.1 Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Wait for both services to show "Running" status

### 1.2 Create Database
1. Open browser and navigate to: `http://localhost/phpmyadmin`
2. Click "New" in the left sidebar
3. Enter database name: `car_rental_db`
4. Select collation: `utf8mb4_general_ci`
5. Click "Create"

### 1.3 Verify Database Creation
- You should see `car_rental_db` in the left sidebar
- The database is now ready for the Spring Boot application

## 🔧 Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd car-rental-backend
```

### 2.2 Install Dependencies and Build
```bash
mvn clean install
```

### 2.3 Run Tests (Optional but Recommended)
```bash
mvn test
```

### 2.4 Start the Backend Server
```bash
mvn spring-boot:run
```

**Or use the provided script:**
```bash
# On Windows
run.bat
```

### 2.5 Verify Backend is Running
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- Sample API call: `http://localhost:8080/api/cars`

## ⚛️ Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory
```bash
cd ..  # Go back to root directory if you're in car-rental-backend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Start the React Development Server
```bash
npm start
```

### 3.4 Verify Frontend is Running
- Frontend: `http://localhost:3000`
- The app should load and connect to the backend automatically

## 🔗 Step 4: Verify Integration

### 4.1 Check Database Connection
1. Go to `http://localhost:3000/cars`
2. You should see sample cars loaded from the database
3. Try searching or filtering cars

### 4.2 Test API Endpoints
1. Open `http://localhost:8080/api/swagger-ui.html`
2. Try the following endpoints:
   - `GET /cars` - Should return list of cars
   - `GET /customers` - Should return list of customers
   - `GET /rentals` - Should return list of rentals

### 4.3 Test Frontend Features
1. **Cars Page** (`/cars`): View, search, and filter cars
2. **Customers Page** (`/customers`): View and search customers
3. **Bookings Page** (`/bookings`): View and manage rentals

## 📊 Step 5: Sample Data

The application automatically creates sample data on first run:

### Cars (5 sample vehicles)
- Toyota Camry 2023 - $45/day
- Honda Civic 2022 - $40/day
- BMW X5 2023 - $85/day
- Tesla Model 3 2023 - $75/day
- Ford Mustang 2022 - $65/day

### Customers (3 sample customers)
- John Doe - john.doe@email.com
- Jane Smith - jane.smith@email.com
- Mike Johnson - mike.johnson@email.com

## 🛠️ Troubleshooting

### Backend Issues

**Problem: "Connection refused" or database errors**
- Solution: Ensure MySQL is running in XAMPP
- Check database name is exactly `car_rental_db`
- Verify MySQL is running on port 3306

**Problem: "Port 8080 already in use"**
- Solution: Stop any other applications using port 8080
- Or change port in `application.yml`

**Problem: Maven build fails**
- Solution: Ensure Java 17 is installed and JAVA_HOME is set
- Run `mvn clean` then `mvn install`

### Frontend Issues

**Problem: "Network Error" when loading data**
- Solution: Ensure backend is running on `http://localhost:8080`
- Check browser console for CORS errors
- Verify API endpoints are accessible

**Problem: "Module not found" errors**
- Solution: Delete `node_modules` and run `npm install` again
- Ensure you're in the correct directory

### Database Issues

**Problem: Tables not created**
- Solution: Check application logs for Hibernate errors
- Ensure database user has CREATE privileges
- Try changing `ddl-auto` to `create` in `application.yml`

## 🔄 Development Workflow

### Making Changes to Backend
1. Stop the backend server (Ctrl+C)
2. Make your changes
3. Run `mvn spring-boot:run` to restart

### Making Changes to Frontend
1. Changes are automatically reloaded
2. No need to restart the development server

### Database Changes
1. Backend automatically updates database schema
2. For major changes, you might need to drop and recreate tables

## 📝 API Documentation

Once running, access the interactive API documentation:
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **API Docs JSON**: `http://localhost:8080/api/api-docs`

## 🎯 Next Steps

After successful setup, you can:

1. **Add New Features**: Create new components and API endpoints
2. **Customize UI**: Modify CSS and add new styling
3. **Add Authentication**: Implement user login/registration
4. **Deploy**: Prepare for production deployment
5. **Add Tests**: Write more comprehensive tests

## 📞 Support

If you encounter issues:
1. Check the console logs (both frontend and backend)
2. Verify all services are running
3. Check the troubleshooting section above
4. Review the API documentation for correct endpoint usage

---

**🎉 Congratulations!** Your car rental system should now be fully integrated and running!