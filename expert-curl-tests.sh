#!/bin/bash

# Colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Expert Registration and Login Test Script${NC}"
echo "-----------------------------------------------"

# Base URL
BASE_URL="http://localhost:3001/api"

# 1. Register a new expert
echo -e "\n${GREEN}1. Registering a new expert...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/experts/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "email": "jane.smith@example.com",
    "password": "Expert123!",
    "specialties": ["Financial Planning", "Retirement"],
    "experience": "10+ years in financial advisory",
    "qualifications": ["CFP", "CFA Level III"],
    "bio": "Experienced financial advisor specializing in retirement planning and investment strategies."
  }')

echo "$REGISTER_RESPONSE"

# Extract expert ID from response if needed
EXPERT_ID=$(echo $REGISTER_RESPONSE | grep -o '"expertId":"[^"]*' | cut -d'"' -f4)
echo -e "Expert ID: $EXPERT_ID"

# 2. Login as expert
echo -e "\n${GREEN}2. Logging in as expert...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/experts/login \
  -H "Content-Type: application/json" \
  -c expert_cookies.txt \
  -d '{
    "email": "jane.smith@example.com",
    "password": "Expert123!"
  }')

echo "$LOGIN_RESPONSE"

# 3. Get expert profile
echo -e "\n${GREEN}3. Getting expert profile...${NC}"
PROFILE_RESPONSE=$(curl -s -X GET $BASE_URL/experts/profile \
  -b expert_cookies.txt \
  -H "Content-Type: application/json")

echo "$PROFILE_RESPONSE"

# 4. Update expert profile
echo -e "\n${GREEN}4. Updating expert profile...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/experts/profile \
  -b expert_cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio with more details about my expertise in retirement planning.",
    "specialties": ["Financial Planning", "Retirement", "Tax Planning"],
    "experience": "12+ years in financial advisory"
  }')

echo "$UPDATE_RESPONSE"

# 5. Get all verified experts (public endpoint)
echo -e "\n${GREEN}5. Getting all verified experts...${NC}"
VERIFIED_RESPONSE=$(curl -s -X GET $BASE_URL/experts/verified)

echo "$VERIFIED_RESPONSE"

# 6. Check authentication status
echo -e "\n${GREEN}6. Checking authentication status...${NC}"
AUTH_RESPONSE=$(curl -s -X GET $BASE_URL/experts/check-auth \
  -b expert_cookies.txt)

echo "$AUTH_RESPONSE"

# 7. Logout
echo -e "\n${GREEN}7. Logging out...${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST $BASE_URL/experts/logout \
  -b expert_cookies.txt)

echo "$LOGOUT_RESPONSE"

# 8. Verify logout by checking auth again
echo -e "\n${GREEN}8. Verifying logout...${NC}"
VERIFY_LOGOUT=$(curl -s -X GET $BASE_URL/experts/check-auth \
  -b expert_cookies.txt)

echo "$VERIFY_LOGOUT"

echo -e "\n${GREEN}Test script completed!${NC}"
