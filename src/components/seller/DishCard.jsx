import { useState } from "react";
import { Edit, Trash2, Power, Star, ShoppingBag } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

export function DishCard({ dish, statusInfo, onDelete, onEdit }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl border border-border-warm hover:shadow-md transition-all overflow-hidden">
        <div className="relative">
          <img
            src={dish.image_url}
            alt={dish.titre}
            className="w-full h-40 object-cover"
          />
          <Badge
            variant={dish.status}
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 backdrop-blur-sm normal-case tracking-normal font-medium"
          >
            <Power className="w-3 h-3" />
            {statusInfo.text}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base mb-2 truncate">{dish.titre}</h3>
          <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="font-semibold text-foreground">{dish.rating}</span>
              <span className="text-xs">({dish.reviews})</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              <span>{dish.orders} ventes</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border-warm">
            <div>
              <div className="text-2xl font-bold text-primary">
                {dish.prix} FCFA
              </div>
              <div className="text-xs text-muted-foreground">
                Rev: {dish.revenue}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-2 text-foreground hover:bg-muted active:bg-primary active:text-white rounded-lg transition-colors cursor-pointer"
                aria-label={`Modifier ${dish.titre}`}
                onClick={() => onEdit(dish.id)}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 text-foreground hover:bg-error/10 hover:text-error active:bg-error active:text-white rounded-lg transition-colors cursor-pointer"
                aria-label={`Supprimer ${dish.titre}`}
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <p className="mb-6 text-foreground/70">
          Êtes-vous sûr de vouloir supprimer <strong className="text-foreground">"{dish.titre}"</strong> ?
          Cette action est irréversible.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDeleteModal(false)}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onDelete(dish.id);
              setShowDeleteModal(false);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        </div>
      </Modal>
    </>
  );
}
