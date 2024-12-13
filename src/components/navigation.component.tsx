import LangueSelecteur from './langueSelecteur.component'
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

interface ChampProps {
  page: string;
}

// Barre de navigation pour changer de page
const Navigation = (props: ChampProps) => {
  const navigate = useNavigate();
  const intl = useIntl();

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {props.page !== "accueil" && (
          <li>
            <button onClick={() => navigate('/entrainements/public')}>
              {intl.formatMessage({ id: 'navigation.accueil', defaultMessage: 'Accueil' })}
            </button>
          </li>
        )}

        {props.page !== "entrainementsPerso" && (
          <li>
            <button onClick={() => navigate('/entrainements/personel')}>
              {intl.formatMessage({ id: 'navigation.personnel', defaultMessage: 'Personnel' })}
            </button>
          </li>
        )}

        {props.page !== "ajouter" && (
          <li>
            <button onClick={() => navigate('/entrainements/ajouter')}>
              {intl.formatMessage({ id: 'navigation.ajouterEntrainement', defaultMessage: 'Ajouter un Entraînement' })}
            </button>
          </li>
        )}
        <LangueSelecteur />
      </ul>
    </nav>
  );
};

export default Navigation;