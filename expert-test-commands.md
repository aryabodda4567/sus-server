# Expert Authentication Test Commands

## Expert Registration and Login

### 1. Register a new expert
```bash
curl -v -X POST http://localhost:3001/api/experts/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "email": "jane.smith@example.com",
    "password": "Expert123!",
    "specialties": ["Financial Planning", "Retirement"],
    "experience": "10+ years in financial advisory",
    "qualifications": ["CFP", "CFA Level III"],
    "bio": "Experienced financial advisor specializing in retirement planning and investment strategies."
  }'
```

### 2. Login as expert (now works immediately after signup)
```bash
curl -v -X POST http://localhost:3001/api/experts/login \
  -H "Content-Type: application/json" \
  -c expert_cookies.txt \
  -d '{
    "email": "jane.smith@example.com",
    "password": "Expert123!"
  }'
```

## Admin Operations (optional, not required for basic functionality)

### 3. Get all experts (admin only)
```bash
curl -v -X GET http://localhost:3001/api/experts/all \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 4. Verify an expert (optional, experts are auto-verified)
```bash
curl -v -X PUT http://localhost:3001/api/experts/verify/EXPERT_ID_HERE \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## Expert Operations

### 5. Login as expert (same as step 2, repeated for completeness)
```bash
curl -v -X POST http://localhost:3001/api/experts/login \
  -H "Content-Type: application/json" \
  -c expert_cookies.txt \
  -d '{
    "email": "jane.smith@example.com",
    "password": "Expert123!"
  }'
```

## Expert Profile Operations

### 6. Get expert profile
```bash
curl -v -X GET http://localhost:3001/api/experts/profile \
  -b expert_cookies.txt \
  -H "Content-Type: application/json"
```

### 7. Update expert profile
```bash
curl -v -X PUT http://localhost:3001/api/experts/profile \
  -b expert_cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio with more details about my expertise in retirement planning.",
    "specialties": ["Financial Planning", "Retirement", "Tax Planning"],
    "experience": "12+ years in financial advisory"
  }'
```

## Public Expert Endpoints

### 8. Get all verified experts
```bash
curl -v -X GET http://localhost:3001/api/experts/verified
```

### 9. Get experts by specialty
```bash
curl -v -X GET http://localhost:3001/api/experts/specialty/Retirement
```

## Authentication Status and Logout

### 10. Check authentication status
```bash
curl -v -X GET http://localhost:3001/api/experts/check-auth \
  -b expert_cookies.txt
```

### 11. Logout
```bash
curl -v -X POST http://localhost:3001/api/experts/logout \
  -b expert_cookies.txt
```

## Notes:
- The `-v` flag enables verbose output to see request/response details
- The `-c expert_cookies.txt` flag saves cookies to a file
- The `-b expert_cookies.txt` flag sends cookies from the file with the request
- Replace `EXPERT_ID_HERE` with the actual expert ID returned from registration
- Replace `ADMIN_TOKEN_HERE` with a valid admin JWT token
