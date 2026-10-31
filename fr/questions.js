(function () {
  "use strict";

  const source = {
  "audience": "ADMIN",
  "training": {
    "date": "2026-11-02",
    "slideCount": 16,
    "title": "L’IA chez Advancy",
    "revision": "2026-11-02-admin-fr-r2"
  },
  "questions": [
    {
      "kind": "scenario",
      "theme": "Communication · Noms des collègues",
      "q": "Vous rédigez un mail avec l’IA. Le responsable a exclu les noms des collègues des données autorisées. Que préparer avant de transmettre les notes ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 16 : utiliser les rôles ; transmettre des noms réels seulement s’ils sont nécessaires et autorisés.",
      "slides": [
        2,
        16
      ],
      "correct": 2,
      "options": [
        {
          "text": "Toutes les notes, en demandant à l’IA de retirer les noms.",
          "why": "Incorrect. Les noms seraient déjà transmis avant leur retrait par l’IA."
        },
        {
          "text": "Les notes et l’annuaire pour identifier les collègues.",
          "why": "Incorrect. L’annuaire ajouterait des noms explicitement exclus."
        },
        {
          "text": "Un extrait autorisé sans noms, en utilisant les rôles utiles.",
          "why": "Correct. Retirez les noms avant l’envoi à l’IA. Le support recommande les rôles ; les noms réels exigent nécessité et autorisation."
        },
        {
          "text": "Les notes avec les noms, mais sans les afficher dans le mail final.",
          "why": "Incorrect. Ne pas afficher un nom dans la sortie n’empêche pas sa transmission."
        },
        {
          "text": "Le fichier complet avec les noms masqués à l’écran.",
          "why": "Incorrect. Masquer les noms à l’écran ne les retire pas du fichier."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · Données autorisées",
      "q": "Pour une synthèse d’entretien, seules les notes validées sont autorisées dans l’IA. Quel fichier transmettre ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 7 : utiliser les notes autorisées et un identifiant candidat, sans transmettre le dossier complet sans accord.",
      "slides": [
        2,
        7
      ],
      "correct": 4,
      "options": [
        {
          "text": "Le dossier candidat complet, pour conserver le contexte.",
          "why": "Incorrect. Le dossier complet dépasse les notes autorisées."
        },
        {
          "text": "Le dossier complet, après remplacement du nom par un identifiant.",
          "why": "Incorrect. Changer le nom ne rend pas les autres données du dossier autorisées."
        },
        {
          "text": "Le dossier complet, avec les rubriques non autorisées masquées.",
          "why": "Incorrect. Les rubriques masquées restent dans le fichier transmis."
        },
        {
          "text": "Un accès en lecture seule au dossier candidat complet.",
          "why": "Incorrect. La lecture seule ne limite pas les informations accessibles."
        },
        {
          "text": "Un extrait vérifié des seules notes autorisées, avec un identifiant candidat.",
          "why": "Correct. L’extrait respecte l’autorisation. Le support prévoit un identifiant candidat et une décision prise par le recruteur habilité."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Traduction · Glossaire",
      "q": "Deux paragraphes autorisés sont à traduire. Un glossaire validé fixe les termes à employer. Que fournir à l’IA ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 13 : utiliser un glossaire approuvé, préserver le sens et limiter les sources au besoin.",
      "slides": [
        2,
        13
      ],
      "correct": 1,
      "options": [
        {
          "text": "La procédure complète, pour ajouter du contexte.",
          "why": "Incorrect. Le support demande le plus petit extrait autorisé utile à la tâche."
        },
        {
          "text": "Les deux paragraphes et les entrées utiles du glossaire.",
          "why": "Correct. Le texte à traduire et le vocabulaire validé apportent les informations nécessaires. Il faut ensuite vérifier le sens et les chiffres."
        },
        {
          "text": "Les deux paragraphes sans le glossaire.",
          "why": "Incorrect. Le glossaire fixe ici la terminologie à respecter."
        },
        {
          "text": "Uniquement le glossaire, sans les paragraphes.",
          "why": "Incorrect. Le glossaire ne contient pas le texte à traduire."
        },
        {
          "text": "Un résumé des deux paragraphes, à traduire.",
          "why": "Incorrect. Traduire un résumé ne restitue pas intégralement les deux paragraphes."
        }
      ]
    },
    {
      "kind": "qcm",
      "theme": "Nouveautés · Tâches d’équipe Work",
      "q": "Une tâche d’équipe est lancée dans Work. Qui doit valider le résultat avant son utilisation ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 3 : désigner un responsable pour les tâches partagées et vérifier les accès aux nouvelles fonctions.",
      "slides": [
        3
      ],
      "correct": 3,
      "options": [
        {
          "text": "La première personne qui ouvre le fichier.",
          "why": "Incorrect. Ouvrir un fichier ne désigne pas son valideur."
        },
        {
          "text": "L’IA, une fois la tâche terminée.",
          "why": "Incorrect. L’IA ne remplace pas le responsable humain."
        },
        {
          "text": "La personne qui a le moins de tâches en cours.",
          "why": "Incorrect. La charge de travail ne désigne pas le valideur."
        },
        {
          "text": "Le responsable désigné pour cette tâche.",
          "why": "Correct. Le support demande de désigner un responsable des tâches partagées. Les nouvelles fonctions restent soumises aux accès et autorisations Advancy."
        },
        {
          "text": "Personne, si le modèle utilisé est récent.",
          "why": "Incorrect. Un modèle récent ne supprime pas la validation humaine."
        }
      ]
    },
    {
      "kind": "qcm",
      "theme": "Charte · Outil approuvé",
      "q": "Un outil IA non approuvé propose de désactiver l’historique. Que faire avant de l’utiliser pour un message professionnel non sensible ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 2 : utiliser les outils et comptes Advancy approuvés.",
      "slides": [
        2
      ],
      "correct": 0,
      "options": [
        {
          "text": "Obtenir l’approbation Advancy et utiliser le compte professionnel prévu.",
          "why": "Correct. L’approbation de l’outil et du compte reste nécessaire, même pour un texte non sensible."
        },
        {
          "text": "L’utiliser si le texte ne contient aucun nom.",
          "why": "Incorrect. L’absence de noms ne remplace pas l’approbation de l’outil."
        },
        {
          "text": "L’utiliser pour un seul essai.",
          "why": "Incorrect. Un essai reste un usage du service non approuvé."
        },
        {
          "text": "L’utiliser dès que l’historique est désactivé.",
          "why": "Incorrect. Un réglage du fournisseur ne remplace pas l’approbation Advancy."
        },
        {
          "text": "L’utiliser avec un compte personnel.",
          "why": "Incorrect. Le support exclut l’utilisation d’un compte personnel pour ce travail."
        }
      ]
    },
    {
      "kind": "qcm",
      "theme": "Chat, Work et Codex · Repères d’usage",
      "q": "Dans les exemples du support, quelle tâche illustre l’utilisation de Codex ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 4, 16 : Codex est illustré par les fichiers locaux, les scripts visibles et les transformations répétées contrôlées.",
      "slides": [
        4,
        16
      ],
      "correct": 1,
      "options": [
        {
          "text": "Reformuler une accroche LinkedIn dans une conversation.",
          "why": "Incorrect. C’est l’exemple donné pour Chat dans le support."
        },
        {
          "text": "Fiabiliser une transformation répétée de fichiers en contrôlant les modifications.",
          "why": "Correct. Le repère Codex est le contrôle technique des scripts et transformations de fichiers. Work est illustré par un classeur à reprendre, Chat par une reformulation."
        },
        {
          "text": "Explorer une première idée par un échange de questions.",
          "why": "Incorrect. Cet exemple relève du repère de conversation présenté pour Chat."
        },
        {
          "text": "Clarifier la demande avant de commencer un texte.",
          "why": "Incorrect. Clarifier la demande est une étape commune, pas l’exemple Codex présenté."
        },
        {
          "text": "Obtenir une ébauche en réponse à une question.",
          "why": "Incorrect. La FAQ associe une question ou une ébauche au repère Chat."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · Synthèse d’entretien",
      "q": "Les notes d’entretien ne contiennent aucun élément sur un critère de la grille. Que doit indiquer l’IA pour ce critère ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 7 : sans preuve, indiquer « Non évalué » et ne pas inventer de note ou de citation.",
      "slides": [
        7
      ],
      "correct": 3,
      "options": [
        {
          "text": "La moyenne des autres notes.",
          "why": "Incorrect. Une moyenne des autres critères ne prouve rien sur celui-ci."
        },
        {
          "text": "Une note déduite de l’aisance orale du candidat.",
          "why": "Incorrect. Cette déduction n’est pas documentée par les notes."
        },
        {
          "text": "Une note de zéro.",
          "why": "Incorrect. L’absence d’information ne justifie pas une note de zéro."
        },
        {
          "text": "« Non évalué », avec un point à clarifier.",
          "why": "Correct. Le support demande « Non évalué » sans preuve. La grille est conservée et le recruteur valide l’évaluation."
        },
        {
          "text": "Supprimer ce critère de la grille.",
          "why": "Incorrect. Le support demande de conserver les rubriques de la grille."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · Présentation écoles",
      "q": "Vous améliorez le support du cabinet pour des étudiants. Quel livrable permet à l’équipe de modifier ensuite les textes et les graphiques ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 8 : garder le modèle approuvé et livrer des textes, tableaux et graphiques modifiables.",
      "slides": [
        8
      ],
      "correct": 0,
      "options": [
        {
          "text": "Un PowerPoint respectant le modèle, avec des objets modifiables.",
          "why": "Correct. Le support prévoit de garder le masque, les polices et les couleurs, puis de livrer des textes, tableaux et graphiques modifiables."
        },
        {
          "text": "Un PowerPoint composé uniquement d’images des slides.",
          "why": "Incorrect. Des images ne permettent pas de modifier les textes et graphiques séparément."
        },
        {
          "text": "Un PDF sans le fichier PowerPoint.",
          "why": "Incorrect. Un PDF seul ne fournit pas le PowerPoint modifiable demandé."
        },
        {
          "text": "Une vidéo du diaporama.",
          "why": "Incorrect. Une vidéo ne fournit pas les objets à modifier."
        },
        {
          "text": "Des captures d’écran de chaque slide.",
          "why": "Incorrect. Les captures ne fournissent pas les objets PowerPoint modifiables."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Brief · KPI recrutement",
      "q": "L’Excel KPI recrutement contient des indicateurs dont la définition manque. Que demander à l’IA avant de les calculer ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 5, 9 : signaler les informations manquantes et utiliser des définitions d’indicateurs stables.",
      "slides": [
        5,
        9
      ],
      "correct": 4,
      "options": [
        {
          "text": "Choisir les définitions les plus courantes.",
          "why": "Incorrect. Un usage courant ne remplace pas la définition retenue par l’équipe."
        },
        {
          "text": "Déduire les définitions à partir du nom des colonnes.",
          "why": "Incorrect. Un nom de colonne peut avoir plusieurs interprétations."
        },
        {
          "text": "Remplacer les valeurs inconnues par zéro.",
          "why": "Incorrect. Zéro est une valeur ; il ne remplace pas une information absente."
        },
        {
          "text": "Reprendre les chiffres de la semaine précédente.",
          "why": "Incorrect. Les chiffres précédents ne définissent pas le calcul attendu."
        },
        {
          "text": "Repérer les définitions manquantes et les faire clarifier.",
          "why": "Correct. Le brief demande de signaler les lacunes et de poser les questions dont dépend le résultat. Les indicateurs ont besoin de définitions stables."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Usage · Crédits et validation",
      "q": "Le support rappelle une enveloppe de 1 500 crédits. Le travail prévu risque de la dépasser. Que faire avant de le lancer ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 3, 16 : règle interne rappelée : enveloppe de 1 500 crédits et accord au-delà ; vérifier qualité et consommation.",
      "slides": [
        3,
        16
      ],
      "correct": 2,
      "options": [
        {
          "text": "Lancer le travail puis demander un accord après le dépassement.",
          "why": "Incorrect. L’accord doit précéder le dépassement prévu."
        },
        {
          "text": "Choisir le modèle le plus puissant sans estimer la consommation.",
          "why": "Incorrect. La puissance du modèle ne remplace pas l’estimation et l’accord."
        },
        {
          "text": "Estimer le besoin et obtenir l’accord requis avant de dépasser l’enveloppe.",
          "why": "Correct. Cette conduite respecte la règle interne rappelée dans le support. Elle ne constitue pas un tarif de modèle."
        },
        {
          "text": "Découper le travail en petites tâches pour éviter de demander un accord.",
          "why": "Incorrect. Le découpage ne supprime pas la consommation totale."
        },
        {
          "text": "Terminer le travail avec un compte personnel.",
          "why": "Incorrect. Le support impose les outils et comptes Advancy approuvés."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Qualités IA · Précision verbale et créativité",
      "q": "Vous demandez un support « plus dynamique ». Quelle première étape évite un malentendu avant de demander des variantes ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 5, 6 : faire reformuler la demande, préciser le résultat et les contraintes, puis explorer plusieurs approches.",
      "slides": [
        5,
        6
      ],
      "correct": 3,
      "options": [
        {
          "text": "Demander trois versions sans préciser davantage le besoin.",
          "why": "Incorrect. Les variantes reposeraient sur un besoin encore ambigu."
        },
        {
          "text": "Laisser l’IA choisir ce que « dynamique » signifie.",
          "why": "Incorrect. Une interprétation non vérifiée peut conduire au mauvais résultat."
        },
        {
          "text": "Répéter la même demande en ajoutant « très professionnel ».",
          "why": "Incorrect. Ce qualificatif ne précise pas le changement attendu."
        },
        {
          "text": "Faire reformuler le besoin et préciser le public, les contraintes et le résultat.",
          "why": "Correct. La reformulation vérifie la compréhension. La créativité intervient ensuite pour explorer plusieurs approches adaptées au brief."
        },
        {
          "text": "Choisir les couleurs avant de définir l’objectif.",
          "why": "Incorrect. Les couleurs ne suffisent pas à définir le changement attendu."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Qualités IA · Esprit critique et persévérance",
      "q": "Deux réponses de l’IA donnent des résultats différents pour le même calcul à partir des mêmes données. Que faire ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 5, 6 : vérifier les sources, calculs et hypothèses ; itérer jusqu’à un résultat vérifié.",
      "slides": [
        5,
        6
      ],
      "correct": 1,
      "options": [
        {
          "text": "Retenir la réponse la mieux rédigée.",
          "why": "Incorrect. La qualité de rédaction ne prouve pas l’exactitude des chiffres."
        },
        {
          "text": "Vérifier les sources et calculs, faire corriger l’erreur puis contrôler la correction.",
          "why": "Correct. L’esprit critique confronte le résultat aux preuves. La persévérance consiste à corriger avec un retour précis et à vérifier la nouvelle version."
        },
        {
          "text": "Retenir la réponse approuvée par le plus de modèles.",
          "why": "Incorrect. Un accord entre modèles ne remplace pas les sources."
        },
        {
          "text": "Relancer jusqu’à obtenir deux réponses identiques.",
          "why": "Incorrect. Deux réponses identiques peuvent répéter la même erreur."
        },
        {
          "text": "Accepter la réponse du modèle le plus récent.",
          "why": "Incorrect. Un modèle récent peut aussi produire une erreur."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · KPI et dénominateurs",
      "q": "Dans un même groupe de candidats, 6 offres ont été faites et 4 acceptées. Quel est le taux d’acceptation des offres, arrondi à une décimale ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 9 : taux d’acceptation : 4 acceptations / 6 offres, soit 66,7 %, pour une même cohorte.",
      "slides": [
        9
      ],
      "correct": 4,
      "options": [
        {
          "text": "25,0 %",
          "why": "Incorrect. Le calcul est 4 offres acceptées divisées par 6 offres faites, soit 66,7 %."
        },
        {
          "text": "40,0 %",
          "why": "Incorrect. Il faut diviser 4 par 6, et non par 10."
        },
        {
          "text": "50,0 %",
          "why": "Incorrect. La moitié de 6 serait 3 acceptations ; il y en a 4."
        },
        {
          "text": "75,0 %",
          "why": "Incorrect. Le rapport 4/6 est environ 0,667, soit 66,7 %."
        },
        {
          "text": "66,7 %",
          "why": "Correct. Le taux d’acceptation est 4/6 × 100 = 66,7 %. Le dénominateur est le nombre d’offres de ce même groupe."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Marketing · LinkedIn et newsletter",
      "q": "Vous avez des publications validées et les notes d’un nouvel événement. Comment les utiliser pour rédiger dans le ton habituel du cabinet ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 10 : les anciens textes donnent le style ; le nouveau brief fournit les faits, avec un brouillon adapté à chaque canal.",
      "slides": [
        10
      ],
      "correct": 0,
      "options": [
        {
          "text": "Reprendre le ton des publications et les faits du nouvel événement.",
          "why": "Correct. Les publications donnent le style ; les nouvelles notes donnent les faits. Il faut ensuite adapter le brouillon à LinkedIn ou à la newsletter et le faire valider."
        },
        {
          "text": "Changer le nom d’un ancien événement et garder ses chiffres.",
          "why": "Incorrect. Les anciens chiffres ne décrivent pas nécessairement le nouvel événement."
        },
        {
          "text": "Choisir un ton très promotionnel, différent des références.",
          "why": "Incorrect. La demande est de conserver le ton habituel, pas de le remplacer."
        },
        {
          "text": "Recopier une publication sans tenir compte des nouvelles notes.",
          "why": "Incorrect. La publication doit présenter les faits du nouvel événement."
        },
        {
          "text": "Inventer les détails manquants pour rendre le message plus vivant.",
          "why": "Incorrect. Les détails à confirmer doivent être signalés, sans être inventés."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Projets et skills · Contexte et méthode",
      "q": "Un projet regroupe déjà les références autorisées de l’équipe. À quoi sert un skill dans la méthode présentée ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 15 : un projet réunit le contexte autorisé ; un skill rassemble méthode, modèles et contrôles.",
      "slides": [
        15
      ],
      "correct": 2,
      "options": [
        {
          "text": "À conserver uniquement le résultat du premier essai.",
          "why": "Incorrect. Un résultat passé ne décrit pas une méthode réutilisable."
        },
        {
          "text": "À supprimer la validation humaine des résultats.",
          "why": "Incorrect. Un responsable reste chargé de valider le résultat."
        },
        {
          "text": "À réunir les consignes, modèles et contrôles réutilisables.",
          "why": "Correct. Le projet rassemble le contexte autorisé ; le skill formalise la méthode, les modèles et les contrôles. Un responsable entretient cette méthode."
        },
        {
          "text": "À donner automatiquement accès à tous les fichiers de l’équipe.",
          "why": "Incorrect. Les droits de partage doivent être vérifiés ; le skill ne les élargit pas."
        },
        {
          "text": "À remplacer le modèle approuvé par un format choisi à chaque fois.",
          "why": "Incorrect. La méthode réutilisable conserve les modèles et contrôles approuvés."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Événements · Rétroplanning interactif",
      "q": "La date d’un événement change. Quel rétroplanning permet de recalculer les échéances prévues par rapport au jour J ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 11 : lier les échéances au jour J et les recalculer lorsque la date de l’événement change.",
      "slides": [
        11
      ],
      "correct": 4,
      "options": [
        {
          "text": "Un PDF avec des dates fixes.",
          "why": "Incorrect. Les dates fixes du PDF ne se recalculent pas avec le jour J."
        },
        {
          "text": "Un Excel dont toutes les dates sont saisies manuellement.",
          "why": "Incorrect. Les dates saisies manuellement ne sont pas reliées au jour J."
        },
        {
          "text": "Un texte qui énumère les anciennes échéances.",
          "why": "Incorrect. La liste ne recalcule pas les dates."
        },
        {
          "text": "Une image du calendrier initial.",
          "why": "Incorrect. Une image ne permet pas ce recalcul."
        },
        {
          "text": "Un tableau modifiable avec des dates calculées à partir du jour J.",
          "why": "Correct. Les dates liées au jour J se recalculent quand il change. Le suivi présenté ajoute aussi responsables, contacts, priorités, dépendances et statuts."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Codex · Transformations récurrentes",
      "q": "Un script préparé avec Codex actualise l’Excel de recrutement sans erreur d’exécution. Comment vérifier que le classeur obtenu est juste ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 4, 5, 9, 15 : examiner les scripts et modifications, puis vérifier les calculs et résultats du fichier produit.",
      "slides": [
        4,
        5,
        9,
        15
      ],
      "correct": 0,
      "options": [
        {
          "text": "Comparer ses données et formules aux sources et règles validées.",
          "why": "Correct. Une exécution réussie ne garantit pas des calculs justes. Il faut contrôler les résultats, les formules et les modifications par rapport aux sources et règles attendues."
        },
        {
          "text": "Constater que le programme affiche un message de réussite.",
          "why": "Incorrect. Le message prouve la fin de l’exécution, pas l’exactitude des résultats."
        },
        {
          "text": "Vérifier seulement que le fichier existe dans le bon dossier.",
          "why": "Incorrect. La présence du fichier ne prouve pas l’exactitude de son contenu."
        },
        {
          "text": "Vérifier seulement que le classeur s’ouvre.",
          "why": "Incorrect. Un classeur peut s’ouvrir et contenir des calculs faux."
        },
        {
          "text": "Comparer uniquement la taille du nouveau fichier à l’ancien.",
          "why": "Incorrect. La taille du fichier n’indique pas si ses chiffres et formules sont justes."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Marketing · Météo et Canva",
      "q": "Vous actualisez la météo des bureaux dans Canva. Certaines données sont anciennes. Que faire avant de remplacer la présentation utilisée ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 12 : vérifier lieux, périodes, fraîcheur, champs et accès Canva ; tester une copie avant validation.",
      "slides": [
        12
      ],
      "correct": 2,
      "options": [
        {
          "text": "Remplacer directement la présentation d’origine.",
          "why": "Incorrect. Le support prévoit un test sur une copie avant remplacement."
        },
        {
          "text": "Réutiliser les valeurs anciennes sans le signaler.",
          "why": "Incorrect. Les valeurs anciennes ou absentes doivent être signalées."
        },
        {
          "text": "Vérifier les données et les champs Canva, puis tester une copie.",
          "why": "Correct. Vérifiez villes, périodes, unités et fraîcheur des données, ainsi que les champs et accès Canva. Testez une copie avant validation ; la collecte et la mise à jour sont deux étapes distinctes."
        },
        {
          "text": "Appliquer la même météo à toutes les villes.",
          "why": "Incorrect. Les données doivent correspondre aux villes et périodes des bureaux."
        },
        {
          "text": "Supposer que les champs Canva se rempliront sans vérification.",
          "why": "Incorrect. La mise à jour dépend des champs, des accès et du paramétrage."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Automatisations · Brouillon et envoi",
      "q": "Vous demandez chaque lundi des brouillons de relance, à valider avant tout envoi. Que doit faire la tâche planifiée ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 14, 16 : distinguer rappel, brouillon et envoi ; faire valider destinataires et texte avant tout envoi demandé.",
      "slides": [
        14,
        16
      ],
      "correct": 1,
      "options": [
        {
          "text": "Envoyer les relances puis demander votre validation.",
          "why": "Incorrect. La validation demandée doit précéder l’envoi."
        },
        {
          "text": "Préparer les brouillons et attendre votre validation avant l’envoi.",
          "why": "Correct. La tâche prépare les brouillons. L’envoi reste distinct et exige la validation demandée, une connexion compatible et l’accord explicite."
        },
        {
          "text": "Afficher un simple rappel sans préparer les brouillons demandés.",
          "why": "Incorrect. Ce rappel ne produit pas les brouillons explicitement demandés."
        },
        {
          "text": "Envoyer sans validation les messages aux destinataires déjà connus.",
          "why": "Incorrect. La demande de validation s’applique aussi aux destinataires connus."
        },
        {
          "text": "Envoyer l’ancien message à tous les contacts.",
          "why": "Incorrect. Le texte et les destinataires doivent être vérifiés avant tout envoi."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Documents · Notes en compte rendu",
      "q": "Une action figure dans les notes, mais son responsable et son échéance ne sont pas indiqués. Que doit faire l’IA dans le compte rendu ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 13 : extraire les actions et signaler les informations non précisées, sans les inventer.",
      "slides": [
        13
      ],
      "correct": 3,
      "options": [
        {
          "text": "Choisir comme responsable la personne qui en a le plus parlé.",
          "why": "Incorrect. Les notes ne permettent pas d’attribuer cette responsabilité."
        },
        {
          "text": "Fixer automatiquement une échéance pour la semaine suivante.",
          "why": "Incorrect. Cette échéance serait inventée."
        },
        {
          "text": "Supprimer l’action du compte rendu.",
          "why": "Incorrect. L’information manquante doit être signalée, sans supprimer l’action."
        },
        {
          "text": "Conserver l’action et indiquer « Responsable et échéance à préciser ».",
          "why": "Correct. Le compte rendu reste fidèle aux notes. Les informations absentes sont rendues visibles pour la validation par le pilote."
        },
        {
          "text": "Reprendre le responsable et la date d’une ancienne réunion.",
          "why": "Incorrect. Une ancienne réunion ne permet pas de compléter cette action sans confirmation."
        }
      ]
    }
  ],
  "evaluation": {
    "title": "Votre retour ADMIN",
    "intro": "La note et les commentaires sont facultatifs. Ils nous aident à améliorer la formation et à identifier des usages ADMIN utiles. N’indiquez aucune information client, financière, RH, personnelle ou sensible.",
    "scaleLabel": "Note globale : 1 = insuffisant, 5 = excellent.",
    "criteria": [
      {
        "id": "overall_satisfaction",
        "label": "Satisfaction globale sur la formation et le questionnaire ADMIN"
      }
    ]
  }
};

  window.quizQuestions = source.questions;
  window.quizConfig = {
    quizId: "advancy-ai-admin-fr",
    quizName: "Evaluation IA - ADMIN",
    quizVersion: "2026-11-02-admin-fr-r2",
    storageNamespace: "admin-fr",
    focusedFeedback: true,
    confirmRestart: true,
    privacyNoticeVersion: "2026-07-09",
    apiBase: "https://advancy-ai-score-api.advancy-ai-training.workers.dev",
    passThreshold: 0.7,
    correctionTitle: "Correction et explications",
    trainingEvaluation: source.evaluation,
    ui: {
      sectionContext: "Réfléchir · Choisir · Vérifier",
      otherExplanations: "Comprendre les autres choix",
      selectedAnswer: "Votre choix",
      sourceLabel: "Repère dans la formation",
      restartConfirmation: "Recommencer effacera les réponses de cette tentative sur cet appareil. Voulez-vous continuer ?",
      keepAttempt: "Conserver mes réponses",
      confirmRestartAction: "Effacer et recommencer",
      assessmentFallbackName: "Evaluation IA - ADMIN",
      mixedQuestionsLabel: "{count} questions ADMIN · une seule bonne réponse",
      secureServiceInvalid: "Le service sécurisé a renvoyé une réponse invalide.",
      secureServiceTimeout: "Le service sécurisé met trop de temps à répondre.",
      secureServiceUnavailable: "Le service sécurisé est momentanément inaccessible.",
      requestFailed: "La demande n’a pas pu aboutir.",
      authorizedParticipant: "Participant ADMIN autorisé",
      attemptsUsed: "Tentatives utilisées : {used} sur {maximum}.",
      invitationVerified: "Invitation ADMIN vérifiée.",
      attemptBlocked: "Cette invitation ne permet pas de commencer une nouvelle tentative pour ce questionnaire ADMIN.",
      secureInvitationVerified: "Invitation ADMIN sécurisée vérifiée.",
      openInvitation: "Ce questionnaire est réservé aux équipes ADMIN. Ouvrez votre lien d’invitation individuel.",
      serviceNotConfigured: "Le service sécurisé du questionnaire n’est pas configuré.",
      verifyingInvitation: "Vérification de votre invitation ADMIN…",
      retryInvitationStatus: "Connexion interrompue. Nouvelle tentative de vérification ({attempt} sur {maximum}) dans {seconds} secondes…",
      invitationVerificationFailed: "L’invitation ADMIN n’a pas pu être vérifiée. Contactez l’organisateur de la formation.",
      progress: "Question {current} / {total}",
      correct: "Correct",
      incorrect: "Incorrect",
      secureAccess: "Accès ADMIN sécurisé",
      secureAccessRequired: "Invitation ADMIN requise",
      verifyingSecureAccess: "Vérification de l’accès ADMIN",
      waitInvitation: "Veuillez patienter pendant la vérification de votre invitation.",
      retryInvitation: "Réessayer la vérification",
      sharedRegistration: "Inscription ADMIN protégée",
      registrationRequired: "Inscription ADMIN requise",
      registerIdentity: "Inscrivez-vous avec votre identité professionnelle Advancy pour continuer.",
      completeRegistration: "Complétez le formulaire associé à la campagne ADMIN.",
      registerTitle: "Inscription au questionnaire ADMIN",
      registerIntro: "Cet accès est réservé aux équipes ADMIN invitées. Utilisez votre adresse professionnelle Advancy.",
      firstName: "Prénom",
      lastName: "Nom",
      workEmail: "Adresse professionnelle Advancy",
      privacyPrefix: "J’ai lu la ",
      privacyLink: "notice de confidentialité du questionnaire",
      registerContinue: "S’inscrire et continuer",
      invalidFirstName: "Saisissez un prénom valide.",
      invalidLastName: "Saisissez un nom valide.",
      invalidWorkEmail: "Saisissez votre adresse professionnelle Advancy (@advancy.com ou @cn.advancy.com).",
      acknowledgePrivacyRegister: "Acceptez la notice de confidentialité pour vous inscrire.",
      registrationSessionInvalid: "La session d’inscription n’a pas pu être initialisée. Rouvrez votre lien ADMIN.",
      registering: "Inscription sécurisée en cours…",
      retryRegistrationStatus: "Connexion interrompue. Nouvelle tentative d’inscription ({attempt} sur {maximum}) dans {seconds} secondes…",
      registrationVerified: "Inscription ADMIN vérifiée. Chargement du questionnaire…",
      registrationFailed: "L’inscription n’a pas pu aboutir.",
      assessmentRecorded: "Questionnaire ADMIN enregistré",
      assessmentAlreadyRecorded: "Questionnaire ADMIN déjà enregistré",
      latestResult: "Votre dernier résultat et son reçu figurent ci-dessous.",
      previousVersionResult: "Résultat d’une version antérieure",
      previousVersionCopy: "Ce résultat concerne la version {version}. Pour passer le questionnaire actuel, commencez une nouvelle tentative si votre invitation le permet.",
      startAnotherAttempt: "Commencer une nouvelle tentative",
      chooseAnswer: "Choisissez une seule réponse.",
      privacyBeforeAnswer: "Pour répondre, cochez la confirmation de lecture de la notice de confidentialité dans le panneau du questionnaire.",
      submitAnswer: "Valider la réponse",
      finalizeAssessment: "Terminer le questionnaire",
      nextQuestion: "Question suivante",
      restartAttempt: "Recommencer cette tentative",
      scenarioLabel: "Mise en situation ADMIN",
      qcmLabel: "Question de connaissances",
      feedback: "Votre retour ADMIN",
      feedbackIntro: "La note et les commentaires sont facultatifs. N’indiquez aucune information client, financière, RH, personnelle ou sensible.",
      feedbackScale: "Échelle facultative : 1 = insuffisant, 5 = excellent.",
      optionalSuffix: " (facultatif)",
      commentsLabel: "Commentaires ou suggestions (facultatif)",
      commentsPlaceholder: "Que faut-il conserver ou améliorer ?",
      useCasesLabel: "Idées de cas d’usage ou d’agents IA ADMIN (facultatif)",
      useCasesPlaceholder: "Décrivez un processus ADMIN à tester ou automatiser, sans donnée sensible.",
      submitAssessment: "Envoyer le questionnaire",
      retrySubmissionStatus: "Connexion interrompue. Nouvelle tentative d’envoi ({attempt} sur {maximum}) dans {seconds} secondes…",
      passed: "Réussi",
      notPassed: "Non réussi",
      recoveredResult: "Votre résultat précédemment enregistré a été récupéré de façon sécurisée.",
      recordedResult: "Votre questionnaire ADMIN a été enregistré de façon sécurisée.",
      receipt: "Reçu : {receipt}",
      sectionResults: "Résultats par section",
      submissionFailed: "L’envoi a échoué. Vos réponses restent disponibles sur cet appareil afin de réessayer.",
      retrySubmission: "Réessayer l’envoi sécurisé",
      retryingSubmission: "Nouvelle tentative d’envoi sécurisé…",
      resumingSubmission: "Reprise de l’envoi sécurisé",
      resumingSubmissionCopy: "La réponse en attente dans cet onglet est renvoyée de manière sécurisée.",
      acknowledgePrivacySubmit: "Acceptez la notice de confidentialité avant l’envoi.",
      submitting: "Envoi sécurisé en cours…",
      readyForSubmission: "Questionnaire ADMIN terminé, prêt pour l’envoi sécurisé",
      authoritativeResult: "Le service sécurisé calculera et enregistrera le résultat officiel.",
      addFeedback: "Ajoutez si vous le souhaitez une note, un commentaire ou une idée d’usage ADMIN, puis envoyez le questionnaire.",
      unavailableAssessment: "Le questionnaire ADMIN de 20 questions n’est pas disponible. Contactez l’organisateur.",
      registrationInvalidResponse: "Le service d’inscription a renvoyé une réponse invalide."
    },
    errorMessages: {
      invalid_invitation: "Cette invitation ADMIN n’est pas valide. Demandez un nouveau lien à l’organisateur.",
      expired_invitation: "Cette invitation ADMIN a expiré. Demandez un nouveau lien à l’organisateur.",
      invitation_invalid: "Cette invitation ADMIN n’est pas valide. Demandez un nouveau lien à l’organisateur.",
      invitation_expired: "Cette invitation ADMIN a expiré. Demandez un nouveau lien à l’organisateur.",
      enrollment_invalid: "Ce lien d’inscription ADMIN n’est pas valide. Demandez un nouveau lien à l’organisateur.",
      enrollment_unauthorized: "Ce lien d’inscription ADMIN n’est pas valide. Demandez un nouveau lien à l’organisateur.",
      enrollment_expired: "Ce lien d’inscription ADMIN a expiré. Demandez un nouveau lien à l’organisateur.",
      enrollment_used: "Cette adresse professionnelle est déjà inscrite. Continuez dans l’onglet d’origine ou contactez l’organisateur.",
      enrollment_rate_limited: "Trop de tentatives d’inscription ont été effectuées. Patientez brièvement avant de réessayer.",
      public_enrollment_disabled: "Ce questionnaire est réservé aux ADMIN invités.",
      self_enrollment_disabled: "Ce questionnaire est réservé aux ADMIN invités.",
      self_enrollment_not_configured: "L’inscription est momentanément indisponible. Contactez l’organisateur.",
      email_domain_not_allowed: "Utilisez votre adresse professionnelle Advancy pour vous inscrire.",
      identity_conflict: "Ces informations d’inscription n’ont pas pu être vérifiées. Contactez l’organisateur.",
      idempotency_key_reused: "Utilisez les mêmes informations que lors de la première tentative ou contactez l’organisateur.",
      participant_revoked: "Votre accès au questionnaire a été révoqué. Contactez l’organisateur.",
      revoked_invitation: "Cette invitation a été révoquée. Contactez l’organisateur.",
      quiz_not_assigned: "Ce questionnaire ADMIN n’est pas attribué à votre invitation.",
      max_attempts_reached: "Le nombre maximal de tentatives a été atteint.",
      attempt_limit_reached: "Le nombre maximal de tentatives a été atteint.",
      cohort_not_active: "Cette campagne ADMIN n’est pas active.",
      cohort_expired: "La campagne ADMIN est terminée.",
      privacy_acknowledgement_required: "Acceptez la notice de confidentialité avant l’envoi.",
      privacy_notice_required: "Acceptez la notice de confidentialité en vigueur avant l’envoi.",
      session_mismatch: "Cette invitation n’autorise pas le questionnaire ADMIN actuel.",
      unknown_quiz_version: "Cette version du questionnaire n’est plus disponible. Rechargez la page ou contactez l’organisateur.",
      unauthorizedFallback: "L’invitation ADMIN n’a pas pu être autorisée.",
      rateLimitedFallback: "Le service limite temporairement les demandes. Réessayez dans quelques instants.",
      serverFallback: "Le service sécurisé du questionnaire est momentanément indisponible.",
      defaultFallback: "La demande n’a pas pu aboutir. Vérifiez votre invitation ADMIN et réessayez."
    }
  };
})();
