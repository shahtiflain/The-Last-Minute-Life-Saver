import requests
import json

url = "http://localhost:8000/api/v1/orchestrate"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "your_secure_internal_key"
}
data = {
    "user_id": "test-user-123",
    "intent": "plan",
    "context": {
        "userInput": "I need to study for math test"
    }
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
