#!/usr/bin/env bash 



cd dist
TOKEN=$(curl -X POST "https://auth.rustamzh.com/auth/realms/Vqms/protocol/openid-connect/token" -d "client_id=vqms&username="$USERNAME"&password="$PASSWORD"&grant_type=password" | jq -r .access_token)
curl -X DELETE "$URL/files?version=1.0&businessId=$BUSINESSID" -H "Authorization: Bearer $TOKEN"
find * -type f | xargs -I {} -n 1 curl -X POST "$URL/files?version=1.0&relativePath=/{}&businessId=$BUSINESSID" -H "Authorization: Bearer $TOKEN" -F "file=@$PWD/{}"
