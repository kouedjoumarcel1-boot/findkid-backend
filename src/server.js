const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
 .then(() => sequelize.sync())
  .then(() => {
    console.log('MySQL connecté + modèles synchronisés');
    app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));
  })
  .catch((err) => console.error('Erreur:', err));