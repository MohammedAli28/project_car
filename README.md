# project_car
# 🚗 Car Showroom Project (Frontend + Backend + Reverse Proxy + ALB + ASG)

---

# 📌 Overview

This project demonstrates a **real-world scalable architecture** using:

* 🌐 Frontend (Nginx serving HTML UI)
* ⚙️ Backend (Node.js API running on port 3000)
* 🔁 Reverse Proxy (Nginx routing `/api` → backend)
* 🌍 External Load Balancer (public access)
* 🔒 Internal Load Balancer (private backend access)
* 🎯 Target Groups (frontend + backend)
* 🔐 Security Groups (layer-wise access control)

---

# 🏗️ Architecture

```text
User (Browser)
     ↓
External ALB (Public)
     ↓
Frontend (Nginx - Port 80)
     ↓
Internal ALB (Private)
     ↓
Backend (Node.js - Port 3000)
     ↑
Bastion (SSH Access)
```

---

# 🌐 Frontend

* Hosted on **Nginx**
* Serves static HTML UI
* Calls backend using:

```javascript
fetch("/api/cars")
```

---

# ⚙️ Backend

* Built using Node.js (Express)
* Runs on:

```text
Port: 3000
```

* API endpoint:

```text
/cars
```

---

# 🔁 Reverse Proxy (Key Concept)

## Config:

```nginx
location /api/ {
    proxy_pass http://<INTERNAL-ALB-DNS>/;
}
```

---

## 🧠 How Routing Works

### Step-by-step flow:

```text
Frontend calls:
    /api/cars

Nginx receives:
    /api/cars

Because of:
    proxy_pass http://ALB-DNS/;

Nginx rewrites:
    /api/cars → /cars

Backend receives:
    /cars

Backend route:
    app.get("/cars") → MATCH ✅
```

---

## 🎯 Important Rule

```text
proxy_pass with "/" → removes /api prefix
```

---

# 🔐 Security Groups

---

## 1️⃣ External Load Balancer SG

### Inbound:

```text
HTTP (80) → 0.0.0.0/0
HTTPS (443) → 0.0.0.0/0 (optional)
```

### Outbound:

```text
All traffic → Frontend SG
```

---

## 2️⃣ Frontend SG (Nginx)

### Inbound:

```text
HTTP (80) → External ALB SG
SSH (22) → Bastion SG
```

### Outbound:

```text
HTTP (80) → Internal ALB SG
```

---

## 3️⃣ Internal Load Balancer SG

### Inbound:

```text
HTTP (80) → Frontend SG
```

### Outbound:

```text
Custom TCP (3000) → Backend SG
```

---

## 4️⃣ Backend SG (Node.js)

### Inbound:

```text
Custom TCP (3000) → Internal ALB SG
SSH (22) → Bastion SG
```

### Outbound:

```text
All traffic
```

---

## 5️⃣ Bastion SG

### Inbound:

```text
SSH (22) → Your IP
```

### Outbound:

```text
SSH (22) → Frontend + Backend SG
```

---

# 🎯 Target Groups

---

## 🔹 Frontend Target Group

* Protocol: HTTP
* Port: 80
* Target: Frontend EC2

---

## 🔹 Backend Target Group

* Protocol: HTTP
* Port: 3000
* Target: Backend EC2

---

## 🔍 Health Check

Backend must respond to:

```text
/
```

So backend includes:

```javascript
app.get("/", ...)
```

---

# 🚀 How to Run the Application

---

## 🔹 Backend Setup

```bash
sudo yum install nodejs -y
cd /app

npm init -y
npm install express

node server.js
```

Test:

```bash
curl http://localhost:3000/cars
```

---

## 🔹 Frontend Setup

```bash
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

sudo cp index.html /usr/share/nginx/html/
```

---

## 🔹 Configure Reverse Proxy

```bash
sudo nano /etc/nginx/conf.d/app.conf
```

Add config → save

Then:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔹 Test Application

```text
http://<EXTERNAL-ALB-DNS>
```

Click **Load Cars** → Data loads from backend ✅

---

# 🔥 Port Mapping Explained (VERY IMPORTANT)

---

## 🎯 Ports Used

| Layer          | Port |
| -------------- | ---- |
| Browser → ALB  | 80   |
| ALB → Frontend | 80   |
| Frontend → ALB | 80   |
| ALB → Backend  | 3000 |
| Backend App    | 3000 |

---

## 🔁 Flow with Ports

```text
Browser → ALB:80
       ↓
Frontend:80 (Nginx)
       ↓
Internal ALB:80
       ↓
Backend:3000
```

---

## 🧠 Why port 3000?

Because backend defines:

```javascript
app.listen(3000)
```

👉 So Target Group + SG must match 3000

---

# 🎯 Key Learning

---

## 1️⃣ Reverse Proxy

* Frontend uses `/api`
* Nginx removes `/api`
* Backend gets clean path

---

## 2️⃣ Load Balancers

* External → public access
* Internal → private backend

---

## 3️⃣ Security

* Backend never exposed to internet
* Only ALB can access backend

---

## 4️⃣ Scaling Ready

* Works with Auto Scaling
* No hardcoded IPs

---
🚀 1. Run Nginx in background (Frontend)

👉 Good news:

sudo systemctl enable nginx
sudo systemctl start nginx

✔ Runs in background
✔ Auto-start on reboot
✔ Works with ASG

✅ Correct way (use PM2)

Install and configure:

npm install -g pm2

pm2 start server.js
pm2 save
pm2 startup

👉 This ensures:

New instance → Node app auto starts ✔
# 🚀 Final Outcome

* Fully working **multi-tier architecture**
* Secure + scalable setup
* Clean separation of frontend and backend
* Production-ready design pattern

---

# 🙌 Author

DevOps Hands-On Project
