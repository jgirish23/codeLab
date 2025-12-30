# CodeLab – A Cloud IDE Platform
CodeLab is a cloud-based Integrated Development Environment (IDE) that enables developers to write, execute, and test code directly from their web browsers. It eliminates the need for local installations, making development seamless and accessible from anywhere.

# Key Features:

**Browser-Based Execution:** Run code without requiring additional software installations.

**Multi-Language Support:** Currently supports React.js, JavaScript, and Python, with plans to expand.

**Real-Time Code Execution:** Instant feedback on code execution with an interactive environment.

**Terminal:** Integrated command-line support for executing commands and scripts.

**File System:** Organize and manage project files efficiently.


## Future Plans:

**-** Support for additional languages like Java, C++, and Go.

**-** Collaboration Features (Planned): Live coding, sharing, and pair programming.

## Screenshots
![1](https://github.com/user-attachments/assets/16673d8d-2235-4fa3-ae17-55b85ea95f33)
![2](https://github.com/user-attachments/assets/a21cd4ee-eab9-409e-bc29-647ba19889de)
![3](https://github.com/user-attachments/assets/133b3c6d-97ea-4315-ae28-43a73eed4ce6)

---

## 🛠 Tech Stack

- **Backend:** Spring Boot
- **Frontend:** React.js
- **Containerization:** Docker
- **Orchestration:** Kubernetes (Minikube)
- **Ingress:** NGINX Ingress Controller

---

## 🧑‍💻 Local Setup Guide

Follow these steps to set up CodeLab locally.

### **Step 1: Install Prerequisites**

Ensure the following are installed:

- Docker
- Minikube
- kubectl
- dnsmasq

Verify installations:

```bash
docker --version
minikube version
kubectl version --client
```

### **Step 2: Configure Local Domains using dnsmasq**
1. Install dnsmasq if not already installed:
```bash
sudo apt update
sudo apt install dnsmasq
```

2. Create a configuration file for local subdomains:
```bash
sudo nano /etc/dnsmasq.d/local-domains.conf
```
Add:
```text
# All *.mylocal → 127.0.0.1
address=/.mylocal/127.0.0.1

# All *.test → 127.0.0.1
address=/.test/127.0.0.1
```

3. Restart dnsmasq:
```bash
sudo systemctl restart dnsmasq
```

### **Step 3: Configure System DNS Resolver**
1. Edit systemd resolver configuration:
```bash
sudo nano /etc/systemd/resolved.conf
```

2. Add/update the following:
```bash
[Resolve]
DNS=127.0.0.1
Domains=~.
```
3. Restart resolver:
```bash
sudo systemctl restart systemd-resolved
```

### **Step 4: Verify DNS Setup**
Test wildcard subdomains:
```bash
ping 123.mylocal
ping test.mylocal
```
You should see 127.0.0.1.

### **Step 5: Start Minikube**
Start Minikube with Docker driver:
```bash
minikube start --driver=docker
```

### **Step 6: Enable NGINX Ingress Controller (One-Time Setup)**
Enable ingress addon:
```bash
minikube addons enable ingress
```

### **Step 7: Start Minikube Tunnel**
Open a new terminal and run:
```bash
minikube tunnel
```
⚠️ Keep this running while using CodeLab.

### **Step 8: Port Forward Ingress Controller**
In another terminal, forward ingress controller:
```bash
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8081:80
```

### **Step 9: Clone codeLab UI and codeLab_orchester_service **
Clone both services:
```bash
git clone git@github.com:jgirish23/codeLab.git
git clone git@github.com:jgirish23/codeLab_orchester_service.git
```

Spinup CodeLab in port 3000 and orchestra service in 8082



