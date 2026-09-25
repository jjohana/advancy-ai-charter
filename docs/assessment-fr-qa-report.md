# Revue qualité du questionnaire français — ADMIN

## Périmètre

Le questionnaire est réservé aux équipes ADMIN. Il reprend exclusivement les messages de la présentation `Advancy_Generative_AI_Overview_September_2026.pptx` et les transpose dans huit activités demandées : communication, e-mails, traduction, Excel, support, finance, RH et gestion d’agenda.

L’accès public est désactivé. Le questionnaire exige une invitation individuelle ou un lien d’inscription protégé affecté à la campagne ADMIN.

## Architecture pédagogique

- 20 questions, cinq options et une seule réponse correcte par question.
- 17 mises en situation ADMIN et 3 questions de repérage.
- Seuil de réussite : 70 %, soit 14 bonnes réponses.
- Répartition exacte des bonnes réponses : 4 en A, 4 en B, 4 en C, 4 en D et 4 en E.
- Correction immédiate de chaque option, y compris des distracteurs.

## Couverture des activités ADMIN

| Activité | Questions | Situations principales |
|---|---:|---|
| Communication | 1, 14, 19 | Communication interne, validation finale, idée d’agent |
| E-mails | 4, 6 | Annonce de procédure, rappel de réservation |
| Traduction | 3, 11 | Minimisation du contenu, choix du modèle |
| Excel | 7, 13, 17 | Consolidation, contrôle de factures, skill Codex |
| Support | 5, 8, 16 | Outil approuvé, permissions, assistant no-code |
| Finance | 2, 9, 18 | Données sensibles, comparaison d’offres, escalade |
| RH | 10, 12 | Crédits, FAQ d’onboarding |
| Agenda | 15, 20 | Chat Project, organisation d’un séminaire |

## Couverture du support

| Thème de la présentation | Slides | Questions |
|---|---:|---:|
| Autorisations, restrictions, minimisation et escalade | 2 | 1 à 5, 18 |
| Responsabilité humaine | 3 | 4, 14 |
| Choix entre Chat, Work, assistant et Codex | 4 à 7 | 6 à 8, 16, 17, 20 |
| Permissions et moindre privilège | 7 | 8, 20 |
| Brief et format de sortie | 8 | 9, 12, 19, 20 |
| Crédits et approbation | 9 | 10 |
| Modèle et effort de raisonnement | 10 et 11 | 11, 12 |
| Revue de l’évidence et règle d’arrêt | 12 et 16 | 13, 14, 18, 20 |
| Chat Projects | 13 | 15 |
| Assistant no-code | 14 | 16, 19 |
| Skills Codex | 15 | 17 |

## Contrôles appliqués

- Chaque question se rattache à une ou plusieurs slides identifiées.
- Tous les scénarios appartiennent à une activité ADMIN explicitement demandée.
- Les situations décrivent directement les informations autorisées, exclues ou non confirmées ; aucune taxonomie par couleur n’est requise pour répondre.
- Une option seulement satisfait pleinement le scénario.
- Chaque scénario impose un arbitrage entre au moins deux dimensions : vitesse, périmètre d’accès, qualité, coût, traçabilité ou responsabilité.
- Les distracteurs sont volontairement plausibles : ils appliquent une partie de la bonne méthode mais omettent un contrôle déterminant, élargissent légèrement le périmètre ou déplacent le risque vers la revue humaine.
- Les formulations « toutes les réponses » et « aucune des réponses » sont exclues.
- La position des bonnes réponses est équilibrée afin de supprimer un indice de structure.
- Les corrections expliquent la règle en jeu sans seulement répéter « vrai » ou « faux ».
- Les informations susceptibles d’évoluer, notamment les crédits et les modèles, sont explicitement rattachées au support de septembre 2026.

## Relecture pédagogique et parcours — 25 septembre 2026

Les 20 questions ont été relues. Les positions des bonnes réponses restent identiques à la clé du serveur.

Corrections principales :

- Q3 : existence du glossaire et absence de pertinence des autres sections rendues explicites.
- Q5 : statut non confirmé de l’outil précisé.
- Q6 : besoin ponctuel explicite ; suppression du nom de la bonne solution dans le thème.
- Q7 : titre neutre et distracteur Codex recentré sur l’absence de validation des correspondances, plutôt que sur une exclusion générale de l’outil.
- Q9 : comparaison factuelle sans estimation ni classement provisoire explicitement demandée.
- Q12 : assistant destiné à traiter de nouvelles demandes, pour distinguer correction d’exemples et correction de la méthode.
- Q13 : échantillonnage rattaché à une règle interne hypothétique du scénario, sans le présenter comme une règle universelle de contrôle financier.
- Q15 et Q17 : retrait des noms de solutions dans les titres affichés avant réponse.
- Q20 : dépendance entre les horaires et les livrables explicite ; réponse attendue fondée sur un agenda de référence et des contrôles à chaque changement.

Parcours observé dans le navigateur local :

1. Entrée : en-tête et panneau compacts ; consigne de choix contextualisée ; durée indicative. Capture avant : `output/admin-review/01-before.png`.
2. Réponse et correction : bonne réponse et erreur testées ; votre choix puis réponse attendue ; explications restantes dépliables ; référence à la formation visible. Capture : `output/admin-review/02-correction.png`.
3. Mobile à 390 px : pas de débordement horizontal (largeur de contenu 375 px), contrôles et textes lisibles. Capture : `output/admin-review/03-mobile.png`.
4. Ordinateur à 1280 px : parcours des 20 questions, score local 20/20 ; reprise à la question 13 après actualisation ; annulation du redémarrage sans perte. Capture : `output/admin-review/04-desktop.png`.
5. Fin : formulaire facultatif de satisfaction, commentaires et idées d’agents accessible. Capture : `output/admin-review/05-final.png`.

Le contrôle suit le guide Product Design Audit pour la capture du parcours et les vérifications visuelles. Les captures de cette revue sont locales et ne sont pas des preuves de mise en production. Le formulaire final n’a pas été envoyé à la base de production. Aucun audit complet avec lecteur d’écran ni validation psychométrique auprès d’ADMIN réels n’a été réalisé. Les tests automatiques vérifient la structure et la notation ; la qualité pédagogique repose sur la relecture décrite ci-dessus.

### Contrôles automatiques

Le script `scripts/validate-french-quiz.mjs` vérifie la structure, l’unicité, un niveau minimal de contexte pour chaque arbitrage, l’absence de codes couleur, les explications, les huit activités ADMIN, l’accès sur invitation, la couverture des slides, l’équilibre A-E et l’identité de la clé de correction entre le navigateur et le serveur.
