#!/usr/bin/env bash 

set -x

echo "Changing directory"
cd dist
echo "Changed directory"
TOKEN=$(curl -X POST "https://auth.rustamzh.com/auth/realms/Vqms/protocol/openid-connect/token" -d "client_id=vqms&username="$USERNAME"&password="$PASSWORD"&grant_type=password" | jq -r .access_token)
echo "Got token"
curl -X DELETE "$URL/files?version=1.0&businessId=$BUSINESSID" -H "Authorization: Bearer $TOKEN"
echo "Deleted old files"
find * -type f | xargs -I {} -n 1 -t curl -X POST "$URL/files?version=1.0&relativePath={}&businessId=$BUSINESSID" -H "Authorization: Bearer $TOKEN" -F "file=@$PWD/{}"
echo "Uploaded new files"