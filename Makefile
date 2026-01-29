.PHONY: db-create db-start db-stop db-delete db-logs migrate generate studio docker-build docker-delete

DB_NAME := ideahub-postgres
DB_PORT := 5450
DB_CONTAINER := ${DB_NAME}

# Database commands
db-create:
	docker run -d \
		--name ${DB_CONTAINER} \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=ideahub \
		-p ${DB_PORT}:5432 \
		postgres:latest

db-start:
	docker start ${DB_CONTAINER}

db-stop:
	docker stop ${DB_CONTAINER}

db-delete:
	docker stop ${DB_CONTAINER} || true
	docker rm ${DB_CONTAINER}

db-logs:
	docker logs -f ${DB_CONTAINER}

# Prisma commands
migrate:
	pnpm prisma migrate dev

generate:
	pnpm prisma generate

studio:
	pnpm prisma studio

# Docker commands
docker-build:
	docker build -t ideahub:latest .

docker-delete:
	docker rmi ideahub:latest