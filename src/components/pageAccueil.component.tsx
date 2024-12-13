import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

// Page d'accueil
const PageAccueille = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  return (
    <div className="conteneur">
      <h1>{intl.formatMessage({ id: 'accueil.bienvenue', defaultMessage: 'Bienvenue sur l\'application d\'entraînement' })}</h1>
      <img src="../src/assets/training.png" alt={intl.formatMessage({ id: 'accueil.imageAlt', defaultMessage: 'Training image' })} />
      <div className='horizontal'>
        <button onClick={() => navigate('/connexion')}>
          {intl.formatMessage({ id: 'accueil.seConnecter', defaultMessage: 'Se connecter' })}
        </button>
        <button onClick={() => navigate('/inscription')}>
          {intl.formatMessage({ id: 'accueil.sinscrire', defaultMessage: 'S\'inscrire' })}
        </button>
      </div>
    </div>
  );
};

export default PageAccueille;