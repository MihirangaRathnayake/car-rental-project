# Car Rental Management System - Backend API

A comprehensive RESTful API for managing car rental operations built with Spring Boot.

## Features

- **Car Management**: CRUD operations for vehicles with status tracking
- **Customer Management**: Complete customer profile management
- **Rental Management**: End-to-end rental process with business logic
- **Search & Filtering**: Advanced search capabilities for cars and customers
- **Data Validation**: Comprehensive input validation and error handling
- **API Documentation**: Swagger/OpenAPI integration
- **Testing**: Unit and integration tests with high coverage

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (for development/testing)
- **Maven**
- **JUnit 5** & **Mockito** (for testing)
- **Swagger/OpenAPI 3** (for API documentation)

## API Endpoints

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/{id}` - Get car by ID
- `POST /api/cars` - Create new car
- `PUT /api/cars/{id}` - Update car
- `DELETE /api/cars/{id}` - Delete car
- `GET /api/cars/available` - Get available cars
- `GET /api/cars/search?keyword={keyword}` - Search cars
- `PATCH /api/cars/{id}/status?status={status}` - Update car status

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/customers/search?keyword={keyword}` - Search customers

### Rentals
- `GET /api/rentals` - Get all rentals
- `GET /api/rentals/{id}` - Get rental by ID
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/{id}` - Update rental
- `DELETE /api/rentals/{id}` - Delete rental
- `PATCH /api/rentals/{id}/complete?actualReturnDate={date}` - Complete rental
- `GET /api/rentals/customer/{customerId}` - Get rentals by customer
- `GET /api/rentals/overdue` - Get overdue rentals
- `GET /api/rentals/calculate-cost` - Calculate rental cost

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-rental-backend
   ```

2. **Build the project**
   ```bash
   mvn clean compile
   ```

3. **Run tests**
   ```bash
   mvn test
   ```

4. **Start the application**
   ```bash
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080/api`

### API Documentation

Once the application is running, you can access:
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **API Docs**: `http://localhost:8080/api/api-docs`
- **H2 Console**: `http://localhost:8080/api/h2-console`

### Sample Data

The application automatically loads sample data on startup:
- 5 sample cars with different makes, models, and statuses
- 3 sample customers with complete profiles

## Business Logic

### Car Status Management
- **AVAILABLE**: Car is ready for rental
- **RENTED**: Car is currently rented
- **MAINTENANCE**: Car is under maintenance
- **OUT_OF_SERVICE**: Car is not available

### Rental Process
1. Customer selects an available car
2. System validates availability for requested dates
3. System calculates total cost based on daily rate and duration
4. Car status changes to RENTED
5. Rental can be completed, updating car status back to AVAILABLE

### Validation Rules
- Unique license plates for cars
- Unique email addresses and driver licenses for customers
- Date validation for rentals (end date must be after start date)
- Car availability checking before rental creation

## Testing

The project includes comprehensive testing:

### Unit Tests
- Service layer tests with Mockito
- Controller tests with MockMvc
- Repository tests with @DataJpaTest

### Integration Tests
- End-to-end workflow testing
- Database integration testing
- API endpoint testing

Run tests with:
```bash
mvn test
```

## Configuration

### Database Configuration
The application uses H2 in-memory database by default. For production, update `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/carrental
    username: your_username
    password: your_password
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
```

### CORS Configuration
CORS is configured to allow requests from `http://localhost:3000` (React frontend).

## Error Handling

The API provides meaningful error responses:
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **409 Conflict**: Business rule violations
- **500 Internal Server Error**: Server errors

## Future Enhancements

- JWT Authentication and Authorization
- Payment processing integration
- Email notifications
- Advanced reporting and analytics
- File upload for car images
- Audit logging
- Rate limiting
- Caching with Redis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request