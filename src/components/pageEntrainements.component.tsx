import {
  getEntrainements,
  getEntrainementsByCalorie,
  getEntrainementsByCategorie,
  getEntrainementsByUtilisateur,
  supprime,
} from "../services/api";
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./navigation.component";
import { useIntl, FormattedMessage } from "react-intl";
import { Entrainement as EntrainementType } from "../models/Entrainement";

interface PageEntrainementsProps {
  personel: boolean;
}

// Page pour afficher les entrainements
const PageEntrainements = (props: PageEntrainementsProps) => {
  const [entrainements, setEntrainements] = useState<EntrainementType[]>([]);
  const [caloriesFilter, setCaloriesFiltre] = useState<number | null>(null);
  const [categoryFilter, setCategorieFiltre] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string>("");
  const navigate = useNavigate();
  const intl = useIntl();

  const CategoriesTypes = [
    "Cardio",
    "Force",
    "Endurance",
    "Puissance",
    "Flexibilité",
  ];

  // Fonction pour rechercher les entrainements
  const rechercheEntrainements = async () => {
    try {
      let data;

      if (props.personel) {
        const utilisateurId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (utilisateurId && token) {
          data = await getEntrainementsByUtilisateur(utilisateurId, token);
        }
      } else {
        if (caloriesFilter) {
          data = await getEntrainementsByCalorie(caloriesFilter);
        } else if (categoryFilter) {
          data = await getEntrainementsByCategorie(categoryFilter);
        } else {
          data = await getEntrainements();
        }
      }

      setEntrainements(data.entrainements);
    } catch (error) {
      setErreur(
        intl.formatMessage({
          id: "entrainementsErreurRecuperation",
          defaultMessage: "Erreur lors de la récupération des entraînements",
        })
      );
    }
  };

  useEffect(() => {
    rechercheEntrainements();
  }, [props.personel, caloriesFilter, categoryFilter]);

  // Fonction pour naviguer vers la page détail de l'entrainement
  const navigateToDetail = (identifiant: string | undefined) => {
    if (identifiant) {
      navigate("/entrainement", { state: { identifiant } });
    }
  };

  // Fonction pour modifier un entrainement
  const modifieClick = (entrainement: EntrainementType) => {
    navigate("/entrainements/modifier", { state: { entrainement } });
  };

  // Fonction pour supprimer un entrainement
  const supprimeClick = async (entrainement: EntrainementType) => {
    const result = await supprime(entrainement);

    if (!result) {
      setErreur(
        intl.formatMessage({
          id: "entrainementsErreurSuppression",
          defaultMessage: "Erreur lors de la suppression de l'entraînement",
        })
      );
    } else {
      rechercheEntrainements();
    }
  };

  return (
    <>
      <Navigation page={props.personel ? "entrainementsPerso" : "accueil"} />
      <div className="conteneur">
        <h1>
          <FormattedMessage id={props.personel ? "entrainementsPersonnels" : "entrainementsPublics"}
            defaultMessage={ props.personel ? "Entraînements Personnels" : "Entraînements Publics" }
          />
        </h1>

        {!props.personel && (
          <div className="filtres-container">
            <FormattedMessage
              id="entrainementsFiltres"
              defaultMessage="Filtres"
            />
            <label>
              <FormattedMessage
                id="entrainementsCaloriesLabel"
                defaultMessage="Calories"
              />
            </label>
            <input
              type="number"
              value={caloriesFilter || ""}
              onChange={(e) => {
                setCaloriesFiltre(Number(e.target.value));
                setCategorieFiltre(null);
              }}
              placeholder="Calories"
            />
            <label>
              <FormattedMessage
                id="entrainementsCategorieLabel"
                defaultMessage="Catégorie"
              />
            </label>
            <select
              value={categoryFilter || ""}
              onChange={(e) => {
                setCategorieFiltre(e.target.value);
                setCaloriesFiltre(null);
              }}
            >
              <option value="">
                <FormattedMessage
                  id="entrainementsSelectionnerCategorie"
                  defaultMessage="Sélectionner une catégorie"
                />
              </option>
              {CategoriesTypes.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {erreur ? (
          <p style={{ color: "red" }}>{erreur}</p>
        ) : entrainements && entrainements.length > 0 ? (
          <div>
            {entrainements.map((entrainement) => (
              <div className="bordure" key={entrainement._id}>
                <h3>{entrainement.titre}</h3>
                <p>{entrainement.description}</p>
                <p>
                  <FormattedMessage
                    id="entrainementsDuree"
                    defaultMessage="Durée"
                  />
                  : {entrainement.duree} min
                </p>
                <p>
                  <FormattedMessage
                    id="entrainementsCaloriesBrulees"
                    defaultMessage="Calories Brûlées"
                  />
                  : {entrainement.caloriesBrulees} kcal
                </p>
                <p>
                  <FormattedMessage
                    id="entrainementsDate"
                    defaultMessage="Date"
                  />
                  : {new Date(entrainement.date).toLocaleDateString()}
                </p>
                <p>
                  <FormattedMessage
                    id="entrainementsRepetitions"
                    defaultMessage="Répetitions"
                  />
                  : {entrainement.repetitions}
                </p>
                <p>
                  <FormattedMessage
                    id="entrainementsCategories"
                    defaultMessage="Catégories"
                  />
                  {entrainement.categories.map((category, index) => (
                    <Fragment key={category}>
                      {index > 0 && ", "}
                      <FormattedMessage
                        id={`categories.${category}`}
                        defaultMessage={category}
                      />
                    </Fragment>
                  ))}
                </p>
                <button onClick={() => navigateToDetail(entrainement._id)}>
                  <FormattedMessage
                    id="entrainementsDetailButton"
                    defaultMessage="Détail"
                  />
                </button>
                {props.personel && (
                  <>
                    <button
                      className="marginLeft"
                      onClick={() => modifieClick(entrainement)}
                    >
                      <FormattedMessage
                        id="entrainementsModifierButton"
                        defaultMessage="Modifier"
                      />
                    </button>
                    <button
                      className="rouge"
                      onClick={() => supprimeClick(entrainement)}
                    >
                      <FormattedMessage
                        id="entrainementsSupprimerButton"
                        defaultMessage="Supprimer"
                      />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>
            <FormattedMessage
              id="entrainementsAucunEntrainement"
              defaultMessage="Aucun entraînement disponible"
            />
          </p>
        )}
      </div>
    </>
  );
};

export default PageEntrainements;
