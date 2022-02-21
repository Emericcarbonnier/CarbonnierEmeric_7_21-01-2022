1ère étape 

*Mettre les infos token dans un .env en copiant le .env.example

2ème étape

*Verifier le fichier config.js qui ce trouve dans le dossier backend/config
*Le username et le password correspond à ceux de VOTRE base de donnée.



3ème étape - installer le backend

ouvrir un terminal puis executé les commandes dans l'ordre

*cd backend 
*npm install 
*npx sequelize-cli db:create
*npx sequelize-cli db:migrate
*node server

4ème étape - installer le frontend 

ouvrir un second terminal puis executé les commandes dans l'ordre

*cd frontend
*npm install
*npm start



