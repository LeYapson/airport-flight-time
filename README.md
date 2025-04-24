# TP Vue - B3 - Dev


A chaque étape du TP, reportez vous à la documentation officielle de VueJS si vous ne savez pas comment utiliser l'outil conseillé (certaines parties du TP présentent un lien vers l'outil en question)


## 1 Installation de l'environnement
Installation de l’environnement avec Vite et le template VueJS 
```bash
npm create vite@latest airport-app -- --template vue
```
npm Install pour installer les dépendances
Faire le ménage dans l’application, supprimer les fichiers qui vous semblent inutiles
Installer une lib type PrimeFlex pour styliser votre application ou une librairie de votre choix (ex: https://minstyle.io/,https://picocss.com/docs)
Pour faciliter l'initiation, préférer l'utilisation des Single File Component - SFC.

## 2 Créer une ref et afficher les données
Créer une ref avec comme valeur “Montpellier Airport” 
// const title = ref("");
Afficher la valeur de cette ref dans le template à l’aide de {{ }} dans App.vue
Créer dans le template une navigation sommaire : un menu de 2 items : Flights Departure / Flights Arrival
#3 Créer un premier composant avec ses props
Créer un composant pour afficher un seul vol à partir de données statiques, nommez ce composant <Flight>, créer le fichier Flight.vue pour le sauvegarder
Créer dans ce composant une seule propriété flightDetail qui correspond à un object avec le détail du vol (numéro de vol, ville de destination …) à l’aide de defineProps()
Dans le composant App.vue, déclarer un vol fictif pour tester l'appel du composant avec des données
```javascript	
const randomFlight = {
  flight_number: "AA123",
  destination_airport_code: "LAX",
  city: "Los Angeles",
  company: "American Airlines",
  departure_time: "08:30",
  status: "On Time"
};
```
Appeler le composant <Flight /> et passer la valeur du vol fictif à la propriété flightDetail
Tester et vérifier que l’affichage des données est conforme
Ajouter un minimum de mise de forme pour obtenir le résultat escompté (colonnage, couleur, enchainement des lignes)
#4  Afficher un rendu de liste et un rendu de classe conditionnel
Il s’agit d’afficher maintenant tous les vols en s’appuyant sur le composant créé ci dessus

Dans App.vue , importer le fichier JSON qui référence tous les vols au départs, on travaille ici sur des données statiques
// import flightsListDeparture from './data/flights-departure.json'
Utiliser la directive v-for pour afficher le <Flight /> autant de fois qu’il existe de vols dans le fichier JSON ci dessus
A l’aide de class binding ( :class ) ds le composant <Flight>, afficher le statut des vols en retard en orange, les vols annulés en rouge
#5 Afficher un message éphémère (s'affiche et disparait au clic)
Créer dans App.vue dans le template un bouton “Display traffic status”
Puis un encart permettant d’afficher un message concernant le trafic, masqué par défaut
Créer une ref dialogShow = true et dialogLabel=“Strike on 8-05-2025”
A l’aide de la directive v-show,  afficher le message suivant la valeur de dialogShow
Rajouter un gestionnaire d'évènement sur le bouton, @click="" , cette méthode doit inverser la valeur de dialogShow (toggle true / false), pensez à prévoir un bouton "close" pour fermer cette boite de dialogue. 
Gérer la transition à l'aide du composant natif <Transition> https://vuejs.org/guide/built-ins/transition de VueJs pour faire afficher le bloc de manière progressive
// App.vue
const dialogShow = ref(false);
const dialogLabel = ref("Strike on 8-05-2025")
## 6 Indiquer à l'utilisateur les vols passés
Afficher de manière grisée les vols passées sans les supprimer en se basant sur l’heure de départ du vol et l’heure courante (let currentTime = new Date() );

## 7 Récupérer l'input utilisateur et le binder v-model
Objectif :  Créer un filtre de recherche par code airline company, si l’utilisateur saisit AF, seuls les vols Air France s’affichent.

Créer un composant FilterFlights dans lequel se trouve un input text + un bouton Search by Company + un bouton Reset
Créer une ref searchInput et binder (two way) cette ref au champ de formulaire à l'aide  v-model=“searchInput”
https://vuejs.org/guide/components/v-model.html
Afficher la valeur de searchInput dans un <h4> au dessus du champ de formulaire (pour tester le two-way binding)
Modifier la valeur du champ de formulaire, assurez vous qu'elle est modifiée aussi ds le <h4>
#8 Créer une ref et capter l'évènement au niveau du parent
En cliquant sur le bouton Search By Company, seuls les flights concernés doivent s’afficher. Il faut ici filtrer les données.

Pour cela, il va falloir définir dans le parent la fonction à exécuter lorsque qu’on clique sur le bouton Search, pour cela il faut utiliser la fonctionnalité $emit pour émettre et écouter un événement dans un composant enfant

Dans app.vue, 

Créer une ref searchFlightInput
Créer une méthode handleSearchFilterFlight(input)
Appeler la méthode lors de l'utilisation du  composant enfant à savoir  <FilterFlights @handle-search=“handleSearchFilterFlight”>
Dans le composant enfant <FilterFlights>, utiliser @click=“$emit(‘handleSearch’, searchInput)” - handleSearch est utilisé comme une props -  sur le bouton "Search By Company"
https://vuejs.org/guide/components/events.html#emitting-and-listening-to-events

Tester le clic sur Search By Company : il doit renvoyer la valeur saisie. Dans le composant parent avec un console.log(), afficher cette valeur grace à la méthode handleSearchFilterFlight.

handleSearchFilterFlights(input) doit ensuite permettre de mettre à jour la ref searchFlightInput pour permettre ensuite le filtrage.

Récapitulatif
App.vue


ref: searchFlightInput
method : handleSearchFilterFlights(input)
// input est récupéré depuis le composant FilterFlights
FilterFlights.vue


ref: searchInput
prop : handleSearch 
event handler $emit sur le bouton avec utilisation de handleSearch + paramètre searchInput
v-model pour binder la ref (saisie de l'utilisateur)


## 9 Afficher les données filtrées (suivant la saisie de l'utilisateur)
Mettre en place le filtrage effectif par company code en utilisant computed() pour calculer une ref complexe

Créer une constante filteredFlighs avec l’outil computed () - https://vuejs.org/guide/essentials/computed.html
Si searchFlightInput n'est pas vide et que le bouton Search by Company a été cliqué,
> Faire une copie de la liste complète des vols
> Filtrer la liste des vols suivant les lettres saisies (les premières lettres) du numéro de vol
Faire évoluer votre directive v-for sur <Flight> pour qu'elle utilise désormais la liste filteredFlighs
Pour améliorer la logique de l’application, classer les vols par heure de départ
Si la recherche renvoie 0 résultat, informer l’utilisateur avec un message explicite
## 10 Créer un bouton pour réinitialiser le filtre
Rajouter la méthode sur le bouton Reset, au clic , afficher à nouveau tous les vols sans filtre

## 11 Affichage dynamique du filtre
Masquer le composant <FilterFlights> par défaut (v-show),
 Créer un lien "Display filters", si l'utilisateur clique sur ce lien, le filtre apparait / disparait  (toggle)
## 12 Rendre actif les liens flights arrival / flights departure
Créer une ref qui enregistre le lien / bouton actif, par défaut les vols au départ s'affichent
Rajouter un gestionnaire d'évènement sur les tabs Arrivals / Departures pour modifier cette réf au click
Par défaut, charger les vols au départ, si l'utilisateur clique sur l'un des boutons, charger la liste des vols correspondants (vols au départ - departure, vols à l'arrivée - arrival)
Vous remarquerez que les informations présentes dans ces 2 sources de données concernant un vol ne sont pas strictement les mêmes (vol au départ et vol à l'arrivée n'ont pas les mêmes infos), comment faire pour assurer un affichage conforme ? Utiliser les outils de VueJS pour gérer cette problématique.
## 13 Faire évoluer votre application, utilisation de la fonction router de vue
Mettre en place un routing avec 2 liens Flight Departure / Flights arrival, utiliser vue routing pour cela

>> Voir vue-router

Créer deux composants FlightsDeparture et FlightsArrival et utiliser le routing pour mettre en place le fonctionnement demandé. my-app.fr/departues et my-app.fr/arrivals doivent pointés vers les bons composants.

## 14 Appel asynchrone
Simuler l’appel à une API (mocki API par example, https://mocki.io/fake-json-api) ;
Charger les vols de manière asynchrone avec onMounted 
## 15 Créer un suivi, suivre un vol ou plusieurs vols
Sur chaque vol, rajouter un eicône [Follow], ce bouton ouvre une fenêtre modale, 

Dans cette fenêtre modale, on retrouve le numéro du vol, un champ de formulaire pour saisir un mail et un bouton : Follow Flight Number XXX

Quand l'utilisateur valide le vol à tracker, placer un badge sur ce vol  dans la liste qui indique que ce vol est désormais suivi par l'utilisateur.

