import { useState } from 'react';
import Champ from './champ.component';
import { useNavigate } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import LangueSelecteur from './langueSelecteur.component'
import { ajouterUtilisateur, generateToken, getUserByEmailAndPassword } from '../services/api';

// Page pour inscrire un utilisateur
const PageInscription = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();
  const intl = useIntl();

  // Fonction qui inscrit un utilisateur
  const inscription = async () => {
    try {
      const utilisateur = {
        nom: nom,
        email: email,
        motDePasse: motDePasse,
        dateInscription: new Date(),
        entrainements: [],
      };

      const userResponse = await ajouterUtilisateur(utilisateur);
      if (userResponse) {
        const tokenResponse = await generateToken(email, motDePasse);
        const token = tokenResponse?.token;

        if (token) {
          localStorage.setItem('token', token);

          const userData = await getUserByEmailAndPassword(email, motDePasse, token);
          const userId = userData?.id;

          if (userId) {
            localStorage.setItem('userId', userId);
            navigate('/entrainements/public');
          }
        }
      }
      throw new Error('');
    } catch (error) {
      setErreur(intl.formatMessage({ id: 'inscription.erreurInscription', defaultMessage: 'Erreur lors de l\'inscription. Veuillez réessayer.' }));
    }
  };

  return (
    <div className="conteneur">
      <LangueSelecteur></LangueSelecteur>
      <h1>
        <FormattedMessage id="inscription.titre" defaultMessage="Créer un compte" />
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <Champ
          label={intl.formatMessage({ id: 'inscription.nomLabel', defaultMessage: 'Nom:' })}
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <Champ
          label={intl.formatMessage({ id: 'inscription.emailLabel', defaultMessage: 'Email*: ' })}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Champ
          label={intl.formatMessage({ id: 'inscription.mdpLabel', defaultMessage: 'Mot de passe*: ' })}
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
        <button type="submit" onClick={inscription}>
          <FormattedMessage id="inscription.inscriptionButton" defaultMessage="S'inscrire" />
        </button>
      </form>
      <p>
        <FormattedMessage id="inscription.dejaCompte" defaultMessage="Déjà un compte ? " />
        <button onClick={() => navigate('/connexion')}>
          <FormattedMessage id="inscription.seConnecterButton" defaultMessage="Se connecter" />
        </button>
      </p>
    </div>
  );
};

export default PageInscription;