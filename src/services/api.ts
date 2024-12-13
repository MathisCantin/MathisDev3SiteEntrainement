import axios from 'axios';
import { Entrainement as EntrainementType } from '../models/Entrainement';
import { Utilisateur as UtilisateurType } from '../models/Utilisateur';

const API_URL = 'https://mathisdev3api.onrender.com/api'; 

// Fonction pour générer un token d'authentification
export const generateToken = async (email: string, motDePasse: string) => {
  try {
    const response = await axios.post(`${API_URL}/generertoken`, { email, motDePasse });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour récupérer l'identifiant d'un utilisateur en fonction de son email et mot de passe
export const getUserByEmailAndPassword = async (email: string, motDePasse: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/utilisateurs/id`,
      { email, motDePasse },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour ajouter un nouvel utilisateur
export const ajouterUtilisateur = async (utilisateur: UtilisateurType) => {
  try {
    const response = await axios.post(`${API_URL}/utilisateurs/add`, utilisateur);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour ajouter un entraînement
export const ajouterEntrainementApi = async (entrainement: EntrainementType, utilisateurId: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/entrainements/${utilisateurId}`,
      { entrainement },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Fonction pour modifier un entraînement
export const modifierEntrainement = async (entrainement: EntrainementType, token: string) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/entrainements`, 
      { entrainement }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour récupérer tous les entraînements
export const getEntrainements = async () => {
  try {
    const response = await axios.get(`${API_URL}/entrainements`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des entraînements", error);
    throw error;
  }
};

// Fonction pour récupérer un entraînement par ID
export const getEntrainement = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/entrainements/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entraînement", error);
    throw error;
  }
};

// Fonction pour récupérer les entraînements filtrés par calories
export const getEntrainementsByCalorie = async (calories: number) => {
  try {
    const response = await axios.get(`${API_URL}/entrainements/calories/${calories}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des entraînements par calories", error);
    throw error;
  }
};

// Fonction pour récupérer les entraînements filtrés par catégorie
export const getEntrainementsByCategorie = async (categorie: string) => {
  try {
    const response = await axios.get(`${API_URL}/entrainements/categorie/${categorie}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des entraînements par catégorie", error);
    throw error;
  }
};

// Fonction pour récupérer tous les entraînements d'un utilisateur
export const getEntrainementsByUtilisateur = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/entrainements/utilisateur/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des entraînements", error);
    throw error;
  }
};

// Fonction pour récupérer un entraînement par ID
export const getEntrainementById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/entrainements/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entraînement", error);
    throw error;
  }
};

// Fonction pour ajouter un entraînement
export const addEntrainement = async (entrainement: EntrainementType) => {
  try {
    const response = await axios.post(`${API_URL}/entrainements/add`, entrainement);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'entraînement", error);
    throw error;
  }
};

export const supprime = async (entrainement: EntrainementType) => {
  const utilisateurId = localStorage.getItem('userId');
  if (!utilisateurId) {
    return;
  }

  try {
    const response = await axios.delete(
      `${API_URL}/entrainements/${entrainement._id}`,
      {
        params: { utilisateur: utilisateurId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.status === 200) {
      return true;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
