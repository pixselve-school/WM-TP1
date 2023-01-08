<h1 align="center">Association Manager REST API</h1>
<h4 align="center">Mael KERICHARD (@Pixselve) - Romain BRIEND (@Yami2200)</h4>
<p align="center">
   <img src="https://img.shields.io/badge/-ESIR-orange" alt="ESIR">
   <img src="https://img.shields.io/badge/-TypeScript-blue" alt="TypeScript">
   <img src="https://img.shields.io/badge/-NestJS-red" alt="NestJS">
</p>

---

This project provides a REST API made with NestJS for managing associations. The API provides powerful tools to manage
the associations, such as creating, updating, and deleting members, managing meeting minutes, and more.

## ✨ How to use

We released a Docker image for anyone to use. It is available
on [GitHub Packages](https://github.com/pixselve-school/tp1-wm/pkgs/container/tp1-wm).

```bash
docker run -p 3000:3000 ghcr.io/pixselve-school/tp1-wm:master
```

### Environment variables

| Name                | Value                                                                                   | Example                          | Required |
|---------------------|-----------------------------------------------------------------------------------------|----------------------------------|----------|
| `DB_HOST`           | The host of the database. It should be a PostgreSQL database.                           | 127.0.0.1                        | ✅        |
| `DB_USERNAME`       | The username of the database.                                                           | postgres                         | ✅        |
| `DB_PASSWORD`       | The password of the database.                                                           | postgres                         | ✅        |
| `DB_DATABASE`       | The name of the database.                                                               | postgres                         | ✅        |
| `DEFAULT_USER_PASS` | If the database is empty, a default user with ID `1` and the ENV value will be created. | admin                            | ✅        |
| `RABBITMQ_URL`      | The url pointing to a RabbitMQ instance.                                                | amqp://guest:guest@rabbitmq:5672 | ❌        |

## 🧱 Build from source

### Requirements

- Node.js
- PostgreSQL
- RabbitMQ (optional)

### Installation

```bash
git clone
cd tp1-wm
npm install
```

### Configuration

The configuration is done through environment variables. You can find the list of environment variables in the
[Environment variables](#environment-variables) section.

### Running

```bash
npm run build
npm run start
```
