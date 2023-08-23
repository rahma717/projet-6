const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");
const formSelectElement = document.getElementById("category");
// Récupérer l'élément contenant la galerie de photos
const galleryContainer = document.querySelector(".add_Gallery");
// Initialise une liste vide pour les travaux
let worksList = [];
// Initialise une liste vide pour les catégories
let categoriesList = [];
// Initialise une variable pour stocker le filtre sélectionné, par défaut "all"
let filtersSelected = "all";

// Fonction asynchrone pour récupérer les travaux depuis un serveur
const getWorks = async () => {
  try {
  // Effectue une requête HTTP pour obtenir les travaux depuis le serveur
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    // Stocke les travaux récupérés dans la liste worksList
    worksList = data;

     // Appelle la fonction createGallery pour afficher les travaux
    createGallery(worksList);

    // Appelle une autre fonction pour créer des éléments de modal
    createGalleryModalElements(worksList);
  } catch (error) {
    console.error(error);
  }
};
// Fonction pour supprimer les projets existants de la galerie
const removeExistingProjects = () => {
  // Sélectionne tous les éléments HTML avec la classe "gallery figure"
  const existingProjects = document.querySelectorAll(".gallery figure");
   // Supprime chaque projet de la galerie
  existingProjects.forEach((Project) => {
    Project.remove();
  });
};

// Fonction pour créer la galerie d'images en utilisant les travaux
const createGallery = (worksList) => {
  //appel la fonction pour Supprimer les projets existants de la galerie
  removeExistingProjects();
  //effacer le contenu html de l'element avec la classe "gallery"
  galleryElement.innerHTML = " ";

  // Maintenant, vous pouvez ajouter les nouveaux projets à la galerie

  // Parcourt la liste des travaux
  worksList.forEach((work) => {
    // Crée des éléments HTML pour chaque travail
    const figureElement = document.createElement("figure");
    const galleryImg = document.createElement("img");
    const galleryFigCaption = document.createElement("figcaption");

   // Configure l'image avec l'URL et l'attribut "alt"
    galleryImg.crossOrigin = "anonymous";
    galleryImg.src = work.imageUrl;
    galleryImg.alt = work.title;

     // Configure la légende de l'image
    galleryFigCaption.innerHTML = work.title;

    // Ajoute un attribut "data-id" à la figure pour stocker l'ID du travail
    figureElement.setAttribute("data-id", work.id);

     // Ajoute les éléments créés à la figure
    figureElement.append(galleryImg);
    figureElement.append(galleryFigCaption);

    // Ajoute la figure à l'élément avec la classe "gallery"
    galleryElement.append(figureElement);
  });
};
// supprimer les photos de modals en utilsant ID
async function deleteWork(workId) {
  try {
    // Effectue une requête HTTP DELETE pour supprimer le travail spécifié
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },// Ajoute un en-tête d'autorisation avec un jeton (token)
    });
   // Vérifie si la réponse du serveur a un code de statut 204 (Pas de contenu)
    if (response.status === 204) {
      // Si la suppression est réussie (code de statut 204),
      // affiche un message de succès dans la console
      console.log("Travail supprimé avec succès");
      // Vous pouvez maintenant rafraîchir la galerie pour afficher les travaux mis à jour.
      // Appelez la fonction getWorks() pour mettre à jour la galerie.
      getWorks();
    } else {
       // Si la suppression échoue (autre code de statut), affiche une erreur dans la console
      console.error("Erreur lors de la suppression du travail");
    }
  } catch (error) {
    // Gère toute erreur qui pourrait se produire lors de la requête ou du traitement de la réponse
    console.error(error);
  }
}
//  la fonction createFilteredWorksList prend categoryId comme argument
const createFilteredWorksList = (categoryId) => {
   // Vérifie si categoryId est égal à "all"
  if (categoryId === "all") {
     // Si categoryId est "all", affiche tous les travaux en utilisant createGallery
    createGallery(worksList);
  } else {
    // Si categoryId n'est pas "all", crée une liste filtrée des travaux
    const filteredList = worksList.filter((work) => {
      // Utilise la fonction de rappel pour vérifier si la catégorie du travail correspond à categoryId (après conversion en nombre)
      return work.categoryId === Number(categoryId);
    });
    // Affiche les travaux filtrés en utilisant createGallery
    createGallery(filteredList);
  }
};

// créer des options à ajouter dans la modal
const createoptionsSelectForm = (optionsList) => {
  // Création de l'option "Tous"
    const optionOne = document.createElement("option");
    optionOne.value = "";
    optionOne.innerHTML = "";

    formSelectElement.add(optionOne);
    // Parcours de chaque catégorie dans optionsList
    optionsList.forEach((category) => {
    // Création de l'élément option
      const optionElement = document.createElement("option");
      optionElement.value = category.id;
      optionElement.innerHTML = category.name;
  // Ajout de l'option à formSelectElement
      formSelectElement.add(optionElement);
    }); 
};

