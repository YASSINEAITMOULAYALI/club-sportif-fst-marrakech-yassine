import { state } from "./state.js";

export function obtenirClientCommande(commande) {
  return state.customers.find(client => client.id === commande.customerId) ?? null;
}

export function obtenirProduitLigne(ligne) {
  return state.products.find(produit => produit.id === ligne.productId) ?? null;
}

export function calculerMontantLigne(ligne) {
  const produit = obtenirProduitLigne(ligne);
  return produit ? produit.price * ligne.quantity : 0;
}

export function calculerTotalCommande(commande) {
  let total = 0;
  commande.items.forEach(ligne => { total += calculerMontantLigne(ligne); });
  return total;
}

export function obtenirCommandesEnrichies() {
  return state.orders.map(commande => {
    const client = obtenirClientCommande(commande);
    return {
      ...commande,
      customer: client,
      customerName: client ? client.name : "Client introuvable",
      customerCity: client ? client.city : "Ville inconnue",
      total: calculerTotalCommande(commande)
    };
  });
}

export function obtenirIndicateurs() {
  let montantCumule = 0;
  state.orders.forEach(commande => { montantCumule += calculerTotalCommande(commande); });
  return {
    clients: state.customers.length,
    produits: state.products.length,
    commandes: state.orders.length,
    montantCumule
  };
}

export function obtenirCommandesFiltrees() {
  const texte = state.search.trim().toLocaleLowerCase("fr");
  return obtenirCommandesEnrichies().filter(commande => {
    const correspondRecherche = !texte ||
      commande.customerName.toLocaleLowerCase("fr").includes(texte) ||
      String(commande.id).includes(texte);
    const correspondStatut = state.selectedStatus === "Tous" || commande.status === state.selectedStatus;
    const correspondCategorie = state.selectedCategory === "Toutes" || commande.items.some(ligne => {
      const produit = obtenirProduitLigne(ligne);
      return produit && produit.category === state.selectedCategory;
    });
    return correspondRecherche && correspondStatut && correspondCategorie;
  });
}

export function obtenirDetailCommande(id) {
  const commande = state.orders.find(element => element.id === Number(id));
  if (!commande) return null;
  const client = obtenirClientCommande(commande);
  const lignes = commande.items.map(ligne => {
    const produit = obtenirProduitLigne(ligne);
    return {
      productName: produit ? produit.name : "Produit introuvable",
      category: produit ? produit.category : "Inconnue",
      price: produit ? produit.price : 0,
      quantity: ligne.quantity,
      lineTotal: produit ? produit.price * ligne.quantity : 0
    };
  });
  return {
    ...commande,
    customerName: client ? client.name : "Client introuvable",
    customerCity: client ? client.city : "Ville inconnue",
    lines: lignes,
    total: lignes.reduce((somme, ligne) => somme + ligne.lineTotal, 0)
  };
}

export function obtenirCategories() {
  return [...new Set(state.products.map(produit => produit.category))].sort();
}
