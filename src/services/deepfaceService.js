const axios = require('axios');

const DEEPFACE_URL = process.env.DEEPFACE_URL || 'http://localhost:5001';

const extraireEmbedding = async (cheminPhoto) => {
  const cheminAbsolu = require('path').resolve(cheminPhoto);
  const { data } = await axios.post(`${DEEPFACE_URL}/extraire-embedding`, {
    photo: cheminAbsolu,
  });
  return data.embedding;
};

const rechercherCorrespondance = async (cheminPhoto, candidats) => {
  const cheminAbsolu = require('path').resolve(cheminPhoto);
  const { data } = await axios.post(`${DEEPFACE_URL}/rechercher-correspondance`, {
    photo: cheminAbsolu,
    candidats,
  });
  return data.resultats;
};

module.exports = { extraireEmbedding, rechercherCorrespondance };