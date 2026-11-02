# Lien commun — Formation IA ADMIN du 2 novembre 2026

L’organisateur peut transmettre un seul lien protégé à la liste confirmée. Chaque personne renseigne prénom, nom et adresse professionnelle puis accepte la notice avant de retrouver son invitation existante.

L’échange est réservé aux identifiants de participants explicitement configurés dans un secret Worker. Le registre contient uniquement des identifiants opaques et leurs invitations existantes ; aucune liste nominative ni aucun secret réel ne figure dans le dépôt ou dans le site statique.

Le nouveau point d’entrée est POST /v2/admin-enroll. Le français utilise ce chemin pour les liens protégés ; les parcours anglais et les invitations individuelles conservent leurs chemins actuels.

L’échange ne crée aucun participant, ne remplace aucune invitation et ne modifie aucune affectation, tentative, note ou limite. La première inscription est liée de façon atomique à un identifiant de transaction ; un rejeu doit présenter la même clé et les mêmes données. Une adresse hors de la liste, une invitation révoquée, une campagne inactive, une affectation absente ou une autorisation expirée sont refusées.

Le formulaire repose sur une identité professionnelle déclarée. Il ne vérifie pas la propriété de la boîte mail et ne constitue pas une connexion SSO. Dans l’onglet d’origine, rouvrir le même lien commun retrouve l’invitation personnelle ; un autre lien ne réutilise pas cette association. Un nouvel onglet sans session déjà autorisée peut nécessiter de reprendre l’onglet d’origine ou de contacter l’organisateur.

Les identifiants présents dans les fragments sont retirés de l’adresse. La clé commune ADMIN est conservée uniquement dans le stockage de session de l’onglet pour permettre la reprise ; la notice française décrit ce fonctionnement. Aucun jeton brut n’est écrit en base D1. Le secret de campagne doit être retiré après la clôture ; son expiration rend le lien inutilisable même avant cette suppression.

## Vérifications du 2 novembre 2026

- 21 tests Worker réussis, dont intégration SQLite de l’inscription, des rejeux, des clés concurrentes, des refus d’accès et de la conservation des données.
- Validateurs français, anglais et contrat global réussis ; banque anglaise synchronisée.
- Régression client vérifiée sur les fonctions réelles : échange, même lien, autre lien, nettoyage du fragment et comportement anglais inchangé.
- Compilation Cloudflare en simulation réussie.
- Parcours navigateur local avec le vrai contrôleur et le vrai Worker, sur un SQLite fictif : adresse non invitée refusée, inscription autorisée, accès au questionnaire, reprise du même lien et affichage d’un reçu historique r2.
- Relecture indépendante : défaut de reprise corrigé, puis vérifié ; aucun autre point matériel restant.
- Les 20 questions, leurs réponses, la version r3 et le seuil de réussite restent identiques.

Aucune tentative réelle ni aucun envoi de mail n’est produit par ces contrôles. La vérification finale de déploiement compare les accès existants en lecture seule.
