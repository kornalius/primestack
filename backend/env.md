# Environment files
Environment variables offer information on the process's operating environment (producton, development, build pipeline, and so on). Environment variables in Node are used to store sensitive data such as passwords, API credentials, and other information that should not be written directly in code. Environment variables must be used to configure any variables or configuration details that may differ between environments.

## Development filename
> .env

## Production filename
> .env.production


## Fields

| Name                   | Value                              |
|------------------------|------------------------------------|
| ENV                    | `development` or `production`      |
| PREFIX                 | http                               |
| HOST                   | localhost                          |
| PORT                   | 3030                               |
| DEBUG                  | verbose                            |
| WS_PATH                | ws                                 |
| UPLOADS_PATH           | ./uploads/                         |
| PUBLIC                 | ./public/                          |
| SOCKET_LISTENERS       | 255                                |
| AUTHENTICATION_SECRET  | `your_secret`                      |
| AUTHENTICATION_ENTITY  | user                               |
| AUTHENTICATION_ID      | _id                                |
| AUTHENTICATION_SERVICE | users                              |
| USERNAME_FIELD         | email                              |
| USERNAME_PASSWORD      | password                           |
| JWT_AUDIENCE           | http://localhost:8080              |
| JWT_ISSUER             | feathers                           |
| JWT_ALGORITHM          | HS256                              |
| JWT_EXPIRATION         | 1d                                 |
| ORIGINS                | [\"http://localhost:3030\"]        |
| PAGINATE_DEFAULT       | 10                                 |
| PAGINATE_MAX           | 10000                              |
| MONGODB                | `mongodb://localhost:27017/prime`  |
| ADMIN_EMAIL            | `admin@email.com`                  |
| ADMIN_PWD              | `admin_password`                   |
| ADMIN_FIRSTNAME        | `Admin first name`                 |
| ADMIN_LASTNAME         | `Admin last name`                  |
| TESTUSER_EMAIL         | `TestUser@email.com`               |
| TESTUSER_PWD           | `test_user_password`               |
| TESTUSER_FIRSTNAME     | `Test user first name`             |
| TESTUSER_LASTNAME      | `Test user last name`              |
| I18N_LOCALE            | en                                 |
| I18N_FALLBACK_LOCALE   | en                                 |
| EMAIL_SERVICE          | `gmail`                            |
| EMAIL_HOST             | `smtp.gmail.com`                   |
| EMAIL_PORT             | `587`                              |
| EMAIL_SECURE           | `false`                            |
| EMAIL_SENDER           | `ServiceName<myaccount@gmail.com>` |
| EMAIL_USER             | `myaccount@gmail.com`              |
| EMAIL_PWD              | `email_server_password`            |

### Example `.env` file

```dotenv
ENV=development
PREFIX=http
HOST=localhost
PORT=3030
DEBUG=verbose
WS_PATH=ws
UPLOADS_PATH=./uploads/
PUBLIC=./public/
SOCKET_LISTENERS=255
AUTHENTICATION_SECRET=<your_secret>
AUTHENTICATION_ENTITY=user
AUTHENTICATION_ID=_id
AUTHENTICATION_SERVICE=users
USERNAME_FIELD=email
USERNAME_PASSWORD=password
JWT_AUDIENCE=http://localhost:8080
JWT_ISSUER=feathers
JWT_ALGORITHM=HS256
JWT_EXPIRATION=1d
ORIGINS=[\"http://localhost:3030\"]
PAGINATE_DEFAULT=10
PAGINATE_MAX=10000
MONGODB=mongodb://localhost:27017/prime
ADMIN_EMAIL=<admin@email.com>
ADMIN_PWD=<admin_password>
ADMIN_FIRSTNAME=Alain
ADMIN_LASTNAME=Deschenes
TESTUSER_EMAIL=<test@email.com>
TESTUSER_PWD=<test_user_password>
TESTUSER_FIRSTNAME=Bob
TESTUSER_LASTNAME=Bedaine
I18N_LOCALE=en
I18N_FALLBACK_LOCALE=en
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_SENDER=<PrimeStack<myaccount@gmail.com>>
EMAIL_USER=<myaccount@gmail.com>
EMAIL_PWD=<myaccount_password>
```
