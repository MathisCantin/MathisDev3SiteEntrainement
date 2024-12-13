import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageAccueil from './components/pageAccueil.component';
import PageConnexion from './components/pageConnexion.component';
import PageInscription from './components/pageInscription.component';
import PageEntrainements from './components/pageEntrainements.component';
import PageEntrainement from './components/pageEntrainement.component';
import PageAjouteEntrainement from './components/pageAjoutEntrainement.component';
import PageModifierEntrainement from './components/pageModifierEntrainement.component';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageAccueil />} />
        <Route path="/connexion" element={<PageConnexion />} />
        <Route path="/inscription" element={<PageInscription />} />
        <Route 
          path="/entrainements/public" 
          element={<PageEntrainements personel={false} />}
        />
        <Route 
          path="/entrainements/personel" 
          element={<PageEntrainements personel={true} />}
        />
        <Route 
          path="/entrainement" 
          element={<PageEntrainement/>}
        />
        <Route path="/entrainements/ajouter" element={<PageAjouteEntrainement />} />
        <Route path="/entrainements/modifier" element={<PageModifierEntrainement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;