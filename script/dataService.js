
const CLE_INSCRIPTIONS = "clubSportifFST_inscriptions";

// Lire les inscriptions sauvegardées dans le navigateur
export function obtenirInscriptions() {
  try {
    const donnees = localStorage.getItem(CLE_INSCRIPTIONS);

    return donnees ? JSON.parse(donnees) : [];
  } catch (erreur) {
    console.error("Impossible de lire les inscriptions :", erreur);
    return [];
  }
}

// Enregistrer une nouvelle inscription
export function enregistrerInscription(inscription) {
  const inscriptions = obtenirInscriptions();

  inscriptions.push({
    ...inscription,
    dateCreation: new Date().toISOString()
  });

  try {
    localStorage.setItem(
      CLE_INSCRIPTIONS,
      JSON.stringify(inscriptions)
    );

    return true;
  } catch (erreur) {
    console.error("Impossible d'enregistrer l'inscription :", erreur);
    return false;
  }
}

// Charger un fichier JSON
export async function chargerFichierJSON(chemin) {
  const reponse = await fetch(chemin);

  if (!reponse.ok) {
    throw new Error(
      `Impossible de charger le fichier : ${chemin}`
    );
  }

  return await reponse.json();
}