const getCategories = async () => {
  try {
    // Envoi d'une requête GET au serveur pour récupérer les catégories
    const response = await fetch("http://localhost:5678/api/categories");
     // Attente de la réponse de la requête au format JSON
    const data = await response.json();
    // Stockage des données des catégories dans la variable categoriesList
    categoriesList = data;
    // Affichage des catégories dans la console
    console.log(categoriesList);
    // Itération sur chaque catégorie dans la liste
     categoriesList.forEach((categorie) => {
    // Création d'un élément bouton pour chaque catégorie
      const categoryElement = document.createElement("button");
    // Attribution d'un attribut "data-category-id" contenant l'ID de la catégorie
      categoryElement.setAttribute("data-category-id",categorie.id);
    // Attribution d'une classe CSS "buttonportfolio" à l'élément bouton
      categoryElement.setAttribute("class","buttonportfolio");
    // Définition du texte à afficher sur le bouton en utilisant le nom de la catégorie
      categoryElement.innerHTML=categorie.name;
    // Ajout de l'élément bouton à un conteneur (probablement défini ailleurs dans le code et nommé filtersElement)
      filtersElement.append(categoryElement);
    });
    // Appel d'une fonction createoptionsSelectForm avec la liste des catégories comme argument
    createoptionsSelectForm(categoriesList);
     // Appel d'une fonction getWorks pour récupérer les éléments associés aux catégories
    getWorks();

    // recuperer l'ID de la categorie et rendre mes bouttons fonctionnels
   const filterButtons = document.querySelectorAll(".filters button");
   // Ajouter un gestionnaire d'événements à chaque bouton
    filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
  // Récupérer l'identifiant de la catégorie à partir de l'attribut data-category-id
    const categoryId = button.dataset.categoryId;
    // Mettre à jour la variable filtersSelected avec la catégorie sélectionnée
    filtersSelected = categoryId;
    // Appeler la fonction createFilteredWorksList avec la catégorie sélectionnée
      createFilteredWorksList(filtersSelected);
  });
});
  } catch (error) {
     // Gestion des erreurs : toute erreur est affichée dans la console
    console.error(error);
  }
};

// Appel des fonctions pour récupérer les données du back-end et créer la galerie

getCategories();
createFilteredWorksList(filtersSelected);


  // Fonction pour supprimer un élément
  const deleteItem = async (id) => {
  try {
    // Obtention du jeton d'authentification de l'utilisateur
    const token = getToken();
    // vérifier si l'utilisateur est connecté et a les autorisations
    if (!token) {
        // Si l'utilisateur n'a pas de jeton, une erreur est levée
      throw new Error("User not authenticated!");
    }
   // Envoi d'une requête DELETE au serveur avec l'ID de l'élément à supprimer
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },// Utilisation du jeton d'authentification dans l'en-tête
    });
  // Vérification du statut de la réponse
    if (response.status === 204) {
      // Si le statut de la réponse est 204 , la suppression a réussi
     // La fonction fetchGallery() est appelée pour mettre à jour la galerie
      fetchGallery();
      console.log(`Item with id ${id} deleted successfully.`);
    } else {
      // Si le statut de la réponse n'est pas 204, la suppression a échoué
      throw new Error(`Failed to delete item with id ${id}.`);
    }
  } catch (error) {
    // Gestion des erreurs : toute erreur est affichée dans la console
    console.error(error.message);
  }
};


// Fonction pour créer un élément de galerie pour chaque photo
function createGalleryModalElements(data) {
    // Efface le contenu actuel de la galerie
  galleryContainer.innerHTML = " ";
  var i = 0;
  // Parcours des données (travaux) reçues en argument
  data.forEach((work) => {
    i++;
    // Crée un élément <div> pour chaque travail
    const divElement = document.createElement("div");
    // Crée un élément <img> pour afficher l'image
    const imageElement = document.createElement("img");
    // Crée un icône de suppression
    const deleteIcon = document.createElement("i");
    // Crée un paragraphe pour l'édition
    const editParagraph = document.createElement("p");
    
   // Crée un icône pour déplacer (uniquement pour le premier élément)
    const moveIcon = document.createElement("i");
    
    // Définit la classe CSS pour l'icône de suppression
    deleteIcon.className = "fas fa-trash-can delete_icon";
    // Définit la classe CSS pour l'icône de déplacement (uniquement pour le premier élément)
    moveIcon.className = "fa-solid fa-arrows-up-down-left-right";
     // Définit la source de l'image en utilisant l'URL de l'image du travail
    imageElement.src = work.imageUrl;
      // Ajoute un écouteur d'événements au clic sur l'icône de suppression
    deleteIcon.addEventListener("click", async () => {
      try {
         // Envoie une requête HTTP DELETE pour supprimer le travail
        const response = await fetch(
          `http://localhost:5678/api/works/${work.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 204) {
      // Si la suppression réussit, affiche un message de succès et met à jour la galerie
          console.log("Travail supprimé avec succès");

          getWorks();
        } else {
        // En cas d'erreur lors de la suppression, affiche un message d'erreur
          console.error("Erreur lors de la suppression du travail");
        }
      } catch (error) {
         // Gère les erreurs potentielles lors de la requête
        console.error(error);
      }
    });
 // Définit le texte du paragraphe d'édition
    editParagraph.textContent = "éditer";
   // Définit la position relative pour l'élément <div>
    divElement.style.position = "relative";
   // Ajoute les éléments à l'élément <div>
    divElement.appendChild(imageElement);
    divElement.appendChild(deleteIcon);
   // Ajoute l'icône de déplacement uniquement pour le premier élément
    if (i == 1) {
      divElement.appendChild(moveIcon);
    }
    divElement.appendChild(editParagraph);
 // Ajoute l'élément <div> à la galerie
    galleryContainer.appendChild(divElement);
  });
}
// Appeler la fonction pour récupérer les photos et les afficher dans le modal
getWorks();
