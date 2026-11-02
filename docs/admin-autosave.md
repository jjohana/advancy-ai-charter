# Sauvegarde progressive du questionnaire ADMIN

Chaque réponse validée est enregistrée automatiquement dans D1. Le participant voit le nombre de réponses confirmé par le serveur. Une erreur de connexion affiche un message et une action pour réessayer ; la copie locale reste disponible lorsque le navigateur autorise ce stockage.

Le lien commun ou l’adresse du questionnaire permet de reprendre après fermeture de l’onglet dans le même navigateur, grâce à une invitation personnelle mémorisée jusqu’à son expiration. Le lien commun est lié à cette invitation par une empreinte SHA-256. Un autre lien commun ou une invitation individuelle explicite ne récupère pas cette association. « Oublier mon accès sur cet appareil » retire les éléments locaux sans effacer les données en base.

Les sauvegardes intermédiaires ne consomment aucune tentative. Le bouton « Envoyer le questionnaire » conserve son rôle : enregistrer le résultat officiel, les commentaires facultatifs et le reçu définitif. Les 20 questions, la version r3, les anciens reçus et la limite de trois tentatives sont conservés.

Les écritures de progression sont authentifiées et réservées au questionnaire français ADMIN. Le serveur protège les préfixes de réponses et les réinitialisations de façon atomique. Un ancien onglet ne peut pas écraser un brouillon plus récent ni envoyer une tentative réinitialisée. Un reçu déjà enregistré demeure rejouable sans doublon.

La migration additive 0004 crée les brouillons et les identifiants de réinitialisation. Leur suppression suit la suppression de l’affectation du participant, donc la durée de conservation existante. Aucun jeton brut n’est ajouté en base.

Les tests comprennent les handlers Worker avec SQLite réel, les fonctions du contrôleur, les migrations Cloudflare locales, le parcours de fermeture et réouverture dans un navigateur, et un accusé de sauvegarde volontairement perdu. Les vérifications de publication utilisent uniquement des participants fictifs isolés et la lecture des accès existants.
