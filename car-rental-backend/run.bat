@echo off
echo Starting Car Rental API...
echo.
echo Building the project...
call mvn clean compile
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Running tests...
call mvn test
if %ERRORLEVEL% neq 0 (
    echo Tests failed!
    pause
    exit /b 1
)

echo.
echo Starting the application...
echo API will be available at: http://localhost:8080/api
echo Swagger UI will be available at: http://localhost:8080/api/swagger-ui.html
echo H2 Console will be available at: http://localhost:8080/api/h2-console
echo.
call mvn spring-boot:run