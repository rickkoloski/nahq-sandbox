# NAHQ Sandbox — AWS Deployment Guide

**Live URL:** http://18.219.171.198
**Region:** us-east-2 (Ohio)
**Account:** portablemind (793752195657)

---

## Infrastructure

| Resource | Type | Details | Cost |
|----------|------|---------|------|
| EC2 | t3.micro | Amazon Linux 2023, `nahq-sandbox`, i-09b6fa89c706148dc | ~$8.50/mo |
| RDS | db.t3.micro | PostgreSQL 17.6 + pgvector 0.8.0, `nahq-sandbox` | ~$15.44/mo |
| **Total** | | | **~$24/mo** |

## Connection Details

| | Value |
|---|---|
| EC2 Public IP | 18.219.171.198 |
| EC2 Private IP | 172.31.41.28 |
| RDS Endpoint | nahq-sandbox.czsq6cqim8jy.us-east-2.rds.amazonaws.com |
| RDS Port | 5432 |
| RDS Database | nahq_sandbox |
| RDS User | postgres |
| SSH Key | `~/Desktop/__lic files/nahq-sandbox.pem` |
| Spring Boot Port | 4003 (proxied by nginx) |

## SSH Access

```bash
ssh -i "~/Desktop/__lic files/nahq-sandbox.pem" ec2-user@18.219.171.198
```

## Redeploy Process

### 1. Build locally

```bash
# Spring Boot jar
cd ~/src/apps/nahq/accelerate-api
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
./gradlew bootJar

# React static files
cd ~/src/apps/nahq/accelerate-ui
pnpm build
```

### 2. Upload to EC2

```bash
KEY="~/Desktop/__lic files/nahq-sandbox.pem"
HOST=ec2-user@18.219.171.198

# Upload jar
scp -i "$KEY" accelerate-api/build/libs/accelerate-api-0.0.1-SNAPSHOT.jar $HOST:~/app.jar

# Upload static files
tar czf /tmp/nahq-dist.tar.gz -C accelerate-ui/dist .
scp -i "$KEY" /tmp/nahq-dist.tar.gz $HOST:~/dist.tar.gz
```

### 3. Deploy on EC2

```bash
ssh -i "$KEY" $HOST

# Stop old app
pkill -f 'java -jar' || true

# Extract static files
sudo rm -rf /var/www/nahq/*
sudo tar xzf ~/dist.tar.gz -C /var/www/nahq
sudo chown -R nginx:nginx /var/www/nahq

# Start new app
nohup java -jar ~/app.jar \
  --spring.datasource.url="jdbc:postgresql://nahq-sandbox.czsq6cqim8jy.us-east-2.rds.amazonaws.com:5432/nahq_sandbox?sslmode=require" \
  --spring.datasource.username=postgres \
  --spring.datasource.password=YOUR_PASSWORD \
  --server.port=4003 \
  --anthropic.api-key=YOUR_ANTHROPIC_KEY \
  > ~/app.log 2>&1 &

# Verify
sleep 10 && curl -s http://localhost:4003/actuator/health
```

### 4. Reseed (if DB was reset)

```bash
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://18.219.171.198/api/seed/generate?userCount=100"
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://18.219.171.198/api/courses/seed"
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://18.219.171.198/api/analytics/refresh"
```

## One-liner Redeploy Script

```bash
# From ~/src/apps/nahq — builds, uploads, and restarts in one shot
KEY="~/Desktop/__lic files/nahq-sandbox.pem" && \
HOST=ec2-user@18.219.171.198 && \
cd accelerate-api && ./gradlew bootJar && cd .. && \
cd accelerate-ui && pnpm build && cd .. && \
scp -i "$KEY" accelerate-api/build/libs/accelerate-api-0.0.1-SNAPSHOT.jar $HOST:~/app.jar && \
tar czf /tmp/nahq-dist.tar.gz -C accelerate-ui/dist . && \
scp -i "$KEY" /tmp/nahq-dist.tar.gz $HOST:~/dist.tar.gz && \
ssh -i "$KEY" $HOST 'pkill -f "java -jar" || true; sleep 2; sudo tar xzf ~/dist.tar.gz -C /var/www/nahq; sudo chown -R nginx:nginx /var/www/nahq; nohup java -jar ~/app.jar --spring.datasource.url="jdbc:postgresql://nahq-sandbox.czsq6cqim8jy.us-east-2.rds.amazonaws.com:5432/nahq_sandbox?sslmode=require" --spring.datasource.username=postgres --spring.datasource.password=YOUR_PASSWORD --server.port=4003 --anthropic.api-key=YOUR_ANTHROPIC_KEY > ~/app.log 2>&1 &' && \
echo "Deployed! Waiting for startup..." && sleep 15 && \
curl -s http://18.219.171.198/actuator/health
```

## Nginx Config

Located at `/etc/nginx/conf.d/nahq.conf` on EC2:
- `/` → static files from `/var/www/nahq`
- `/api/*` → proxy to `localhost:4003`
- `/actuator/*`, `/swagger-ui`, `/api-docs` → proxy to `localhost:4003`
- SPA fallback: all other routes → `index.html`

## Security Groups

| Group | Rules |
|-------|-------|
| launch-wizard-1 (EC2) | SSH from Rick's IP, HTTP/HTTPS from anywhere |
| default (RDS) | PostgreSQL 5432 from launch-wizard-1 security group |

## Logs

```bash
# Spring Boot logs
ssh -i "$KEY" $HOST "tail -50 ~/app.log"

# Nginx logs
ssh -i "$KEY" $HOST "sudo tail -50 /var/log/nginx/access.log"
ssh -i "$KEY" $HOST "sudo tail -50 /var/log/nginx/error.log"
```

## TODO

- [ ] Change RDS password (exposed in chat during setup)
- [ ] Set up systemd service for Spring Boot (auto-restart on reboot)
- [ ] Add Elastic IP (current IP changes on instance stop/start)
- [ ] Consider a domain name for Tim-friendly URL
- [ ] Set up HTTPS with Let's Encrypt or ACM + ALB
