export interface Entrainement {
  _id?: string;
  titre: string;
  description: string;
  duree: number;
  date: Date;
  publique: boolean;
  categories: string[];
  repetitions?: number;
  caloriesBrulees: number;
}
  