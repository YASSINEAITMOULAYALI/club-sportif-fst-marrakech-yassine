import { enregistrerInscription } from "./dataService.js";
import { ajouterInscription, setMessage } from "./state.js";
import { obtenirCategories, obtenirDetailCommande, obtenirIndicateurs, obtenirCommandesFiltrees } from "./selectors.js";

const formatMAD = montant => new Intl.NumberFormat("fr-MA", {
  style: "currency", currency: "MAD", maximumFractionDigits: 2
}).format(montant);

function echapperHTML(valeur) {
  return String(valeur ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

export function afficherErreur(message) {
  const zone = document.getElementById("errorZone");
  if (!zone) return;
  zone.textContent = message;
  zone.classList.remove("d-none");
}

export function effacerErreur() {
  const zone = document.getElementById("errorZone");
  if (!zone) return;
  zone.textContent = "";
  zone.classList.add("d-none");
}

export function afficherAnnee() {
  const annee = document.getElementById("currentYear");
  if (annee) annee.textContent = new Date().getFullYear();
}

export function afficherIndicateurs() {
  const zone = document.getElementById("statsContainer");
  if (!zone) return;
  const k = obtenirIndicateurs();
  const cartes = [
    { label: "Clients", value: k.clients, icon: "bi-people" },
    { label: "Produits", value: k.produits, icon: "bi-box-seam" },
    { label: "Commandes", value: k.commandes, icon: "bi-receipt" },
    { label: "Montant cumulé", value: formatMAD(k.montantCumule), icon: "bi-currency-exchange" }
  ];
  zone.innerHTML = cartes.map(c => `
    <div class="col-6 col-xl-3"><article class="dashboard-stat h-100">
      <div class="stat-icon"><i class="bi ${c.icon}" aria-hidden="true"></i></div>
      <p>${echapperHTML(c.label)}</p><strong>${echapperHTML(c.value)}</strong>
    </article></div>`).join("");
}

export function afficherCategories() {
  const select = document.getElementById("categorySelect");
  if (!select) return;
  const actuelle = select.value || "Toutes";
  const categories = obtenirCategories();
  select.innerHTML = '<option value="Toutes">Toutes les catégories</option>' + categories.map(c =>
    `<option value="${echapperHTML(c)}">${echapperHTML(c)}</option>`).join("");
  select.value = categories.includes(actuelle) ? actuelle : "Toutes";
}

function badgeStatut(statut) {
  const classes = { "Livree": "text-bg-success", "En attente": "text-bg-warning", "Annulee": "text-bg-danger" };
  return `<span class="badge ${classes[statut] || "text-bg-secondary"}">${echapperHTML(statut)}</span>`;
}

export function afficherCommandes() {
  const zone = document.getElementById("ordersContainer");
  const compte = document.getElementById("resultsCount");
  if (!zone) return;
  const commandes = obtenirCommandesFiltrees();
  if (compte) compte.textContent = `${commandes.length} commande(s) affichée(s)`;
  if (!commandes.length) {
    zone.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-muted">Aucune commande ne correspond aux filtres.</td></tr>';
    return;
  }
  zone.innerHTML = commandes.map(c => `
    <tr>
      <td class="fw-semibold">#${c.id}</td>
      <td><div class="fw-semibold">${echapperHTML(c.customerName)}</div><small class="text-muted">${echapperHTML(c.customerCity)}</small></td>
      <td>${echapperHTML(c.date)}</td><td>${badgeStatut(c.status)}</td>
      <td class="text-end fw-semibold">${formatMAD(c.total)}</td>
      <td class="text-end"><button type="button" class="btn btn-sm btn-outline-primary" data-order-id="${c.id}"><i class="bi bi-eye"></i> Détail</button></td>
    </tr>`).join("");
}

export function afficherDetail(id) {
  const zone = document.getElementById("orderDetail");
  if (!zone) return;
  const c = obtenirDetailCommande(id);
  if (!c) { zone.innerHTML = '<div class="alert alert-warning">Commande introuvable.</div>'; return; }
  const lignes = c.lines.map(l => `<tr><td>${echapperHTML(l.productName)}<br><small class="text-muted">${echapperHTML(l.category)}</small></td><td class="text-end">${formatMAD(l.price)}</td><td class="text-center">${l.quantity}</td><td class="text-end">${formatMAD(l.lineTotal)}</td></tr>`).join("");
  zone.innerHTML = `<div class="order-detail-card">
    <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap"><div>
      <p class="section-kicker mb-1">DÉTAIL DE COMMANDE</p><h3 class="h4">Commande #${c.id}</h3>
      <p class="text-muted">${echapperHTML(c.date)} · ${badgeStatut(c.status)}</p></div>
      <button type="button" id="closeDetailBtn" class="btn btn-sm btn-outline-secondary">Fermer</button></div><hr>
    <div class="row g-3 mb-3"><div class="col-md-6"><span class="detail-label">Client</span><div class="fw-semibold">${echapperHTML(c.customerName)}</div></div>
    <div class="col-md-6"><span class="detail-label">Ville</span><div class="fw-semibold">${echapperHTML(c.customerCity)}</div></div></div>
    <div class="table-responsive"><table class="table align-middle"><thead><tr><th>Produit</th><th class="text-end">Prix</th><th class="text-center">Qté</th><th class="text-end">Montant</th></tr></thead><tbody>${lignes}</tbody>
    <tfoot><tr><th colspan="3" class="text-end">Total calculé</th><th class="text-end">${formatMAD(c.total)}</th></tr></tfoot></table></div></div>`;
  document.getElementById("closeDetailBtn")?.addEventListener("click", () => { zone.innerHTML = ""; });
}

export function render() {
  afficherIndicateurs();
  afficherCategories();
  afficherCommandes();
}

// Formulaire d'inscription déjà présent dans le site, conservé.
export function afficherMessage(message, type = "success") {
  const zone = document.getElementById("formMessage");
  if (!zone) return;
  zone.textContent = message;
  zone.className = `alert alert-${type} mt-3`;
  zone.setAttribute("role", "status");
}

export function initialiserFormulaire() {
  const formulaire = document.getElementById("registrationForm");
  if (!formulaire) return;
  formulaire.addEventListener("submit", event => {
    event.preventDefault();
    const inscription = {
      nom: document.getElementById("nom")?.value.trim() || "",
      email: document.getElementById("email")?.value.trim() || "",
      filiere: document.getElementById("filiere")?.value.trim() || "",
      sport: document.getElementById("sport")?.value || "",
      motivation: document.getElementById("motivation")?.value.trim() || ""
    };
    if (!inscription.nom || !inscription.email || !inscription.filiere || !inscription.sport) {
      afficherMessage("Veuillez remplir tous les champs obligatoires.", "danger"); return;
    }
    if (!enregistrerInscription(inscription)) {
      afficherMessage("L'inscription n'a pas pu être enregistrée dans ce navigateur.", "danger"); return;
    }
    ajouterInscription(inscription);
    const message = `Merci ${inscription.nom} ! Votre demande a été enregistrée dans ce navigateur. Elle n'a pas été envoyée au club.`;
    setMessage(message); afficherMessage(message, "success"); formulaire.reset();
  });
}
