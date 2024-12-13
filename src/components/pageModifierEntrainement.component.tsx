import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { modifierEntrainement } from '../services/api';
import Champ from './champ.component';
import Navigation from './navigation.component';

export const CategoriesTypes = ['Cardio', 'Force', 'Endurance', 'Puissance', 'Flexibilité'];

// Page pour modifier un entrainement
const PageModifierEntrainement = () => {
  const intl = useIntl();
  const location = useLocation();
  const entrainement = location.state?.entrainement;

  const [titre, setTitre] = useState(entrainement?.titre || '');
  const [description, setDescription] = useState(entrainement?.description || '');
  const [duree, setDuree] = useState<number>(entrainement?.duree || 0);
  const [caloriesBrulees, setCaloriesBrulees] = useState<number>(entrainement?.caloriesBrulees || 0);
  const [publique, setPublique] = useState(entrainement?.publique || false);
  const [categories, setCategories] = useState<string[]>(entrainement?.categories || []);
  const [repetitions, setRepetitions] = useState<number>(entrainement?.repetitions || 1);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!entrainement) {
      navigate('/entrainements/public');
    }
  }, [entrainement, navigate]);

  // Fonction pour valider les champs du formulaire
  const valideFormulaire = () => {
    if (!titre || titre.length > 100) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurTitre', defaultMessage: 'Le titre est requis et ne doit pas dépasser 100 caractères.' }));
      return false;
    }
    if (description && description.length > 500) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurDescription', defaultMessage: 'La description ne doit pas dépasser 500 caractères.' }));
      return false;
    }
    if (duree < 1) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurDuree', defaultMessage: 'La durée doit être d’au moins 1 minute.' }));
      return false;
    }
    if (duree > 9999999) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurDureeLongue', defaultMessage: 'La durée est trop longue.' }));
      return false;
    }
    if (caloriesBrulees < 0) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurCaloriesNegative', defaultMessage: 'Les calories brûlées doivent être égales ou supérieures à 0.' }));
      return false;
    }
    if (caloriesBrulees > 9999999) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurCaloriesHaute', defaultMessage: 'Le nombre de calories est trop élevé.' }));
      return false;
    }
    if (categories.length === 0) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurCategories', defaultMessage: 'Au moins une catégorie est obligatoire.' }));
      return false;
    }
    if (repetitions < 1) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurRepetitions', defaultMessage: 'Le nombre de répétitions doit être supérieur à 0.' }));
      return false;
    }
    if (repetitions > 9999999) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurRepetitionsHaute', defaultMessage: 'Le nombre de répétitions est trop élevé.' }));
      return false;
    }
    return true;
  };

  // Fonction pour gèrer les catégories sélectionnées
  const handleCategorieChange = (category: string) => {
    setCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  // Fonction pour enregistrer l'entrainement modifié
  const modifierEntrainementClick = async () => {
    if (!valideFormulaire()) {
      return;
    }

    const token = localStorage.getItem('token');
    const updatedEntrainement = {
      _id: entrainement?._id,
      titre,
      description,
      duree,
      caloriesBrulees,
      publique,
      categories,
      repetitions,
      date: entrainement?.date || new Date().toISOString(),
    };

    try {
      if (!token) {
        throw new Error('');
      }
      const result = await modifierEntrainement(updatedEntrainement, token);

      if (result) {
        navigate('/entrainements/personel');
      } else {
        setErreur(intl.formatMessage({ id: 'modifier.erreurModification', defaultMessage: 'Erreur lors de la modification de l\'entraînement' }));
      }
    } catch (error) {
      setErreur(intl.formatMessage({ id: 'modifier.erreurModification', defaultMessage: 'Erreur lors de la modification de l\'entraînement' }));
    }
  };

  return (
    <>
      <Navigation page="modifier" />
      <div className="conteneur">
        <h1>{intl.formatMessage({ id: 'modifier.titre', defaultMessage: 'Modifier l\'entraînement' })}</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <Champ label={intl.formatMessage({ id: 'modifier.titreLabel', defaultMessage: 'Titre* :' })} type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required />
          <Champ label={intl.formatMessage({ id: 'modifier.descriptionLabel', defaultMessage: 'Description :' })} type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Champ label={intl.formatMessage({ id: 'modifier.dureeLabel', defaultMessage: 'Durée (en minutes)* :' })} type="number" value={duree} onChange={(e) => setDuree(Number(e.target.value))} required />
          <Champ label={intl.formatMessage({ id: 'modifier.caloriesLabel', defaultMessage: 'Calories brûlées* :' })} type="number" value={caloriesBrulees} onChange={(e) => setCaloriesBrulees(Number(e.target.value))} required />

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

          <Champ label={intl.formatMessage({ id: 'modifier.repetitionsLabel', defaultMessage: 'Répetitions :' })} type="number" value={repetitions} onChange={(e) => setRepetitions(Number(e.target.value))} />

          <div>
            <label>{intl.formatMessage({ id: 'modifier.publicLabel', defaultMessage: 'Public :' })}</label>
            <input type="checkbox" checked={publique} onChange={() => setPublique(!publique)} />
          </div>

          {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
          <button type="submit" onClick={modifierEntrainementClick}>
            {intl.formatMessage({ id: 'modifier.submitButton', defaultMessage: 'Modifier l\'entraînement' })}
          </button>
        </form>
      </div>
    </>
  );
};

export default PageModifierEntrainement;