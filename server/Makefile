create-module:
	nest g module ${name} --no-spec

create-controller:
	nest g controller ${name} --no-spec

create-service:
	nest g service ${name} --no-spec

up-db:
	docker compose up -d

check-db:
	docker exec -it server-bookmark-db-1 psql -U bookmark -d bookmark-db

check-test-db:
	docker exec -it server-test-db-1 psql -U bookmark -d test-db

migrate-db:
	npx prisma migrate dev

restart-db:
	docker compose rm bookmark-db -s -f -v && \
	docker compose up bookmark-db -d && \
	sleep 1 && npx prisma migrate deploy

restart-test-db:
	docker compose rm test-db -s -f -v && \
	docker compose up test-db -d && \
	sleep 1 && npx dotenv -e .test.env prisma migrate deploy

test-app:
	make restart-test-db && \
	npx dotenv -e .test.env -- jest --watch --no-cache --config ./test/jest-e2e.json