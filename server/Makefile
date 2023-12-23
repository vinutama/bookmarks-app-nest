create-module:
	nest g module ${name}

create-controller:
	nest g controller ${name}

create-service:
	nest g service ${name}

up-db:
	docker compose up -d

check-db:
	docker exec -it server-bookmark-db-1 psql -U bookmark -d bookmark-db

migrate-db:
	npx prisma migrate dev

restart-db:
	docker compose rm bookmark-db -s -f -v && \
	docker compose up bookmark-db -d && \
	sleep 1 && npx prisma migrate deploy