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
	echo '{'                                            > Dockerrun.aws.json
	echo '  "AWSEBDockerrunVersion": 3,'               >> Dockerrun.aws.json
	echo '  "containerDefinitions": ['                 >> Dockerrun.aws.json
	echo '    {'                                       >> Dockerrun.aws.json
	echo '      "name": "backend",'                    >> Dockerrun.aws.json
	echo '      "image": "$(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/wimm-backend:latest",' >> Dockerrun.aws.json
	echo '      "essential": true,'                    >> Dockerrun.aws.json
	echo '      "portMappings": [{ "hostPort": 8080, "containerPort": 8080 }]' >> Dockerrun.aws.json
	echo '    },'                                      >> Dockerrun.aws.json
	echo '    {'                                       >> Dockerrun.aws.json
	echo '      "name": "frontend",'                   >> Dockerrun.aws.json
	echo '      "image": "$(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/wimm-frontend:latest",' >> Dockerrun.aws.json
	echo '      "essential": true,'                    >> Dockerrun.aws.json
	echo '      "portMappings": [{ "hostPort": 80, "containerPort": 80 }]' >> Dockerrun.aws.json
	echo '    }'                                       >> Dockerrun.aws.json
	echo '  ]'                                         >> Dockerrun.aws.json
	echo '}'                                           >> Dockerrun.aws.json
