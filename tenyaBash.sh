#!/bin/bash
export $(egrep -v '^#' .env | xargs)

if [ $1 == "deploy" ]
    then
        docker build --add-host $APP_HOST:$APP_IP -t $APP_NAME .
        docker stop $APP_NAME
        docker rm $APP_NAME
        docker run -it --net='host' --name=$APP_NAME -p $APP_PORT:$APP_PORT -d --restart=unless-stopped $APP_NAME
fi

if [ $1 == "stop" ]
    then
        docker stop $APP_NAME
fi

if [ $1 == "exec" ]
    then
        docker exec -it $APP_NAME $3
fi

if [ $1 == "start" ]
    then
        docker start $APP_NAME
fi

if [ $1 == "logs" ]
    then
        docker logs -f $APP_NAME
fi

if [ $1 == "rm" ]
    then
        docker stop $APP_NAME
        docker rm $APP_NAME
fi