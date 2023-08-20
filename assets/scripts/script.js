const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");
const formSelectElement = document.getElementById("category");
// Récupérer l'élément contenant la galerie de photos
const galleryContainer = document.querySelector(".add_Gallery");
let worksList = [];
let categoriesList = [];
let filtersSelected = "all";

const getWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    worksList = data;
    createGallery(worksList);
    createGalleryModalElements(worksList);
  } catch (error) {
    console.error(error);
  }
};
const removeExistingProjects = () => {
  const existingProjects = document.querySelectorAll(".gallery figure");
  existingProjects.forEach((Project) => {
    Project.remove();
  });
};

const createGallery = (worksList) => {
  // Supprime les projets existants de la galerie
  removeExistingProjects();
  galleryElement.innerHTML = " ";

  // Maintenant, vous pouvez ajouter les nouveaux projets à la galerie
  
  worksList.forEach((work) => {
    const figureElement = document.createElement("figure");
    const galleryImg = document.createElement("img");
    const galleryFigCaption = document.createElement("figcaption");

    galleryImg.crossOrigin = "anonymous";
    galleryImg.src = work.imageUrl;
    galleryImg.alt = work.title;

    galleryFigCaption.innerHTML = work.title;

    figureElement.setAttribute("data-id", work.id);
    figureElement.append(galleryImg);
    figureElement.append(galleryFigCaption);
    galleryElement.append(figureElement);
  });
};
// supprimer les photos de modals 
async function deleteWork(workId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      console.log("Travail supprimé avec succès");
      // Vous pouvez maintenant rafraîchir la galerie pour afficher les travaux mis à jour.
      getWorks();
    } else {
      console.error("Erreur lors de la suppression du travail");
    }
  } catch (error) {
    console.error(error);
  }
}

const createFilteredWorksList = (categoryId) => {
  if (categoryId === "all") {
    createGallery(worksList);
  } else {
    const filteredList = worksList.filter((work) => {
      return work.categoryId === Number(categoryId);
    });
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
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    categoriesList = data;
    console.log(categoriesList);
     categoriesList.forEach((categorie) => {
      const categoryElement = document.createElement("button");
      categoryElement.setAttribute("data-category-id",categorie.id);
      categoryElement.setAttribute("class","buttonportfolio");
      categoryElement.innerHTML=categorie.name;
      filtersElement.append(categoryElement);
    });
    createoptionsSelectForm(categoriesList);
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
    console.error(error);
  }
};

// Appel des fonctions pour récupérer les données du back-end et créer la galerie

getCategories();
createFilteredWorksList(filtersSelected);


  // Fonction pour supprimer un élément
const deleteItem = async (id) => {
  try {
    const token = getToken();
    // vérifier si l'utilisateur est connecté et a les autorisations
    if (!token) {
      throw new Error("User not authenticated!");
    }

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      fetchGallery();
      console.log(`Item with id ${id} deleted successfully.`);
    } else {
      throw new Error(`Failed to delete item with id ${id}.`);
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Fonction pour créer un élément de galerie pour chaque photo
function createGalleryModalElements(data) {
  galleryContainer.innerHTML = " ";
  var i = 0;
  data.forEach((work) => {
    i++;
    const divElement = document.createElement("div");
    const imageElement = document.createElement("img");
    const deleteIcon = document.createElement("i");
    const editParagraph = document.createElement("p");
    const moveIcon = document.createElement("i");
    ("");
    deleteIcon.className = "fas fa-trash-can delete_icon";
    moveIcon.className = "fa-solid fa-arrows-up-down-left-right";
    imageElement.src = work.imageUrl;

    deleteIcon.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${work.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 204) {
          console.log("Travail supprimé avec succès");

          getWorks();
        } else {
          console.error("Erreur lors de la suppression du travail");
        }
      } catch (error) {
        console.error(error);
      }
    });

    editParagraph.textContent = "éditer";

    divElement.style.position = "relative";

    divElement.appendChild(imageElement);
    divElement.appendChild(deleteIcon);

    if (i == 1) {
      divElement.appendChild(moveIcon);
    }

    divElement.appendChild(editParagraph);

    galleryContainer.appendChild(divElement);
  });
}

// Appeler la fonction pour récupérer les photos et les afficher dans le modal
getWorks();
