const form = document.querySelector('form');
const errorMessage = document.querySelector('.error');

//Quand on submit

form.addEventListener('submit', (event) => {
    // On empêche le comportement par défaut
     event.preventDefault();
    //on récupère les 2 champs et on affiche leur valeur
    // sélectionner l'email et le mot de passe
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // vérifier que l'email et le mot de passe sont corrects
    if (!email || !password) {
        errorMessage.innerHTML = "Identifiants erronés";
        return;
    }

    // effectuer la requête HTTP POST pour se connecter
    fetch("http://localhost:5678/api/users/login", {
        method: "post",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (response.ok) {
            // Extraire les données JSON de la réponse
            return response.json();
        } else {
            throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }
    })
    .then(data => {
        // Stocker l'ID utilisateur et le jeton d'authentification dans le localStorage
        localStorage.setItem("userID", data.userID);
        localStorage.setItem("token", data.token);
        window.location.href = '../../index.html';
    })
    .catch(error => {
        errorMessage.innerHTML = "Une erreur s'est produite lors de la connexion. Veuillez réessayer.";
    });
});