# Posts API Test Commands

## Create a Post (Expert Only)

```bash
# First, login as an expert to get a token
curl -X POST http://localhost:3001/api/experts/login \
  -H "Content-Type: application/json" \
  -c expert_cookies.txt \
  -d '{
    "email": "jane.smith@example.com",
    "password": "Expert123!"
  }'

# Then create a post using the session cookie
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -b expert_cookies.txt \
  -d '{
    "title": "Retirement Planning Basics",
    "description": "In this post, I will cover the essential steps for planning your retirement effectively. We will discuss investment strategies, savings goals, and how to estimate your retirement needs.",
    "tags": ["Retirement", "Financial Planning", "Investments"]
  }'
```

## Get All Posts

```bash
curl -X GET "http://localhost:3001/api/posts?limit=10"
```

## Get a Single Post by ID

```bash
curl -X GET http://localhost:3001/api/posts/POST_ID_HERE
```

## Get Posts by Expert ID

```bash
curl -X GET "http://localhost:3001/api/posts/expert/EXPERT_ID_HERE?limit=10"
```

## Get Posts by Tag

```bash
curl -X GET "http://localhost:3001/api/posts/tag/Retirement?limit=10"
```

## Search Posts

```bash
curl -X GET "http://localhost:3001/api/posts/search?query=retirement&limit=10"
```

## Update a Post (Expert Only)

```bash
curl -X PUT http://localhost:3001/api/posts/POST_ID_HERE \
  -H "Content-Type: application/json" \
  -b expert_cookies.txt \
  -d '{
    "title": "Updated: Retirement Planning Basics",
    "description": "Updated content with more detailed information about retirement planning strategies.",
    "tags": ["Retirement", "Financial Planning", "Investments", "401k"]
  }'
```

## Like a Post

```bash
# First, login as a user to get a token
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -c user_cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'

# Then like a post using the session cookie
curl -X POST http://localhost:3001/api/posts/POST_ID_HERE/like \
  -b user_cookies.txt
```

## Unlike a Post

```bash
curl -X POST http://localhost:3001/api/posts/POST_ID_HERE/unlike \
  -b user_cookies.txt
```

## Add Trust Rating to a Post

```bash
curl -X POST http://localhost:3001/api/posts/POST_ID_HERE/trust \
  -H "Content-Type: application/json" \
  -b user_cookies.txt \
  -d '{
    "trustValue": 5
  }'
```

## Delete a Post (Expert Only)

```bash
curl -X DELETE http://localhost:3001/api/posts/POST_ID_HERE \
  -b expert_cookies.txt
```

## Notes:
- Replace `POST_ID_HERE` with an actual post ID
- Replace `EXPERT_ID_HERE` with an actual expert ID
- The `-b expert_cookies.txt` flag uses the session cookie from the expert login
- The `-b user_cookies.txt` flag uses the session cookie from the user login
