import { useLangue } from '../contexts/langue.context';

// Composant pour changer la langue
const LangueSelecteur = () => {
    const { langue, setLangue } = useLangue();

    return (
        <div>
            <select className='selectionneur' value={langue} onChange={(event) => setLangue(event.target.value)}>
                <option value="fr">Français</option>
                <option value="en">English</option>
            </select>
        </div>
    );
};

export default LangueSelecteur;
