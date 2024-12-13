import { useState } from 'react';
import { useIntl } from 'react-intl';
import Champ from './champ.component';
import { useNavigate } from 'react-router-dom';
import Navigation from './navigation.component';
import { ajouterEntrainementApi } from '../services/api';
import { Entrainement as EntrainementType } from '../models/Entrainement';

export const CategoriesTypes = ['Cardio', 'Force', 'Endurance', 'Puissance', 'Flexibilité'];

// Page pour ajouter un entrainement
const PageAjouterEntrainement = () => {
  const intl = useIntl();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [duree, setDuree] = useState<number>(0);
  const [caloriesBrulees, setCaloriesBrulees] = useState<number>(0);
  const [publique, setPublique] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [repetitions, setRepetitions] = useState<number>(1);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  // Fonction pour valider les champs du formulaire
  const valideFormulaire = () => {
    if (!titre || titre.length > 100) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurTitre', defaultMessage: 'Le titre est requis et ne doit pas dépasser 100 caractères.' }));
      return false;
    }
    if (description && description.length > 500) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurDescription', defaultMessage: 'La description ne doit pas dépasser 500 caractères.' }));
      return false;
    }
    if (duree < 1) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurDuree', defaultMessage: 'La durée doit être d’au moins 1 minute.' }));
      return false;
    }
    if (duree > 9999999) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurDureeLongue', defaultMessage: 'La durée est trop longue.' }));
      return false;
    }
    if (caloriesBrulees < 0) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurCaloriesNegative', defaultMessage: 'Les calories brûlées doivent être égales ou supérieures à 0.' }));
      return false;
    }
    if (caloriesBrulees > 9999999) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurCaloriesHaute', defaultMessage: 'Le nombre de calories est trop élevé.' }));
      return false;
    }
    if (categories.length === 0) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurCategories', defaultMessage: 'Au moins une catégorie est obligatoire.' }));
      return false;
    }
    if (repetitions < 1) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurRepetitions', defaultMessage: 'Le nombre de répétitions doit être supérieur à 0.' }));
      return false;
    }
    if (repetitions > 9999999) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurRepetitionsHaute', defaultMessage: 'Le nombre de répétitions est trop élevé.' }));
      return false;
    }
    return true;
  };

  // Fonction pour ajouter un entrainement
  const ajouterEntrainement = async () => {
    if (!valideFormulaire()) {
      return;
    }

    try {
      const utilisateurId = localStorage.getItem('userId');
      if (!utilisateurId) {
        setErreur(intl.formatMessage({ id: 'ajouter.erreurUtilisateurNonTrouve', defaultMessage: 'Utilisateur non trouvé. Veuillez vous reconnecter.' }));
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setErreur(intl.formatMessage({ id: 'ajouter.erreurTokenNonTrouve', defaultMessage: 'Token non trouvé. Veuillez vous reconnecter.' }));
        return;
      }

      const entrainement: EntrainementType = {
        titre,
        description,
        duree,
        caloriesBrulees,
        publique,
        categories,
        repetitions,
        date: new Date(),
      };

      const response = await ajouterEntrainementApi(entrainement, utilisateurId, token);

      if (response.status === 201) {
        navigate('/entrainements/personel');
      }
      throw new Error('');
    } catch (error) {
      setErreur(intl.formatMessage({ id: 'ajouter.erreurAjout', defaultMessage: 'Erreur lors de l\'ajout de l\'entraînement' }));
    }
  };

  // Fonction pour gèrer les catégories sélectionnées
  const handleCategorieChange = (category: string) => {
    setCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  return (
    <>
      <Navigation page="ajouter" />
      <div className="conteneur">
        <h1>{intl.formatMessage({ id: 'ajouter.titre', defaultMessage: 'Ajouter un entraînement' })}</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <Champ
            label={intl.formatMessage({ id: 'ajouter.titreLabel', defaultMessage: 'Titre* :' })}
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required={true}
          />
          <Champ
            label={intl.formatMessage({ id: 'ajouter.descriptionLabel', defaultMessage: 'Description :' })}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required={false}
          />
          <Champ
            label={intl.formatMessage({ id: 'ajouter.dureeLabel', defaultMessage: 'Durée (en minutes)* :' })}
            type="number"
            value={duree}
            onChange={(e) => setDuree(Number(e.target.value))}
            required={true}
          />
          <Champ
            label={intl.formatMessage({ id: 'ajouter.caloriesLabel', defaultMessage: 'Calories brûlées* :' })}
            type="number"
            value={caloriesBrulees}
            onChange={(e) => setCaloriesBrulees(Number(e.target.value))}
            required={true}
          />

          <div className="vertical">
            <label>{intl.formatMessage({ id: 'modifier.categoriesLabel', defaultMessage: 'Catégories* :' })}</label>
            <div>
              {CategoriesTypes.map((category) => (
                <div key={category} className="categorie">
                  <label>{intl.formatMessage({ id: `categories.${category}`, defaultMessage: category })}</label>
                  <input
                    type="checkbox"
                    id={category}
                    checked={categories.includes(category)}
                    onChange={() => handleCategorieChange(category)}
                  />
                </div>
              ))}
            </div>
          </div>    

          <Champ
            label={intl.formatMessage({ id: 'ajouter.repetitionsLabel', defaultMessage: 'Répetitions :' })}
            type="number"
            value={repetitions}
            onChange={(e) => setRepetitions(Number(e.target.value))}
            required={false}
          />

          <div>
            <label>{intl.formatMessage({ id: 'ajouter.publicLabel', defaultMessage: 'Public :' })}</label>
            <input
              type="checkbox"
              checked={publique}
              onChange={() => setPublique(!publique)}
            />
          </div>

          {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
          <button type="submit" onClick={ajouterEntrainement}>
            {intl.formatMessage({ id: 'ajouter.submitButton', defaultMessage: 'Ajouter l\'entraînement' })}
          </button>
        </form>
      </div>
    </>
  );
};

export default PageAjouterEntrainement;