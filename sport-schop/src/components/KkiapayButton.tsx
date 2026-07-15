import { useEffect } from "react";
import { useKKiaPay } from "kkiapay-react";

type Props = {
  montant: number;
  onSuccess: (transactionId: string) => void;
  disabled?: boolean;
};

const KKIAPAY_PUBLIC_KEY = "f2060400653411ef8a1de375275411b5";

export default function KkiapayButton({ montant, onSuccess, disabled }: Props) {
  const { openKkiapayWidget, addSuccessListener, addFailedListener } = useKKiaPay();

  useEffect(() => {
    addSuccessListener((response: any) => {
      onSuccess(response.transactionId);
    });
    addFailedListener((response: any) => {
      alert("Le paiement a échoué. Réessaie ou choisis un autre moyen de paiement.");
      console.log(response);
    });
  }, []);

  function handleClick() {
    openKkiapayWidget({
      amount: montant,
      key: KKIAPAY_PUBLIC_KEY,
      sandbox: true, // ⚠️ mets à false une fois en production avec ta vraie clé
      reason: "Commande SportShop",
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="w-full bg-orange-500 text-white py-3 text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50"
    >
      Payer avec KKiaPay (Mobile Money / Carte)
    </button>
  );
}