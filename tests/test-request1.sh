# request to staging system which is on latest version
const chartBuffer =
curl -d @tests/data/test1.json -H "Content-Type: application/json" -X POST -vvv http://172.31.18.150:8084/ > test1.png