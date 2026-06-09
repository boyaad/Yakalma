import React from "react";
import { useParams } from "react-router-dom";
import "../styles/PlatDetail.css";
import { useState } from "react";
function PlatDetail() {
  const { id } = useParams();
  const [quantite, setQuantite] = useState(1);
  const plats = [
    {
      id: 1,
      nom: "Thiéboudienne rouge",
      note: 4.8,
      avis: 156,
      description:
        "Le plat national du Sénégal préparé avec amour. Riz parfumé cuit dans une sauce tomate riche, accompagné de poisson frais, légumes variés (chou, carotte, aubergine, manioc) et épices traditionnelles. Un vrai délice qui ravira vos papilles!",
      vendeur: {
        nom: "Awa Cuisine",
        localisation: "Plateau, Dakar",
        note: 4.8,
        nbPlats: 156,
        photo:
          "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
      },
      prix: 2500,
      temps: "45-60 min",
      image:
        "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      galerie: [
        "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
        "https://images.unsplash.com/photo-1664992960082-0ea299a9c53e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
        "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
      ],
      ingredients: [
        "Riz local",
        "Poisson frais",
        "Tomates",
        "Chou",
        "Carottes",
        "Aubergine",
        "Manioc",
        "Épices maison",
      ],
    },
    {
      id: 2,
      nom: "Yassa poulet citron",
      note: 4.5,
      avis: 29,
      description: "Un délicieux yassa au poulet avec sa sauce citronnée.",
      vendeur: {
        nom: "Chez Fatou",
        localisation: "Mermoz",
        note: 4.2,
        nbPlats: 49,
        photo:
          "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
      },
      prix: 2000,
      temps: "30-45 min",
      image:
        "https://images.unsplash.com/photo-1543826173-1beeb97525d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      galerie: [
        "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
        "https://images.unsplash.com/photo-1664992960082-0ea299a9c53e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
        "https://images.unsplash.com/photo-1664993101841-036f189719b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
      ],
      ingredients: [
        "Riz local",
        "Poisson frais",
        "Tomates",
        "Chou",
        "Carottes",
        "Aubergine",
        "Manioc",
        "Épices maison",
      ],
    },
  ];
  const plat = plats.find((p) => p.id === Number(id));

  if (!plat) {
    return <h2>Plat introuvable</h2>;
  }
  return (
    <div style={{ padding: "20px" }}>
      <img
        src={plat.image}
        alt={plat.nom}
        width="100%"
        height="250"
        style={{ objectFit: "cover", borderRadius: "12px" }}
      />
      <div className="galerie">
        {plat.galerie.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${plat.nom}-${index}`}
            className="miniature"
          />
        ))}
      </div>
      <h2>{plat.nom}</h2>
      <p>
        ⭐ {plat.note} ({plat.avis} avis) ⏱ {plat.temps}
      </p>
      <p>{plat.description}</p>
      <div className="vendeur-card">
        <div className="vendeur-info">
          <img
            src={plat.vendeur.photo}
            alt={plat.vendeur.nom}
            className="vendeur-photo"
          />
          <div>
            <h4>{plat.vendeur.nom}</h4>
            <p>📍 {plat.vendeur.localisation}</p>
          </div>
        </div>
        <div>
          <p>⭐ {plat.vendeur.note}</p>
          <p>{plat.vendeur.nbPlats} plats</p>
        </div>
      </div>
      <h3>Ingredients</h3>
      <div className="ingredients">
        {plat.ingredients.map((ingredient, index) => (
          <span key={index} className="ingredient-tag">
            {ingredient}
          </span>
        ))}
      </div>
      <div className="quantite-container">
        <div className="prix-section">
          <p className="prix-label">Prix</p>
          <p className="prix">{plat.prix} FCFA</p>
        </div>
        <div className="quantite">
          <button onClick={() => quantite > 1 && setQuantite(quantite - 1)}>
            -
          </button>
          <span>{quantite}</span>
          <button onClick={() => setQuantite(quantite + 1)}>+</button>
        </div>
      </div>
      <button className="btn-panier">
        Ajouter au panier - {plat.prix * quantite} FCFA
      </button>
    </div>
  );
}

export default PlatDetail;
