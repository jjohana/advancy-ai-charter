# Design du site français ADMIN — contrôle du 31 octobre 2026

Base : `096f92b8f39ddfaa7cfc8b6c01b464e1a0d2c3e8`.
Modification de présentation limitée à `/fr/` et à deux icônes locales Lucide.
Identité Advancy, logo Pythonia, questions, explications et logique conservés.

## Parcours et états

1. **Accès — Amélioré et testé.** Les marques sont regroupées ; le message d’invitation est prioritaire sur mobile. Le score et le redémarrage ne sont plus affichés avant l’accès.
2. **Question et sélection — Amélioré et testé.** La confirmation de confidentialité est proche de la question. Les choix ont des états distincts ; la progression reste compacte sur mobile. Espace au clavier a été testé sur la confirmation et un choix.
3. **Corrections — Amélioré et testé.** Le texte gagne en mesure et en interligne ; la réponse correcte et l’erreur sélectionnée sont séparées. Les 100 explications sont identiques au contenu validé et ont été parcourues sans troncature.
4. **Retour et résultat — Amélioré et testé.** Notes facultatives, champs de commentaires, score et reçu suivent la même présentation. Une erreur volontaire donne 19/20. La reprise d’un résultat et une nouvelle tentative ont été contrôlées.
5. **Confidentialité — Amélioré et testé.** La page reprend les deux marques et une colonne de lecture adaptée. Les liens aller-retour fonctionnent. Le texte de la notice est conservé à l’identique.

## Vérifications

- Les 20 questions ont été parcourues dans une copie locale ; les 100 textes d’explication rendus correspondent au fichier original. Aucun débordement ni bloc d’explication tronqué sur ce parcours.
- Reflow vérifié à 320, 390, 768 et 1 024 pixels, ainsi que sur ordinateur à 1 280 pixels. Zones de réponse de 44 pixels de haut au minimum ; pas de débordement horizontal observé.
- Champs facultatifs : 104 pixels de haut, texte proportionnel, focus visible, présentation mobile vérifiée.
- Confirmation de redémarrage, consentement avant réponse, volet des explications, saisie de note, envoi local, reçu et reprise testés. Les essais sont fictifs et n’ont créé aucune tentative en production.
- `app.js` et `fr/questions.js` comparés aux fichiers de départ : identiques. La partie rédactionnelle de la notice est identique. Les identifiants HTML restent uniques.
- Captures avant/après de l’accès appariées aux mêmes dimensions : ordinateur 1265 × 889 et mobile 375 × 812. Les autres captures montrent des extraits du parcours local.
- Support de `prefers-reduced-motion`, lien d’évitement et contrôles natifs conservés ; les boutons, liens et réponses ont un focus visible.

## Contrastes de textes mesurés

- Texte principal : 12.57:1.
- Texte secondaire : 5.52:1.
- Bouton principal : 13.46:1.
- Bonne réponse : 6.62:1.
- Mauvaise réponse : 6.24:1.
- Repère de thème : 6.35:1.
- Date en en-tête : 7.63:1.
- Sous-titre en en-tête : 10.79:1.

## Assets

Les deux logos restent les fichiers authentiques existants.
Icônes `lock-keyhole` et `arrow-right` copiées sans modification du projet Lucide ; licences ISC et MIT conservées dans `assets/ui/LICENSE-lucide.txt`.
Source : https://github.com/lucide-icons/lucide/tree/main/icons

## Limite des contrôles

Vérifications réalisées dans le navigateur intégré avec les dimensions indiquées. Elles ne constituent pas une certification complète d’accessibilité ou un test de lecteur d’écran.
