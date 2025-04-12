#!/bin/bash

# Base URL
BASE_URL="http://localhost:3001/api"
COOKIES_FILE="user_cookies.txt"

echo "Account Aggregator API Test Script"
echo "-----------------------------------------------"

# 1. Login with provided credentials
echo "1. Logging in with nallanahk@gmail.com..."
curl -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -c $COOKIES_FILE \
  -d '{
    "email": "nallanahk@gmail.com",
    "password": "hari3536"
  }'

echo -e "\n-----------------------------------------------"

# 2. Upload account aggregator data as JSON
echo "2. Uploading account aggregator data as JSON..."
curl -X POST $BASE_URL/account-aggregator \
  -H "Content-Type: application/json" \
  -b $COOKIES_FILE \
  -d '{
    "accounts": [
      {
        "accountId": "ACC123456789",
        "accountType": "SAVINGS",
        "accountName": "Savings Account",
        "balance": 5000.75,
        "currency": "INR"
      }
    ],
    "userProfile": {
      "name": "Hari Nallana",
      "email": "nallanahk@gmail.com"
    }
  }'

echo -e "\n-----------------------------------------------"

# 3. Get account aggregator data
echo "3. Getting account aggregator data..."
curl -X GET $BASE_URL/account-aggregator \
  -b $COOKIES_FILE

echo -e "\n-----------------------------------------------"

# 4. Create a JSON file for file upload test
echo "4. Creating JSON file for upload test..."
cat > account_data.json << 'EOF'
{
  "accounts": [
    {
      "accountId": "ACC123456789",
      "accountType": "SAVINGS",
      "accountName": "Savings Account",
      "balance": 5000.75,
      "currency": "INR"
    }
  ],
  "userProfile": {
    "name": "Hari Nallana",
    "email": "nallanahk@gmail.com"
  }
}
EOF
echo "JSON file created: account_data.json"

echo -e "\n-----------------------------------------------"

# 5. Upload account aggregator data as file
echo "5. Uploading account aggregator data as file..."
curl -X POST $BASE_URL/account-aggregator/upload \
  -b $COOKIES_FILE \
  -F "file=@account_data.json"

echo -e "\n-----------------------------------------------"

# 6. Get account aggregator data again to verify file upload
echo "6. Getting account aggregator data after file upload..."
curl -X GET $BASE_URL/account-aggregator \
  -b $COOKIES_FILE

echo -e "\n-----------------------------------------------"

# 7. Delete account aggregator data
echo "7. Deleting account aggregator data..."
curl -X DELETE $BASE_URL/account-aggregator \
  -b $COOKIES_FILE

echo -e "\n-----------------------------------------------"

# 8. Verify deletion by trying to get data again
echo "8. Verifying deletion by getting data again..."
curl -X GET $BASE_URL/account-aggregator \
  -b $COOKIES_FILE

echo -e "\n-----------------------------------------------"

# Clean up
echo "Cleaning up..."
rm -f account_data.json
rm -f $COOKIES_FILE

echo "Test script completed!"
