const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON invalide dans le corps de la requête' });
  }
  next(err);
});
app.use('/uploads/enfants', express.static('uploads/enfants'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
// ...
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

const signalementRoutes = require('./routes/signalementRoutes');
// ...
app.use('/api/signalements', signalementRoutes);

const postePoliceRoutes = require('./routes/postePoliceRoutes');
// ...
app.use('/api/postes-police', postePoliceRoutes);

const messageRoutes = require('./routes/messageRoutes');
// ...
app.use('/api/messages', messageRoutes);

const rechercheFacialeRoutes = require('./routes/rechercheFacialeRoutes');
// ...
app.use('/api/recherche-faciale', rechercheFacialeRoutes);

const citoyenRoutes = require('./routes/citoyenRoutes');
// ...
app.use('/api/citoyens', citoyenRoutes);

const utilisateurRoutes = require('./routes/utilisateurRoutes');
// ...
app.use('/api/admin/utilisateurs', utilisateurRoutes);

const statistiqueRoutes = require('./routes/statistiqueRoutes');
// ...
app.use('/api/statistiques', statistiqueRoutes);

module.exports = app;