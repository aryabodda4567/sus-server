# Account Aggregator API Test Commands for User: nallanahk@gmail.com

## 1. Login

```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -c user_cookies.txt \
  -d '{
    "email": "nallanahk@gmail.com",
    "password": "hari3536"
  }'
```

## 2. Upload Account Aggregator Data (JSON in Request Body)

```bash
curl -X POST http://localhost:3001/api/account-aggregator \
  -H "Content-Type: application/json" \
  -b user_cookies.txt \
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
  }'
```

## 3. Get Account Aggregator Data

```bash
curl -X GET http://localhost:3001/api/account-aggregator \
  -b user_cookies.txt
```

## 4. Create a JSON File for Upload Test

```bash
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
```

## 5. Upload Account Aggregator Data (File Upload)

```bash
curl -X POST http://localhost:3001/api/account-aggregator/upload \
  -b user_cookies.txt \
  -F "file=@account_data.json"
```

## 6. Delete Account Aggregator Data

```bash
curl -X DELETE http://localhost:3001/api/account-aggregator \
  -b user_cookies.txt
```

## 7. Clean Up

```bash
rm -f account_data.json
rm -f user_cookies.txt
```
