import React from 'react';

// Paramètres pour un champ de formulaire
interface ChampProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number'; 
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

// Composant qui représente un champ de formulaire
const Champ = (props: ChampProps) => {
  return (
    <div className="vertical">
      <label>{props.label}</label>
      <input
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
      />
    </div>
  );
};

export default Champ;
