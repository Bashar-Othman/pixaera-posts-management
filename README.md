<H2>Pixaera / Posts Management <BR/></H2>

<h3>Technology Stack :</h3><BR/>
-Node <BR/>
-NestJS<BR/>
-Express-platform <BR/>
-Passport <BR/>
-Typeorm<BR/>
-Postgres DB <BR/>
-Swagger API <BR/>
<BR/>
Installation on a Node machine :<BR/>

<h3> Change the .env for your local setting </h3> <BR/>
# PostgreSQL <BR/>
POSTGRES_USER=postgres <BR/>
POSTGRES_PASSWORD=2004 <BR/>
POSTGRES_DB=pixaera <BR/>
# API <BR/>
PORT=3001 <BR/>
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB} <BR/>
APP_SECRET=0dd8d1d7c673300e0e800e10e13eb6ee1414c140e046ebf7e2229010ab7ab79a10f06fddeebabfb428b6a380aa12654c <BR/>
ALLOWED_ORIGINS=http://localhost:3000 <BR/>

<BR/>
- npm install <BR/>
- nest build <BR/>
- npm run start:dev<BR/>
<BR/>
<h3>Api testing (Swagger) :<BR/></h3>

http://localhost:3001/api#/<BR/>
