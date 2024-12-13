export interface Utilisateur {
  _id?: string;
  nom: string;
  email: string;
  motDePasse: string;
  dateInscription: Date;
  entrainements: string[];
}