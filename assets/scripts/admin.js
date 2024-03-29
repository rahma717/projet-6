const Login = document.getElementById("Login");
const Logout = document.getElementById("Logout");
const nav_bar = document.getElementById("background_header");
const Btn_header = document.getElementById("Btn_header");
const filters = document.querySelector("#portfolio .filters");
const buttonModifier_1 = document.querySelector(".Modifier_1");
const buttonModifier_2 = document.querySelector(".Modifier_2");
const add_photo = document.querySelector(".Add_photo");
const token = localStorage.getItem("token");

filters.style.display = "block";

if (token) {
  Login.style.display = "none";
  Logout.style.display = "block";
  nav_bar.style.display = "flex";
  buttonModifier_1.style.display = "flex";
  buttonModifier_2.style.display = "flex";
  filters.style.display = "none";
} else {
  Login.style.display = "block";
  Logout.style.display = "none";
  nav_bar.style.display = "none";
  buttonModifier_1.style.display = "none";
  buttonModifier_2.style.display = "none";
}
//losqu'on appuie sur le bouton logout, efface le local storage
Logout.addEventListener("click", () => {
  localStorage.clear();
  Logout.href = "./index.html";
  nav_bar.innerHTML = " ";
  nav_bar.style.display = "none";
  Login.style.display = "block";
  filters.innerHTML = " ";

  buttonModifier_1.style.display = "none";
  buttonModifier_2.style.display = "none";
});

// Récupérer le bouton "Modifier" numéro 2
const modifierButton = document.querySelector(".Modifier_2");

// Récupérer le modal
const modal = document.getElementById("modal");
modal.style.display = "none";
const nextModal = document.getElementById("next_modal");
nextModal.style.display = "none";

// Fonction pour ouvrir le modal
function openModal() {
  modal.style.display = "flex";
}

function openNextModal() {
  modal.style.display = "none";
  nextModal.style.display = "flex";
}
// Ajouter un événement de clic pour ouvrir le modal lorsque l'utilisateur clique sur le bouton "Modifier" numéro 2
modifierButton.addEventListener("click", openModal);
add_photo.addEventListener("click", openNextModal);

//recuperer le bouton de fermeture des modals
const closeButtonModal = document.getElementById("modalTwoClose");
const closeButtonNextModal = document.getElementById("modalOneClose");

const arrowback = document.getElementById("arrow_back");
arrowback.addEventListener("click", function () {
  openFirstModal();
  clearForm();
});

function closeModal() {
  modal.style.display = "none";
  nextModal.style.display = "none";
}
function openFirstModal() {
  modal.style.display = "flex";
  nextModal.style.display = "none";
}

//ajouter un evenement de clic pour fermer le modal lorsque lutilisateur clique sur le bouton X
closeButtonNextModal.addEventListener("click", closeModal);
closeButtonModal.addEventListener("click", function () {
  closeModal();
  clearForm();
});
// Utiliser le clic en dehors de la modale pour la refermer
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

//Envoi d’un nouveau projet au back-end via le formulaire de la modale

// Récupérer le formulaire de la modale
const photoForm = document.getElementById("PhotoForm");
const cardAddPhotoElement = document.querySelector(".cardAddphoto");
// Lorsque l'utilisateur choisit un fichier image dans l'input avec l'ID "inputImg"
document.getElementById("inputImg").addEventListener("change", function (e) {
   // Crée une URL pour le fichier image sélectionné
  const fileurl = URL.createObjectURL(e.target.files[0]);
   // Crée un élément <img> et configure son attribut src avec l'URL du fichier
  const newImg = document.createElement("img");
  newImg.src = fileurl;
  newImg.style.height = "100%";
  newImg.style.objectFit = "cover";
// Cache certains éléments dans le conteneur "cardAddPhotoElement"
  cardAddPhotoElement.querySelector("i").style.display = "none";
  cardAddPhotoElement.querySelector("p").style.display = "none";
  cardAddPhotoElement.querySelector("label").style.display = "none";
    // Ajoute l'image nouvellement créée au conteneur
  cardAddPhotoElement.appendChild(newImg);
});
// Lorsque l'utilisateur soumet le formulaire
photoForm.addEventListener("submit", async (event) => {
   // Empêche le comportement par défaut du formulaire (rechargement de la page)
  event.preventDefault();
  // Crée un objet FormData à partir du formulaire
  const formData = new FormData(photoForm);

  try {
      // Envoie une requête POST au serveur avec les données du formulaire
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
      Authorization: `Bearer ${token}`,// Utilise un jeton d'autorisation
      },
      body: formData,// Les données du formulaire sont envoyées dans le corps de la requête
    });

    console.log(response);
    // Si la réponse du serveur est réussie (code de statut 200 OK)
    if (response.ok) {
      console.log("Projet ajouté avec succès");
      // Réinitialise le formulaire, ferme la modale et met à jour la galerie
      clearForm();
      closeModal();
      getWorks();
      
    } else {
      // Si la réponse du serveur n'est pas réussie, affiche une erreur
      console.error("Erreur lors de l'ajout du projet");
    }
  } catch (error) {
       // Gère les erreurs potentielles lors de l'envoi de la requête
    console.error(error);
  }
});
// Fonction pour réinitialiser le formulaire et afficher les éléments masqués
  function clearForm() {
  photoForm.reset();
  const imgForm = cardAddPhotoElement.querySelector("img");
  if (imgForm) {
    cardAddPhotoElement.querySelector("i").style.display = "block";
    cardAddPhotoElement.querySelector("label").style.display = "flex";
    cardAddPhotoElement.querySelector("p").style.display = "block";
    imgForm.remove();
  }
}

//Changer la couleur du bouton "valider" en vert si tous les champs sont bien remplis

// Récupérer tous les champs du formulaire
const inputFields = document.querySelectorAll(
  "#PhotoForm input, #PhotoForm select"
);

// Récupérer le bouton "Valider"
const submitButton = document.getElementById("SubmitBtn");

// Fonction pour vérifier si tous les champs sont remplis
function checkFields() {
  let allFieldsFilled = true;

  inputFields.forEach((input) => {
    if (input.required && input.value.trim() === "") {
      allFieldsFilled = false;
    }
  });

  return allFieldsFilled;
}

// Fonction pour mettre à jour la couleur du bouton "Valider"
function updateSubmitButtonColor() {
  if (checkFields()) {
    submitButton.style.backgroundColor = "#1D6154";
  } else {
    submitButton.style.backgroundColor = ""; // Réinitialisez la couleur par défaut
  }
}

// Ajouter des gestionnaires d'événements pour chaque champ d'entrée
inputFields.forEach((input) => {
  input.addEventListener("input", updateSubmitButtonColor);
});

// Appeler la fonction initiale pour mettre à jour la couleur du bouton
updateSubmitButtonColor();
