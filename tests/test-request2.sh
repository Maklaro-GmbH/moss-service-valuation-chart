# request to staging system which is on latest version
curl -d @tests/data/test2.json -H "Content-Type: application/json" -X POST -vvv http://172.31.18.150:8084/ > test2.png