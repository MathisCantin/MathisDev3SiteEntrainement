import { getEntrainement } from '../services/api';
import { useEffect, useState, Fragment } from 'react';
import Navigation from './navigation.component';
import { useIntl, FormattedMessage } from 'react-intl';
import { Entrainement as EntrainementType } from '../models/Entrainement';
import { useLocation } from 'react-router-dom';

const PageEntrainement = () => {
  const [entrainement, setEntrainement] = useState<EntrainementType | null>(null);
  const [erreur, setErreur] = useState<string>('');
  const intl = useIntl();
  const location = useLocation();
  const identifiant = location.state?.identifiant;

  // Fonction pour rechercher un entraînement
  const rechercheEntrainement = async () => {
    if (!identifiant) {
      setErreur(intl.formatMessage({ id: 'entrainementsErreurIdentifiant', defaultMessage: 'Aucun identifiant fourni' }));
      return;
    }

    try {
      const data = await getEntrainement(identifiant);
      if (data) {
        console.log('Entrainement data:', data.entrainement);
        setEntrainement(data.entrainement);
      } else {
        setErreur(intl.formatMessage({ id: 'entrainementsErreurRecuperation', defaultMessage: 'Aucun entraînement trouvé' }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'entraînement', error);
      setErreur(intl.formatMessage({ id: 'entrainementsErreurRecuperation', defaultMessage: 'Erreur lors de la récupération de l\'entraînement' }));
    }
  };

  // Appel à la fonction de recherche lors du chargement de la page
  useEffect(() => {
    if (identifiant) {
      setErreur('');
      rechercheEntrainement();
    }
  }, [identifiant]);

  return (
    <>
      <Navigation page={'detailEntrainement'} />
      <div className="conteneur">
        <h1>
          <FormattedMessage id={'detailEntrainement'} defaultMessage={'Détail d\'un entraînement'} />
        </h1>

        {erreur ? (
          <p style={{ color: 'red' }}>{erreur}</p>
        ) : entrainement ? (
          <div className="bordure">
            <h3>{entrainement.titre}</h3>
            <p>{entrainement.description}</p>
            <p>
              <FormattedMessage id="entrainementsDuree" defaultMessage="Durée" />: {entrainement.duree} min
            </p>
            <p>
              <FormattedMessage id="entrainementsCaloriesBrulees" defaultMessage="Calories Brûlées" />: {entrainement.caloriesBrulees} kcal
            </p>
            <p>
              <FormattedMessage id="entrainementsDate" defaultMessage="Date" />: {new Date(entrainement.date).toLocaleDateString()}
            </p>
            <p>
              <FormattedMessage id="entrainementsRepetitions" defaultMessage="Répetitions" />: {entrainement.repetitions}
            </p>
            <p>
              <FormattedMessage id="entrainementsCategories" defaultMessage="Catégories" />
              {/* Safeguard for categories */}
              {entrainement.categories && Array.isArray(entrainement.categories) ? (
                entrainement.categories.map((category, index) => (
                  <Fragment key={category}>
                    {index > 0 && ', '}
                    <FormattedMessage id={`categories.${category}`} defaultMessage={category} />
                  </Fragment>
                ))
              ) : (
                <span>{intl.formatMessage({ id: 'entrainementsCategoriesNonDisponible', defaultMessage: 'Catégories non disponibles' })}</span>
              )}
            </p>
          </div>
        ) : (
          <p>
            <FormattedMessage id="entrainementsAucunEntrainement" defaultMessage="Aucun entraînement disponible" />
          </p>
        )}
      </div>
    </>
  );
};

export default PageEntrainement;
