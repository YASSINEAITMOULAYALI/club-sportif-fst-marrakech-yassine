# Club Sportif FST Marrakech — TP4 JavaScript

## Présentation
Le projet conserve le site du Club Sportif FST Marrakech et ajoute un tableau de bord interactif de commandes alimenté par trois fichiers JSON.

## Structure
- `index.html` : structure de la page et emplacement du tableau de bord.
- `css/style.css` : style du site et du tableau de bord.
- `data/customers.json` : clients.
- `data/products.json` : produits et prix.
- `data/orders.json` : commandes, identifiants client/produit, quantités, statut et date.
- `script/dataService.js` : chargement JSON avec fetch et stockage local du formulaire.
- `script/state.js` : état central et filtres.
- `script/selectors.js` : relations, calculs, indicateurs et filtres.
- `script/view.js` : rendu HTML et détail d'une commande.
- `script/app.js` : initialisation et événements.

## Fonctionnalités TP4
- Chargement asynchrone des 3 fichiers JSON avec `fetch`, `async/await`, vérification `response.ok` et `try/catch`.
- Relations `customerId` et `productId`.
- Calcul des montants à partir du prix et de la quantité, sans total codé en dur dans `orders.json`.
- Indicateurs clients, produits, commandes et montant cumulé.
- Recherche par nom du client ou numéro de commande.
- Filtres combinés par statut et catégorie.
- Détail des lignes d'une commande et calcul du total.
- Erreur affichée dans la page et dans la console si le chargement échoue.
- Formulaire d'inscription du site conservé.

## Lancer le projet
1. Ouvrir le dossier dans Visual Studio Code.
2. Lancer `index.html` avec **Live Server** ou un serveur HTTP local.
3. Ne pas ouvrir directement en `file://` : `fetch()` doit accéder aux JSON via HTTP.
4. Si les données n'apparaissent pas, ouvrir les outils développeur avec `F12`, puis regarder Console et Network.

## Technologies
HTML5, CSS3, Bootstrap 5, JavaScript modules, JSON, Git et GitHub.
