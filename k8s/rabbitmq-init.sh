#!/bin/sh

# Start RabbitMQ in the background
rabbitmq-server &

# Wait for RabbitMQ to start
sleep 10

# Create user and set permissions
rabbitmqctl add_user user password || rabbitmqctl change_password user password
rabbitmqctl set_user_tags user administrator
rabbitmqctl set_permissions -p / user ".*" ".*" ".*"

# Keep container running
wait
