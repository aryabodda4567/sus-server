#!/bin/bash

# Colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Account Aggregator API Test Script${NC}"
echo "-----------------------------------------------"

# Base URL
BASE_URL="http://localhost:3001/api"
COOKIES_FILE="user_cookies.txt"

# 1. Login with provided credentials
echo -e "\n${GREEN}1. Logging in with nallanahk@gmail.com...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -c $COOKIES_FILE \
  -d '{
    "email": "nallanahk@gmail.com",
    "password": "hari3536"
  }')

echo "$LOGIN_RESPONSE"

# Check if login was successful
if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
    echo -e "${GREEN}Login successful!${NC}"
else
    echo -e "${RED}Login failed! Exiting...${NC}"
    exit 1
fi

# 2. Upload account aggregator data as JSON
echo -e "\n${GREEN}2. Uploading account aggregator data as JSON...${NC}"
JSON_UPLOAD_RESPONSE=$(curl -s -X POST $BASE_URL/account-aggregator \
  -H "Content-Type: application/json" \
  -b $COOKIES_FILE \
  -d '{
    "accounts": [
      {
        "accountId": "ACC123456789",
        "accountType": "SAVINGS",
        "accountName": "Savings Account",
        "balance": 5000.75,
        "currency": "INR",
        "transactions": [
          {
            "transactionId": "TXN001",
            "amount": 1000.00,
            "type": "CREDIT",
            "description": "Salary",
            "date": "2023-06-01T10:30:00Z"
          },
          {
            "transactionId": "TXN002",
            "amount": 500.50,
            "type": "DEBIT",
            "description": "Shopping",
            "date": "2023-06-05T15:45:00Z"
          }
        ]
      },
      {
        "accountId": "ACC987654321",
        "accountType": "CURRENT",
        "accountName": "Current Account",
        "balance": 10000.25,
        "currency": "INR",
        "transactions": [
          {
            "transactionId": "TXN003",
            "amount": 2000.00,
            "type": "CREDIT",
            "description": "Client Payment",
            "date": "2023-06-10T09:15:00Z"
          }
        ]
      }
    ],
    "investments": [
      {
        "investmentId": "INV001",
        "investmentType": "MUTUAL_FUND",
        "investmentName": "Growth Fund",
        "units": 100,
        "currentValue": 15000.00,
        "purchaseValue": 12000.00,
        "purchaseDate": "2022-01-15T00:00:00Z"
      }
    ],
    "loans": [
      {
        "loanId": "LOAN001",
        "loanType": "HOME_LOAN",
        "loanAmount": 2000000.00,
        "outstandingAmount": 1800000.00,
        "interestRate": 8.5,
        "startDate": "2020-03-10T00:00:00Z",
        "endDate": "2035-03-10T00:00:00Z"
      }
    ],
    "userProfile": {
      "name": "Hari Nallana",
      "email": "nallanahk@gmail.com",
      "phone": "+919876543210",
      "kycStatus": "VERIFIED",
      "lastUpdated": "2023-06-15T12:00:00Z"
    }
  }')

echo "$JSON_UPLOAD_RESPONSE"

# 3. Get account aggregator data
echo -e "\n${GREEN}3. Getting account aggregator data...${NC}"
GET_RESPONSE=$(curl -s -X GET $BASE_URL/account-aggregator \
  -b $COOKIES_FILE)

echo "$GET_RESPONSE"

# 4. Create a JSON file for file upload test
echo -e "\n${GREEN}4. Creating JSON file for upload test...${NC}"
cat > account_data.json << 'EOF'
{
  "accounts": [
    {
      "accountId": "ACC123456789",
      "accountType": "SAVINGS",
      "accountName": "Savings Account",
      "balance": 5000.75,
      "currency": "INR",
      "transactions": [
        {
          "transactionId": "TXN001",
          "amount": 1000.00,
          "type": "CREDIT",
          "description": "Salary",
          "date": "2023-06-01T10:30:00Z"
        },
        {
          "transactionId": "TXN002",
          "amount": 500.50,
          "type": "DEBIT",
          "description": "Shopping",
          "date": "2023-06-05T15:45:00Z"
        }
      ]
    }
  ],
  "userProfile": {
    "name": "Hari Nallana",
    "email": "nallanahk@gmail.com",
    "phone": "+919876543210",
    "kycStatus": "VERIFIED",
    "lastUpdated": "2023-06-15T12:00:00Z"
  }
}
EOF
echo "JSON file created: account_data.json"

# 5. Upload account aggregator data as file
echo -e "\n${GREEN}5. Uploading account aggregator data as file...${NC}"
FILE_UPLOAD_RESPONSE=$(curl -s -X POST $BASE_URL/account-aggregator/upload \
  -b $COOKIES_FILE \
  -F "file=@account_data.json")

echo "$FILE_UPLOAD_RESPONSE"

# 6. Get account aggregator data again to verify file upload
echo -e "\n${GREEN}6. Getting account aggregator data after file upload...${NC}"
GET_RESPONSE_AFTER_FILE=$(curl -s -X GET $BASE_URL/account-aggregator \
  -b $COOKIES_FILE)

echo "$GET_RESPONSE_AFTER_FILE"

# 7. Delete account aggregator data
echo -e "\n${GREEN}7. Deleting account aggregator data...${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE $BASE_URL/account-aggregator \
  -b $COOKIES_FILE)

echo "$DELETE_RESPONSE"

# 8. Verify deletion by trying to get data again
echo -e "\n${GREEN}8. Verifying deletion by getting data again...${NC}"
VERIFY_DELETE=$(curl -s -X GET $BASE_URL/account-aggregator \
  -b $COOKIES_FILE)

echo "$VERIFY_DELETE"

# Clean up
echo -e "\n${GREEN}Cleaning up...${NC}"
rm -f account_data.json
rm -f $COOKIES_FILE

echo -e "\n${GREEN}Test script completed!${NC}"
