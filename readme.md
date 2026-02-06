## Prerequisites

* **Node.js 18+** (Recommended: 20 LTS)
* **npm** (comes with Node)
* **Docker & Docker Compose**
* **Terraform**

---

### Start Local AWS (LocalStack)

From project root:

```bash
docker-compose up -d
```

Check container running:

```bash
docker ps
```

---

### Build Lambda

```bash
cd lambda
npm install
npm run build
```

* Compiles TypeScript > JavaScript in `dist/`
* Zips code into `function.zip` for Lambda

---

### Deploy Infrastructure (Terraform)

```bash
cd ../terraform
terraform init
terraform apply -auto-approve
```

* Creates DynamoDB table, Lambda function, and API Gateway in **LocalStack**
* Terraform outputs **API_URL**, e.g.:

```
API_URL = http://localhost:4566/restapis/<API_ID>/dev/_user_request_
```

---

### Test API

#### Create an item for tenant A:

```bash
curl -X POST ^
-H "x-tenant-id: tenant-a" ^
-H "Content-Type: application/json" ^
-d "{\"name\":\"Invoice #123\"}" ^
http://localhost:4566/restapis/<API_ID>/dev/_user_request_/items
```

#### Get items for tenant A:

```bash
curl -H "x-tenant-id: tenant-a" ^
http://localhost:4566/restapis/<API_ID>/dev/_user_request_/items
```

#### Get items for tenant B (should be empty):

```bash
curl -H "x-tenant-id: tenant-b" ^
http://localhost:4566/restapis/<API_ID>/dev/_user_request_/items
```

Tenant isolation works — data is isolated per tenant.

---

### Stop LocalStack

```bash
docker-compose down
```

---

## Notes

* **Windows users:** `zip.js` replaces the `zip` command for cross-platform Lambda packaging.
* **Node.js version matters:** Must match `@types/node` version in `lambda/package.json`.
* **TypeScript:** `skipLibCheck: true` avoids type errors from AWS SDK / Node built-ins.
