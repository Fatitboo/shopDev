# Guild

## Getting started

### Pull image

```
docker pull rabbitmq:3-management
```

### Create and run container with localhost:15672 (UI admin rabbitMQ)

```
docker run -d --name rabbitMQ -p 5672:5672 -р 15672:15672 rabbitmq:3-management
```

username: guest
password: 12345

docker exec -it rabbitMQ bash
-> rabbitmqctl change_password <user> <new_password>
