sudo systemctl start mongod

if [ $? -eq 0 ]; then
    echo MongoDB running
else
    echo Failed to Start MongoDB
    exit 1
fi

mongo 127.0.0.1/iotApplication mongoInit.js