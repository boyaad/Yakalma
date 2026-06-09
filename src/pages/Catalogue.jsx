import React from "react";
import PlatCard from "../components/PlatCard";
import "../styles/Catalogue.css";

function Catalogue() {
  const plats = [
    {
      id: 1,
      nom: "Thiéboudienne rouge",
      vendeur: "Awa Cuisine",
      localisation: "Plateau",
      note: 4.8,
      disponible: true,
      prix: 2500,
      image:
        "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      id: 2,
      nom: "Yassa poulet citron",
      vendeur: "Chez Fatou",
      localisation: "Almadies",
      note: 4.9,
      disponible: true,
      prix: 2000,
      image:
        "https://images.unsplash.com/photo-1543826173-1beeb97525d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      id: 3,
      nom: "Mafé boeuf",
      vendeur: "Délices d'Aminata",
      localisation: "Mermoz",
      note: 4.7,
      disponible: false,
      prix: 2200,
      image:
        "https://images.unsplash.com/photo-1665332561290-cc6757172890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      id: 4,
      nom: "Thieb blanc poisson",
      vendeur: "Awa Cuisine",
      localisation: "Plateau",
      note: 4.8,
      disponible: true,
      prix: 2300,
      image:
        "https://images.unsplash.com/photo-1664992960082-0ea299a9c53e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      id: 5,
      nom: "Mafé poulet",
      vendeur: "Délices d'Aminata",
      localisation: "Mermoz",
      note: 4.6,
      disponible: true,
      prix: 1800,
      image:
        "https://images.unsplash.com/photo-1644946762933-8716dd20d0b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      id: 6,
      nom: "Thiéb guinar",
      vendeur: "Awa Cuisine",
      localisation: "Plateau",
      note: 4.9,
      disponible: true,
      prix: 2400,
      image:
        "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      id: 7,
      nom: "Jus bissap frais",
      vendeur: "Boisson de Mariama",
      localisation: "Point E",
      note: 4.5,
      disponible: true,
      prix: 500,
      image:
        "https://images.unsplash.com/photo-1506802913710-40e2e66339c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      id: 8,
      nom: "Thiakry vanille",
      vendeur: "Douceurs Sénégalaises",
      localisation: "Sacré Coeur",
      note: 4.7,
      disponible: true,
      prix: 800,
      image:
        "https://images.unsplash.com/photo-1665833613236-7c1d087463b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
  ];
  return (
    <div>
      <h1>Explorer</h1>
      <div className="plats-grid">
        {plats.map((plat) => (
          <PlatCard
            key={plat.id}
            id={plat.id}
            nom={plat.nom}
            vendeur={plat.vendeur}
            localisation={plat.localisation}
            note={plat.note}
            disponible={plat.disponible}
            prix={plat.prix}
            image={plat.image}
          />
        ))}
      </div>
    </div>
  );
}

export default Catalogue;
