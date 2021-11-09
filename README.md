# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [Nestjs](https://nestjs.com/).

## Running the app

Create a .env file on the /serve directory of this project with the following content:

```
DATABASE_URL=postgresql://devx:devxpassword@localhost:5432/devx?schema=public
EMAIL=
EMAIL_PASSWORD=
EMAIL_VERIFY_SUBJECT=Email de verificação
URL_EMAIL_VERIFY=http://localhost:3000/email/checked
EMAIL_FROM='"Dexs " <dexs@dexs.com>'
EMAIL_HOST='smtp.gmail.com'
EMAIL_PORT=587
JWT_SECRET=yYl8%BIm6MEZsHaW#iO2nCQamhUAYWlh213
JWT_EXPIRES_IN=14600000s
STATIC_FOLDER=public
NODE_ENV=dev
```

You setup a postgre instance using the `docker-compose.yml` file;

To create our database system, run:

```
npx prisma
npx prisma db push --preview-feature
npx prisma db seed
```

Then you can start the server and the frontend run these commands:

Inside the server folder `npm run start`
Inside the client folder `npm run start`
