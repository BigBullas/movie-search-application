################ Docker commands ################

# создание образа
build:
	docker-compose build --no-cache
# создать контейнер
up:
	docker-compose up -d; docker exec -it webapp zsh || winpty docker exec -it webapp zsh
# выключить контейнер
down:
	docker-compose down
# зайти в терминал контейнера, внутри контейнера урезанная Ubuntu, и все те же команды
bash:
	docker exec -it webapp zsh || winpty docker exec -it webapp zsh