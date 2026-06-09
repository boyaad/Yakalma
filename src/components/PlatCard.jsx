import { Link } from "react-router-dom";
import "../styles/PlatCard.css";
function PlatCard(props) {
  return (
    <Link
      to={`/plats/${props.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="plat-card">
        <div className="badge">
          {props.disponible ? "Disponible" : "Indisponible"}
        </div>
        <img src={props.image} alt={props.nom} width="100%" height="150" />
        <div className="plat-content">
          <h3>{props.nom}</h3>
          <p>
            {props.vendeur} . {props.localisation}
          </p>
          <div className="prix-note">
            <span>{props.prix} FCFA</span>
            <span>⭐ {props.note}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default PlatCard;
