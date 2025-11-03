# --- Zmienne globalne ---
DOCKER_COMPOSE_DEV = docker compose --env-file .env.dev -f docker-compose.dev.yml
DOCKER_COMPOSE_PROD = docker compose --env-file .env.prod -f docker-compose.prod.yml

# --- Komendy developerskie ---
dev:
	$(DOCKER_COMPOSE_DEV) up

dev-down:
	$(DOCKER_COMPOSE_DEV) down

# --- Komendy produkcyjne ---
prod:
	$(DOCKER_COMPOSE_PROD) up -d

prod-down:
	$(DOCKER_COMPOSE_PROD) down

# --- Testy backendu ---
test-backend:
	cd backend && ./mvnw test

# --- Budowanie frontend i backend ---
build-backend:
	cd backend && ./mvnw clean package -DskipTests

build-frontend:
	cd frontend && npm install && npm run build

# --- Deployment (np. przez GitHub Actions lub lokalny testowy) ---
deploy:
	git push origin main


# --- CI/CD tasks ---
ci-build:
	docker build -t $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/wimm-backend:latest ./backend
	docker build -t $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/wimm-frontend:latest ./frontend

ci-push:
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/wimm-backend:latest
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/wimm-frontend:latest

ci-generate-dockerrun:
	bash -c "cat <<EOF > Dockerrun.aws.json
	{
	"AWSEBDockerrunVersion": 3,
	"containerDefinitions": [
	{
		"name": "backend",
		"image": "$(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/wimm-backend:latest",
		"essential": true,
		"portMappings": [{ "hostPort": 8080, "containerPort": 8080 }]
	},
	{
		"name": "frontend",
		"image": "$(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/wimm-frontend:latest",
		"essential": true,
		"portMappings": [{ "hostPort": 80, "containerPort": 80 }]
	}
	]
	}
	EOF"
