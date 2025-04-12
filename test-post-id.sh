#!/bin/bash

# Colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Post ID Test Script${NC}"
echo "-----------------------------------------------"

# Base URL
BASE_URL="http://localhost:3001/api"

# 1. Login as expert
echo -e "\n${GREEN}1. Logging in as expert...${NC}"
EXPERT_LOGIN=$(curl -s -X POST $BASE_URL/experts/login \
  -H "Content-Type: application/json" \
  -c expert_cookies.txt \
  -d '{
    "email": "jane.smith@example.com",
    "password": "Expert123!"
  }')

echo "$EXPERT_LOGIN"
EXPERT_ID=$(echo $EXPERT_LOGIN | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Expert ID: $EXPERT_ID"

# 2. Create a post
echo -e "\n${GREEN}2. Creating a post...${NC}"
POST_RESPONSE=$(curl -s -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -b expert_cookies.txt \
  -d '{
    "title": "Testing Post ID",
    "description": "This is a test post to verify that postId is properly included in the post data.",
    "tags": ["Test", "PostID"]
  }')

echo "$POST_RESPONSE"
POST_ID=$(echo $POST_RESPONSE | grep -o '"postId":"[^"]*' | cut -d'"' -f4)
echo "Post ID: $POST_ID"

# 3. Get the post by ID
echo -e "\n${GREEN}3. Getting post by ID...${NC}"
SINGLE_POST=$(curl -s -X GET $BASE_URL/posts/$POST_ID)
echo "$SINGLE_POST"

# 4. Get all posts
echo -e "\n${GREEN}4. Getting all posts...${NC}"
ALL_POSTS=$(curl -s -X GET "$BASE_URL/posts?limit=10")
echo "$ALL_POSTS"

# 5. Get posts by expert ID
echo -e "\n${GREEN}5. Getting posts by expert ID...${NC}"
EXPERT_POSTS=$(curl -s -X GET "$BASE_URL/posts/expert/$EXPERT_ID?limit=10")
echo "$EXPERT_POSTS"



echo -e "\n${GREEN}Test script completed!${NC}"

curl -X POST http://localhost:3001/api/posts/o0MaSavoMpPva6AApSvY/like \
  -H "Content-Type: application/json" \
  -b cookies.txt
