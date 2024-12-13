import { useState } from 'react';
import Champ from './champ.component';
import { useNavigate } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { generateToken, getUserByEmailAndPassword } from '../services/api';
import LangueSelecteur from './langueSelecteur.component'

// Page pour connecter un utilisateur
const PageConnexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();
  const intl = useIntl();

  // Fonction qui authentifie un utilisateur
  const authentifier = async () => {
    try {
      const tokenResponse = await generateToken(email, motDePasse);
      const token = tokenResponse?.token;

      if (token) {
        localStorage.setItem('token', token);

        const userResponse = await getUserByEmailAndPassword(email, motDePasse, token);
        const userId = userResponse?.id;

        if (userId) {
          localStorage.setItem('userId', userId);
          navigate('/entrainements/public');
          return;
        } else {
          throw new Error('');
        }
      } else {
        setErreur(intl.formatMessage({ id: 'connexion.erreurCompteNonValide', defaultMessage: 'Email ou mot de passe incorrect.' }));
      }
    } catch (error) {
      setErreur(intl.formatMessage({ id: 'connexion.erreurConnexion', defaultMessage: 'Erreur lors de la connexion. Veuillez réessayer.' }));
    }
  };

  return (
    <div className="conteneur">
      <LangueSelecteur></LangueSelecteur>
      <h1>
        <FormattedMessage id="connexion.titre" defaultMessage="Connecte toi" />
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <Champ
          label={intl.formatMessage({ id: 'connexion.emailLabel', defaultMessage: 'Email* :' })}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Champ
          label={intl.formatMessage({ id: 'connexion.mdpLabel', defaultMessage: 'Mot de passe* :' })}
          type="password"
          value={motDePasse}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
        <button type="submit" onClick={authentifier}>
          <FormattedMessage id="connexion.connectionButton" defaultMessage="Se connecter" />
        </button>
      </form>
      <p>
        <FormattedMessage id="connexion.pasDeCompte" defaultMessage="Pas de compte ? :" />
        {' '}
        <button onClick={() => navigate('/inscription')}>
          <FormattedMessage id="connexion.inscription" defaultMessage="S'inscrire" />
        </button>
      </p>
    </div>
  );
};

export default PageConnexion;