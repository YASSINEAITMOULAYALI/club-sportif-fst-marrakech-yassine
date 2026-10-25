import { chargerFichierJSON, obtenirInscriptions } from "./dataService.js";
import { setCustomers, setProducts, setOrders, setInscriptions, setSearch, setSelectedStatus, setSelectedCategory } from "./state.js";
import { afficherAnnee, afficherErreur, effacerErreur, initialiserFormulaire, render, afficherDetail } from "./view.js";

function initialiserEvenements() {
  const recherche = document.getElementById("searchInput");
  const statut = document.getElementById("statusSelect");
  const categorie = document.getElementById("categorySelect");
  const reset = document.getElementById("resetBtn");
  const commandes = document.getElementById("ordersContainer");

  recherche?.addEventListener("input", event => { setSearch(event.target.value); render(); });
  statut?.addEventListener("change", event => { setSelectedStatus(event.target.value); render(); });
  categorie?.addEventListener("change", event => { setSelectedCategory(event.target.value); render(); });
  reset?.addEventListener("click", () => {
    setSearch(""); setSelectedStatus("Tous"); setSelectedCategory("Toutes");
    if (recherche) recherche.value = "";
    if (statut) statut.value = "Tous";
    if (categorie) categorie.value = "Toutes";
    render();
  });
  commandes?.addEventListener("click", event => {
    const bouton = event.target.closest("[data-order-id]");
    if (bouton) afficherDetail(bouton.dataset.orderId);
  });
}

async function initialiserApplication() {
  afficherAnnee();
  setInscriptions(obtenirInscriptions());
  initialiserFormulaire();
  initialiserEvenements();

  try {
    const [customers, products, orders] = await Promise.all([
      chargerFichierJSON("./data/customers.json"),
      chargerFichierJSON("./data/products.json"),
      chargerFichierJSON("./data/orders.json")
    ]);
    if (!Array.isArray(customers) || !Array.isArray(products) || !Array.isArray(orders)) {
      throw new Error("Les fichiers JSON doivent contenir des tableaux.");
    }
    setCustomers(customers); setProducts(products); setOrders(orders);
    effacerErreur();
    render();
  } catch (erreur) {
    console.error("Erreur pendant le chargement des données du TP4 :", erreur);
    afficherErreur("Les données n'ont pas pu être chargées. Vérifiez les fichiers JSON et leurs chemins, puis rechargez la page.");
    const zone = document.getElementById("ordersContainer");
    if (zone) zone.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-danger">Chargement impossible. Consultez la console du navigateur.</td></tr>';
  }
}

initialiserApplication();
