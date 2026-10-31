(function () {
  "use strict";

  const source = {
  "audience": "ADMIN",
  "training": {
    "date": "2026-11-02",
    "slideCount": 16,
    "title": "L’IA chez Advancy",
    "revision": "2026-11-02-admin-fr-r3",
    "feedbackRevision": "2026-10-31-feedback-1",
    "kpiAnalysisRevision": "2026-10-31-kpi-ai-1"
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
          "why": "Incorrect. Les noms seraient déjà transmis à l’IA avant leur retrait dans la réponse. Une consigne d’anonymisation ne respecte donc pas l’exclusion donnée par le responsable. Préparez d’abord un extrait sans noms, limité aux informations autorisées, en utilisant les rôles utiles."
        },
        {
          "text": "Les notes et l’annuaire pour identifier les collègues.",
          "why": "Incorrect. L’annuaire ajoute précisément les noms que le responsable a exclus. Il ne faut pas compléter le contexte avec des informations non autorisées. Retirez les noms des notes et utilisez les rôles nécessaires au message ; l’annuaire reste hors de la transmission."
        },
        {
          "text": "Un extrait autorisé sans noms, en utilisant les rôles utiles.",
          "why": "Correct. L’exclusion porte sur les données transmises, pas seulement sur le mail final. Retirez les noms avant de copier les notes et ne gardez que l’extrait autorisé utile. Les rôles peuvent suffire ; des noms réels ne sont utilisables que s’ils sont nécessaires et autorisés. Le responsable relit ensuite le résultat."
        },
        {
          "text": "Les notes avec les noms, mais sans les afficher dans le mail final.",
          "why": "Incorrect. Ne pas afficher un nom dans le mail final n’empêche pas sa présence dans les notes reçues par l’IA. Le choix enfreint donc l’exclusion dès l’entrée. Il faut retirer les noms avant la transmission, puis rédiger à partir des informations autorisées et des rôles utiles."
        },
        {
          "text": "Le fichier complet avec les noms masqués à l’écran.",
          "why": "Incorrect. Masquer les noms à l’écran ne signifie pas les supprimer du fichier transmis. Le fichier complet peut donc encore contenir les informations exclues. Créez un extrait distinct dont les noms sont réellement retirés, vérifiez son contenu, puis transmettez uniquement cet extrait autorisé."
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
          "why": "Incorrect. Le dossier complet peut contenir d’autres informations que les notes autorisées. Le besoin de contexte ne donne pas l’autorisation de les transmettre. Créez un extrait des seules notes validées, contrôlez-le et utilisez un identifiant candidat avant de le fournir à l’IA."
        },
        {
          "text": "Le dossier complet, après remplacement du nom par un identifiant.",
          "why": "Incorrect. Remplacer le nom par un identifiant ne retire pas les autres informations du dossier et ne les rend pas autorisées. Il faut d’abord limiter le contenu aux seules notes validées. L’identifiant candidat s’ajoute à cette sélection ; il ne remplace pas l’autorisation sur les données."
        },
        {
          "text": "Le dossier complet, avec les rubriques non autorisées masquées.",
          "why": "Incorrect. Des rubriques masquées restent dans le fichier complet : leur invisibilité à l’écran ne garantit pas leur retrait. Préparez un nouveau fichier contenant uniquement les notes autorisées, vérifiez qu’il ne conserve pas les autres rubriques, puis utilisez un identifiant candidat."
        },
        {
          "text": "Un accès en lecture seule au dossier candidat complet.",
          "why": "Incorrect. La lecture seule limite la modification du dossier, pas les informations auxquelles l’outil a accès. Le dossier complet dépasse toujours le périmètre autorisé. Fournissez un extrait contrôlé des seules notes validées, avec un identifiant candidat."
        },
        {
          "text": "Un extrait vérifié des seules notes autorisées, avec un identifiant candidat.",
          "why": "Correct. Le contenu transmis reste dans le périmètre autorisé, et l’identifiant évite d’ajouter le nom sans nécessité. L’IA utilise ces notes avec la grille approuvée, conserve les rubriques, distingue propos et observations et n’invente ni note ni citation. Le recruteur habilité valide l’évaluation et prend la décision."
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
          "why": "Incorrect. La tâche porte sur deux paragraphes ; la procédure complète ajoute du contenu qui n’est pas nécessaire à cette demande. Le support demande le plus petit extrait autorisé utile. Transmettez les deux paragraphes et les entrées pertinentes du glossaire, sans élargir le dépôt pour le seul confort du contexte."
        },
        {
          "text": "Les deux paragraphes et les entrées utiles du glossaire.",
          "why": "Correct. Les paragraphes apportent le texte à traduire et le glossaire fixe le vocabulaire à respecter. Ne fournissez que les entrées utiles et autorisées. Après traduction, vérifiez le sens, la terminologie, les noms et les chiffres ; signalez les formulations ambiguës plutôt que de les résoudre au hasard."
        },
        {
          "text": "Les deux paragraphes sans le glossaire.",
          "why": "Incorrect. Le texte est présent, mais la référence terminologique demandée manque. L’IA risque d’employer une autre traduction des termes alors qu’un choix a déjà été validé. Joignez les entrées utiles du glossaire et vérifiez que le texte traduit les respecte sans modifier le sens."
        },
        {
          "text": "Uniquement le glossaire, sans les paragraphes.",
          "why": "Incorrect. Le glossaire indique comment traduire les termes ; il ne remplace pas les deux paragraphes à traduire. L’IA ne doit pas reconstituer le contenu absent. Fournissez les paragraphes autorisés et les seules entrées utiles du glossaire, puis contrôlez le sens de la traduction."
        },
        {
          "text": "Un résumé des deux paragraphes, à traduire.",
          "why": "Incorrect. Un résumé peut omettre des précisions ou des nuances du texte source. Le traduire ne répond donc pas à la demande de traduction intégrale des deux paragraphes. Utilisez le texte original autorisé avec le glossaire, puis vérifiez que le résultat conserve le sens et les informations."
        }
      ]
    },
    {
      "kind": "qcm",
      "theme": "Nouveautés · Tâches d’équipe Work",
      "q": "Une tâche d’équipe est lancée dans Work. Qui doit valider le résultat avant son utilisation ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 3 : validation humaine par un responsable désigné ; accès et autorisations vérifiés pour les tâches partagées.",
      "slides": [
        2,
        3
      ],
      "correct": 3,
      "options": [
        {
          "text": "La première personne qui ouvre le fichier.",
          "why": "Incorrect. L’ouverture du fichier ne désigne pas automatiquement la personne chargée de le valider. Cette personne peut être le valideur si elle a été désignée, mais ce n’est pas le critère proposé ici. Il faut identifier le responsable de la tâche partagée et lui faire contrôler le résultat avant utilisation."
        },
        {
          "text": "L’IA, une fois la tâche terminée.",
          "why": "Incorrect. L’IA produit ou prépare le résultat, mais ne remplace pas la responsabilité humaine prévue par le support. La fin de la tâche ne vaut pas validation. Un responsable désigné doit vérifier le résultat et les autorisations applicables avant son utilisation."
        },
        {
          "text": "La personne qui a le moins de tâches en cours.",
          "why": "Incorrect. La disponibilité peut aider à répartir le travail, mais elle n’attribue pas à elle seule la responsabilité de validation. La personne retenue doit être explicitement désignée pour la tâche et contrôler le résultat avant utilisation, quel que soit son niveau de charge."
        },
        {
          "text": "Le responsable désigné pour cette tâche.",
          "why": "Correct. Le travail partagé a besoin d’un responsable identifié pour éviter que chacun suppose la validation faite par un autre. Ce responsable contrôle l’exactitude, les sources et la confidentialité avant utilisation. Les nouvelles fonctions de Work restent soumises aux accès disponibles et aux autorisations Advancy."
        },
        {
          "text": "Personne, si le modèle utilisé est récent.",
          "why": "Incorrect. Un modèle récent n’exonère pas l’équipe de contrôler les faits, les calculs, les sources et la confidentialité. La performance annoncée ne constitue pas une validation du cas traité. Il faut toujours un responsable désigné pour vérifier le résultat de la tâche partagée."
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
          "why": "Correct. L’approbation de l’outil et l’usage du compte professionnel prévu sont deux conditions de départ. Le caractère non sensible du message et les réglages d’historique ne les remplacent pas. Vérifiez aussi que le contenu transmis est autorisé ; en cas de doute, consultez le Manager / Principal avant tout dépôt."
        },
        {
          "text": "L’utiliser si le texte ne contient aucun nom.",
          "why": "Incorrect. L’absence de noms ne suffit pas à autoriser l’outil : le contrôle porte aussi sur le service et le compte utilisés. Un texte sans nom peut rester professionnel ou confidentiel. Faites confirmer l’approbation Advancy et utilisez l’accès professionnel prévu avant de transmettre le message."
        },
        {
          "text": "L’utiliser pour un seul essai.",
          "why": "Incorrect. Un essai unique transmet déjà du contenu au service. Son caractère ponctuel ne remplace donc pas l’approbation de l’outil. Attendez la validation Advancy et utilisez le compte prévu ; pour cette formation, les exemples sont fictifs ou anonymisés et restent soumis aux règles internes."
        },
        {
          "text": "L’utiliser dès que l’historique est désactivé.",
          "why": "Incorrect. Désactiver l’historique est un réglage du fournisseur, pas une approbation Advancy du service. Cela ne donne aucune autorisation supplémentaire sur les données ou le compte. Faites confirmer l’outil et l’accès professionnel, puis limitez le contenu à l’extrait autorisé nécessaire."
        },
        {
          "text": "L’utiliser avec un compte personnel.",
          "why": "Incorrect. Le support exclut le compte personnel pour ce travail professionnel. Il ne permet pas de contourner l’absence d’approbation du service et ne remplace pas l’accès Advancy prévu. Utilisez un outil approuvé avec le compte professionnel autorisé et faites clarifier tout doute avant le dépôt."
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
          "why": "Incorrect. L’accroche LinkedIn est l’exemple donné pour Chat : explorer ou reformuler un texte dans une conversation. La question demande l’exemple choisi pour Codex, à savoir une transformation répétée de fichiers dont on contrôle les scripts et les modifications. Ces repères ne sont pas des limites exclusives entre outils."
        },
        {
          "text": "Fiabiliser une transformation répétée de fichiers en contrôlant les modifications.",
          "why": "Correct. Le support illustre Codex par le contrôle technique : utiliser les fichiers locaux autorisés, voir les scripts et les modifications, puis fiabiliser une transformation répétée. Chat est illustré par une accroche LinkedIn et Work par un classeur à reprendre. Ce sont des repères d’usage, pas des interdictions d’utiliser un autre mode."
        },
        {
          "text": "Explorer une première idée par un échange de questions.",
          "why": "Incorrect. Explorer une idée par un échange correspond au repère de conversation présenté pour Chat. Ici, il faut reconnaître l’exemple Codex du support : contrôler et répéter une transformation de fichiers locaux. La distinction décrit les exemples enseignés, sans rendre les capacités des outils exclusives."
        },
        {
          "text": "Clarifier la demande avant de commencer un texte.",
          "why": "Incorrect. Clarifier le brief est utile dans tous les modes. Ce n’est donc pas l’exemple spécifique de Codex demandé par la question. Le support met en avant, pour Codex, les fichiers locaux, les scripts visibles et les transformations répétées dont on examine les modifications et les résultats."
        },
        {
          "text": "Obtenir une ébauche en réponse à une question.",
          "why": "Incorrect. La FAQ du support associe une question, une reformulation ou une ébauche au repère Chat. L’exemple Codex est un processus sur fichiers avec contrôle technique et transformations répétées. Il s’agit d’identifier l’exemple présenté, pas d’affirmer qu’une ébauche serait impossible dans un autre mode."
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
          "why": "Incorrect. Une moyenne décrit les autres critères, pas celui pour lequel les notes n’apportent aucune preuve. L’utiliser créerait une évaluation non documentée. Conservez le critère dans la grille, indiquez « Non évalué » et listez le point à clarifier avec le recruteur."
        },
        {
          "text": "Une note déduite de l’aisance orale du candidat.",
          "why": "Incorrect. L’énoncé ne fournit aucun élément sur le critère ; déduire une note de l’aisance orale ajouterait une appréciation non documentée. Il faut séparer les propos du candidat des observations du recruteur et ne noter que ce qui est étayé. Ici, indiquez « Non évalué » et demandez une clarification."
        },
        {
          "text": "Une note de zéro.",
          "why": "Incorrect. Une note de zéro est une évaluation négative, alors que l’absence d’information signifie seulement que le critère n’a pas été évalué. Elle ne doit pas être inventée. Gardez la rubrique, indiquez « Non évalué » et signalez le besoin d’un élément complémentaire."
        },
        {
          "text": "« Non évalué », avec un point à clarifier.",
          "why": "Correct. « Non évalué » distingue une absence de preuve d’une mauvaise performance. Le critère reste dans la grille approuvée, sans note ni citation inventée. Listez les questions complémentaires et les contradictions à clarifier. Le recruteur habilité valide l’évaluation et décide de la suite."
        },
        {
          "text": "Supprimer ce critère de la grille.",
          "why": "Incorrect. Supprimer la rubrique masque le fait que l’évaluation est incomplète et modifie la grille approuvée. Le support demande de conserver les rubriques et leur ordre. Indiquez « Non évalué » pour ce critère et faites apparaître le point à clarifier avant validation par le recruteur."
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
          "why": "Correct. Les textes, tableaux et graphiques doivent rester modifiables dans PowerPoint. Il faut garder le masque, les polices et les couleurs approuvés, adapter le récit au public étudiant et conserver les faits vérifiés. Avant diffusion, relisez le diaporama et contrôlez que ses objets sont réellement éditables."
        },
        {
          "text": "Un PowerPoint composé uniquement d’images des slides.",
          "why": "Incorrect. L’extension PowerPoint ne suffit pas : une image de slide ne contient pas les textes et graphiques comme objets séparés à modifier. Elle peut préserver l’apparence tout en empêchant les retouches demandées. Livrez les objets natifs modifiables en conservant le modèle approuvé."
        },
        {
          "text": "Un PDF sans le fichier PowerPoint.",
          "why": "Incorrect. Un PDF peut être utile pour diffuser une version figée, mais il ne fournit pas le PowerPoint modifiable demandé à l’équipe. Il faut livrer le fichier PowerPoint source avec textes, tableaux et graphiques éditables ; un PDF peut s’y ajouter pour la consultation."
        },
        {
          "text": "Une vidéo du diaporama.",
          "why": "Incorrect. La vidéo permet de regarder le diaporama, pas de modifier les textes et graphiques dans le fichier PowerPoint. Elle ne remplit donc pas le besoin de réutilisation. Fournissez le support source modifiable, avec le modèle du cabinet et les faits vérifiés."
        },
        {
          "text": "Des captures d’écran de chaque slide.",
          "why": "Incorrect. Les captures montrent l’apparence des slides, sans fournir leurs objets PowerPoint séparés. Les retouches demanderaient de reconstituer le contenu. Livrez plutôt les textes, tableaux et graphiques modifiables dans le modèle approuvé, puis vérifiez la mise en page avant diffusion."
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
          "why": "Incorrect. Une définition courante peut différer de celle retenue par l’équipe : par exemple, le dénominateur d’un taux peut changer. L’IA ne doit pas choisir cette convention à votre place. Faites préciser les définitions manquantes, puis appliquez-les de façon stable au classeur."
        },
        {
          "text": "Déduire les définitions à partir du nom des colonnes.",
          "why": "Incorrect. Un intitulé de colonne ne précise pas toujours la population, la période ou le dénominateur du calcul. Déduire la définition risquerait de produire un indicateur juste en apparence mais différent de celui attendu. Faites clarifier la règle et les données nécessaires avant le calcul."
        },
        {
          "text": "Remplacer les valeurs inconnues par zéro.",
          "why": "Incorrect. Zéro est une donnée numérique ; une valeur inconnue est une information manquante. Remplacer la seconde par la première peut fausser les totaux et les taux. Signalez la lacune, faites préciser la définition de l’indicateur et les données nécessaires, puis calculez uniquement ce qui est étayé."
        },
        {
          "text": "Reprendre les chiffres de la semaine précédente.",
          "why": "Incorrect. Les chiffres précédents ne définissent pas la méthode de calcul et ne décrivent pas nécessairement la période actuelle. Les recopier masquerait la lacune. Faites clarifier les indicateurs, puis recalculez-les à partir de l’export autorisé en vérifiant formules, dates, doublons et dénominateurs."
        },
        {
          "text": "Repérer les définitions manquantes et les faire clarifier.",
          "why": "Correct. Le brief doit rendre les lacunes visibles au lieu de laisser l’IA inventer une règle. Faites préciser, pour chaque indicateur, ce qui est compté, la période ou le groupe de candidats et le dénominateur du taux. Distinguez l’activité hebdomadaire de la conversion d’une même cohorte, puis vérifiez les formules et totaux."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Usage · Crédits et validation",
      "q": "Le support rappelle une enveloppe de 1 500 crédits. Le travail prévu risque de la dépasser. Que faire avant de le lancer ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 3, 16 : outils et comptes approuvés ; estimation de la consommation et accord au-delà de l’enveloppe de 1 500 crédits rappelée dans le support.",
      "slides": [
        2,
        3,
        16
      ],
      "correct": 2,
      "options": [
        {
          "text": "Lancer le travail puis demander un accord après le dépassement.",
          "why": "Incorrect. La règle rappelée dans le support exige un accord avant d’engager le dépassement prévu. Une demande après consommation ne respecte pas ce préalable. Estimez le besoin, choisissez une capacité adaptée à la qualité attendue et obtenez l’accord requis avant de dépasser l’enveloppe."
        },
        {
          "text": "Choisir le modèle le plus puissant sans estimer la consommation.",
          "why": "Incorrect. Le modèle le plus puissant n’autorise pas automatiquement une consommation supérieure à l’enveloppe. Le support demande de vérifier qualité, effort et consommation. Estimez le besoin, retenez une capacité suffisante pour la tâche et demandez l’accord requis si le travail dépasse le plafond rappelé."
        },
        {
          "text": "Estimer le besoin et obtenir l’accord requis avant de dépasser l’enveloppe.",
          "why": "Correct. Les 1 500 crédits sont la règle interne rappelée par le support, pas un tarif universel des modèles. Il faut estimer la consommation du travail prévu, tester une capacité adaptée et obtenir l’accord requis avant d’engager le dépassement. Un résultat satisfaisant lors d’un essai ne remplace pas cet accord."
        },
        {
          "text": "Découper le travail en petites tâches pour éviter de demander un accord.",
          "why": "Incorrect. Découper le travail peut aider à le contrôler, mais ne supprime pas la consommation totale. Ce découpage ne permet donc pas d’éviter l’accord prévu pour un dépassement de l’enveloppe. Estimez l’ensemble du besoin et obtenez la validation requise avant de l’engager."
        },
        {
          "text": "Terminer le travail avec un compte personnel.",
          "why": "Incorrect. Le compte personnel contournerait le cadre de travail approuvé sans résoudre la question de l’autorisation. Le support exige les outils et comptes Advancy prévus. Restez dans ce cadre, estimez le besoin et demandez l’accord requis pour le dépassement au lieu de changer de compte."
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
          "why": "Incorrect. Demander plusieurs versions est utile pour explorer des idées, mais un besoin encore ambigu peut conduire à trois réponses inadaptées. Commencez par faire reformuler la demande et préciser le public, les contraintes et le résultat attendu. Comparez ensuite les variantes sur ces critères."
        },
        {
          "text": "Laisser l’IA choisir ce que « dynamique » signifie.",
          "why": "Incorrect. « Dynamique » peut viser le récit, la mise en page ou l’animation. Laisser l’IA choisir sans vérifier son interprétation risque de produire le mauvais changement. Faites reformuler le besoin, clarifiez le résultat attendu et les contraintes, puis demandez plusieurs approches."
        },
        {
          "text": "Répéter la même demande en ajoutant « très professionnel ».",
          "why": "Incorrect. « Très professionnel » reste un jugement général : il ne précise ni le problème à résoudre ni le résultat attendu. Répéter la même demande ne lève donc pas le malentendu. Faites reformuler l’objectif et précisez le public, les changements souhaités et les contraintes avant les variantes."
        },
        {
          "text": "Faire reformuler le besoin et préciser le public, les contraintes et le résultat.",
          "why": "Correct. La reformulation permet de vérifier ce que l’IA a compris de « plus dynamique ». Précisez le public, l’objectif, le format, les contraintes et ce qui doit changer. Vérifiez cette compréhension, puis mobilisez la créativité avec plusieurs approches à comparer. Les retours précis permettent ensuite d’améliorer le résultat."
        },
        {
          "text": "Choisir les couleurs avant de définir l’objectif.",
          "why": "Incorrect. Les couleurs règlent un aspect visuel, mais ne définissent pas l’objectif ni le sens de « dynamique ». Elles ne suffisent donc pas à éviter le malentendu. Clarifiez d’abord le besoin et faites-le reformuler, puis choisissez des solutions graphiques cohérentes avec ce brief."
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
          "why": "Incorrect. Une explication fluide ou détaillée peut accompagner un chiffre faux. Le style ne permet pas de départager deux résultats d’un même calcul. Revenez aux données et à la formule, identifiez l’écart, donnez un retour précis à l’IA puis vérifiez le résultat corrigé."
        },
        {
          "text": "Vérifier les sources et calculs, faire corriger l’erreur puis contrôler la correction.",
          "why": "Correct. Pour un même calcul sur les mêmes données, revenez aux sources, à la formule et aux hypothèses pour identifier l’écart. Expliquez précisément ce qui doit être corrigé, puis refaites le contrôle sur la nouvelle réponse. C’est l’association de l’esprit critique et de la persévérance : itérer jusqu’à un résultat vérifié, sans se fier à l’assurance du texte."
        },
        {
          "text": "Retenir la réponse approuvée par le plus de modèles.",
          "why": "Incorrect. Un vote entre modèles ne prouve pas quel calcul correspond aux sources. Plusieurs réponses peuvent reprendre la même hypothèse erronée. Utilisez les données et la règle de calcul comme référence, expliquez l’erreur identifiée à l’IA et contrôlez sa correction."
        },
        {
          "text": "Relancer jusqu’à obtenir deux réponses identiques.",
          "why": "Incorrect. La répétition d’un résultat indique une stabilité, pas sa justesse : une même erreur peut être reproduite. Il faut confronter les réponses aux sources et refaire le calcul attendu. Corrigez ensuite avec un retour précis et vérifiez la nouvelle version, même si elle paraît convaincante."
        },
        {
          "text": "Accepter la réponse du modèle le plus récent.",
          "why": "Incorrect. La nouveauté du modèle ne garantit pas l’exactitude de ce calcul particulier. Changer de modèle peut aider, mais ne remplace pas le diagnostic. Vérifiez les données, la formule et les hypothèses, faites corriger l’écart identifié puis contrôlez le résultat obtenu."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · Analyse des KPI avec l’IA",
      "q": "Un Excel autorisé présente les KPI de recrutement des quatre dernières semaines. Vous voulez comprendre leur évolution. Que demander à l’IA ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 5, 9 : analyser les tendances et anomalies d’un export autorisé, avec des définitions stables et des contrôles des calculs et des données manquantes.",
      "slides": [
        5,
        9
      ],
      "correct": 4,
      "options": [
        {
          "text": "Expliquer chaque baisse par une cause certaine.",
          "why": "Incorrect. Une baisse observée ne suffit pas à prouver sa cause. Plusieurs explications peuvent être possibles et le fichier ne permet pas toujours de les départager. Demandez à l’IA de distinguer les constats chiffrés des hypothèses, puis de préciser les informations à recueillir pour vérifier ces pistes avant de conclure."
        },
        {
          "text": "Comparer les taux même si leur définition change.",
          "why": "Incorrect. Deux taux ne sont comparables que si leur définition, leur période et leur population sont cohérentes. Un changement de dénominateur peut créer une variation artificielle. Demandez à l’IA de signaler ces différences et de limiter la comparaison aux indicateurs comparables, en distinguant activité hebdomadaire et conversion d’une même cohorte."
        },
        {
          "text": "Remplacer les valeurs manquantes par zéro.",
          "why": "Incorrect. Zéro représente une valeur connue ; une donnée manquante représente une information absente. Les confondre fausse les totaux, les taux et les tendances. Demandez à l’IA de signaler les lacunes, d’expliquer leur effet sur l’analyse et de préciser les données nécessaires. Les chiffres absents doivent être complétés depuis une source autorisée."
        },
        {
          "text": "Résumer l’activité sans préciser les chiffres utilisés.",
          "why": "Incorrect. Un résumé sans chiffres ni périodes ne permet pas de vérifier les écarts annoncés. Demandez à l’IA d’appuyer chaque constat sur les valeurs du fichier, d’indiquer les semaines comparées et de montrer les calculs utiles. Contrôlez ces éléments dans Excel avant de valider la synthèse et de la diffuser."
        },
        {
          "text": "Comparer les KPI, chiffrer les écarts et proposer des pistes à vérifier.",
          "why": "Correct. L’IA peut comparer les semaines, chiffrer les écarts et rédiger une synthèse des tendances et anomalies. Demandez les chiffres et périodes utilisés, avec des définitions de KPI identiques. Les causes proposées restent des hypothèses à vérifier. Faites signaler les données manquantes, puis contrôlez les calculs et validez l’analyse avant diffusion."
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
          "why": "Correct. Les publications validées servent à repérer le ton, la structure et la longueur ; les nouvelles notes fournissent les faits de l’événement. Signalez ce qui reste à confirmer et n’inventez pas de détail. Proposez des accroches, adaptez le brouillon à LinkedIn ou à la newsletter et faites-le valider avant toute publication autorisée."
        },
        {
          "text": "Changer le nom d’un ancien événement et garder ses chiffres.",
          "why": "Incorrect. Changer le nom ne rend pas les chiffres d’un ancien événement applicables au nouveau. Ils ne peuvent être repris que s’ils sont aussi vérifiés pour le cas actuel. Utilisez les anciennes publications pour le style et les nouvelles notes pour les faits ; signalez les informations à confirmer."
        },
        {
          "text": "Choisir un ton très promotionnel, différent des références.",
          "why": "Incorrect. Le ton proposé s’éloigne explicitement des références alors que la demande est de conserver le style habituel. Analysez d’abord les publications validées, puis rédigez avec les nouveaux faits. Les formulations trop promotionnelles ou éloignées de ce style doivent être signalées et retravaillées."
        },
        {
          "text": "Recopier une publication sans tenir compte des nouvelles notes.",
          "why": "Incorrect. Une publication de référence donne un exemple de style, pas le contenu du nouvel événement. La recopier sans utiliser les notes risque de conserver des faits devenus inadaptés. Rédigez un nouveau brouillon avec les faits actuels, le ton habituel et une adaptation au canal, puis faites-le valider."
        },
        {
          "text": "Inventer les détails manquants pour rendre le message plus vivant.",
          "why": "Incorrect. La créativité porte sur les accroches et la formulation, pas sur l’invention des faits. Les détails absents des notes doivent rester à confirmer. Utilisez les publications pour le ton, les nouvelles notes pour le contenu et soumettez un brouillon adapté au canal avant publication."
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
          "why": "Incorrect. Un résultat passé peut illustrer le rendu attendu, mais ne suffit pas à expliquer comment produire et vérifier les prochains résultats. Le skill doit réunir la méthode, les consignes, les modèles et les contrôles réutilisables. Les sources de chaque nouvelle exécution doivent rester autorisées et à jour."
        },
        {
          "text": "À supprimer la validation humaine des résultats.",
          "why": "Incorrect. Réutiliser une méthode ne rend pas automatiquement exact chaque nouveau résultat : les données et les situations peuvent changer. Le skill conserve aussi les contrôles et les cas d’erreur connus. Un responsable entretient la méthode et valide le résultat ; la revue humaine n’est pas supprimée."
        },
        {
          "text": "À réunir les consignes, modèles et contrôles réutilisables.",
          "why": "Correct. Le projet réunit le brief, les références et les fichiers autorisés, avec des droits de partage vérifiés. Le skill formalise une méthode réutilisable : consignes, modèles, exemples, contrôles et cas d’erreur connus. Un responsable entretient cette méthode et valide les résultats à chaque utilisation."
        },
        {
          "text": "À donner automatiquement accès à tous les fichiers de l’équipe.",
          "why": "Incorrect. La création d’un skill ne donne aucune autorisation supplémentaire pour partager les données. Le projet doit rester limité au contexte autorisé et aux droits vérifiés. Le rôle du skill est de réutiliser la méthode, les modèles et les contrôles, pas d’élargir l’accès aux fichiers."
        },
        {
          "text": "À remplacer le modèle approuvé par un format choisi à chaque fois.",
          "why": "Incorrect. Changer le format au hasard à chaque exécution fait perdre la cohérence de la méthode validée. Le skill réutilise les modèles et les contrôles approuvés ; son responsable peut les entretenir et les faire évoluer. Il ne remplace pas systématiquement le modèle par un format improvisé."
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
          "why": "Incorrect. Un PDF à dates fixes peut servir à diffuser un état du planning, mais il ne recalcule pas les échéances lorsque le jour J change. Le suivi doit être un tableau modifiable dont les dates dépendent du jour J. Une nouvelle version de consultation peut ensuite être produite à partir de ce suivi actualisé."
        },
        {
          "text": "Un Excel dont toutes les dates sont saisies manuellement.",
          "why": "Incorrect. Excel convient au suivi, mais des dates saisies manuellement ne changent pas automatiquement avec le jour J. Le choix proposé laisse donc les échéances à reprendre une par une. Reliez les dates à J et aux dépendances utiles, puis contrôlez le résultat après tout report de l’événement."
        },
        {
          "text": "Un texte qui énumère les anciennes échéances.",
          "why": "Incorrect. Énumérer les anciennes échéances conserve une description du planning initial, sans relation de calcul avec la nouvelle date. Le suivi doit recalculer les dates à partir de J et rendre visibles les responsabilités, priorités, dépendances et retards. Une liste figée ne remplit pas cette fonction."
        },
        {
          "text": "Une image du calendrier initial.",
          "why": "Incorrect. Une image peut aider à communiquer un calendrier, mais elle ne porte pas les calculs et statuts modifiables nécessaires au suivi. Elle ne recalcule donc rien lorsque J change. Utilisez un Excel ou tableau partagé approuvé avec des dates liées à J, puis vérifiez les échéances actualisées."
        },
        {
          "text": "Un tableau modifiable avec des dates calculées à partir du jour J.",
          "why": "Correct. Les échéances calculées à partir du jour J se mettent à jour lorsque la date change. Le suivi comporte aussi responsables, contacts, priorités, dépendances, filtres et statuts modifiables. Adaptez les délais illustratifs à l’événement réel, vérifiez le recalcul et désignez les responsables avant de programmer les rappels."
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
          "why": "Correct. L’absence d’erreur d’exécution prouve que le script a terminé, pas que le classeur est juste. Comparez les données et formules aux sources et règles validées, puis vérifiez totaux, dates, doublons et dénominateurs. Examinez aussi les modifications et la mise en page. Le fichier doit répondre au brief et être validé avant utilisation."
        },
        {
          "text": "Constater que le programme affiche un message de réussite.",
          "why": "Incorrect. Un message de réussite indique que le programme est allé à son terme ; il ne démontre pas que les règles métier et les chiffres sont corrects. Une mauvaise formule peut s’exécuter sans erreur. Comparez le classeur aux sources et définitions validées, puis contrôlez formules, totaux et modifications."
        },
        {
          "text": "Vérifier seulement que le fichier existe dans le bon dossier.",
          "why": "Incorrect. Le bon dossier et la présence du fichier sont des contrôles de livraison, pas des preuves d’exactitude du contenu. Un fichier présent peut contenir des omissions ou des calculs faux. Il faut aussi comparer ses données et formules aux sources et règles validées, puis vérifier les résultats attendus."
        },
        {
          "text": "Vérifier seulement que le classeur s’ouvre.",
          "why": "Incorrect. L’ouverture du classeur vérifie qu’il est lisible, pas que ses valeurs et formules sont justes. Un fichier peut s’ouvrir normalement malgré une erreur de calcul ou une donnée manquante. Contrôlez les chiffres, les totaux, les définitions et les modifications par rapport aux sources autorisées."
        },
        {
          "text": "Comparer uniquement la taille du nouveau fichier à l’ancien.",
          "why": "Incorrect. La taille du fichier peut varier pour des raisons sans rapport avec l’exactitude des chiffres. Une taille similaire ne prouve pas que les formules et les données sont correctes. Vérifiez le contenu du classeur par rapport aux sources et règles validées, ainsi que les modifications produites par le script."
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
          "why": "Incorrect. Remplacer directement l’original saute le contrôle de données déjà signalées comme anciennes et l’essai prévu sur une copie. Vérifiez d’abord les villes, les périodes, la fraîcheur et les champs Canva. Gardez la dernière version vérifiée, testez une copie et faites valider le remplacement ou la publication."
        },
        {
          "text": "Réutiliser les valeurs anciennes sans le signaler.",
          "why": "Incorrect. Une valeur ancienne ne doit pas être présentée comme une météo fraîche sans signalement. Contrôlez la date de collecte, le lieu, la période et la source ; signalez ce qui est absent ou ancien. Si la mise à jour n’est pas vérifiée, conservez la dernière version vérifiée au lieu de la remplacer silencieusement."
        },
        {
          "text": "Vérifier les données et les champs Canva, puis tester une copie.",
          "why": "Correct. La collecte météo et la mise à jour Canva sont deux étapes. Vérifiez source approuvée, ville, date, fuseau, observation ou prévision, unités et fraîcheur ; signalez les valeurs absentes ou anciennes. Vérifiez ensuite les accès ainsi que les noms et types des champs Canva, remplissez une copie et contrôlez le résultat avant remplacement ou publication validés."
        },
        {
          "text": "Appliquer la même météo à toutes les villes.",
          "why": "Incorrect. La météo dépend du lieu et de la période : appliquer une même valeur à toutes les villes peut associer des informations inadaptées aux bureaux. Préparez une ligne par bureau avec ville, période locale, conditions, température, source et date de collecte. Vérifiez ces données avant l’essai sur une copie Canva."
        },
        {
          "text": "Supposer que les champs Canva se rempliront sans vérification.",
          "why": "Incorrect. Des données météo correctes ne garantissent pas que les champs et accès du design permettent leur mise à jour. Vérifiez les noms et types des champs, les accès et le paramétrage. Testez le remplissage sur une copie et contrôlez les lieux, périodes et valeurs avant de valider le remplacement."
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
          "why": "Incorrect. La demande impose de valider le texte et les destinataires avant tout envoi. Un contrôle après l’envoi ne satisfait pas cette condition. La tâche doit préparer les brouillons à partir du suivi autorisé, les présenter au pilote et attendre l’accord explicite ; l’envoi nécessite aussi une connexion compatible."
        },
        {
          "text": "Préparer les brouillons et attendre votre validation avant l’envoi.",
          "why": "Correct. La tâche consulte le suivi autorisé et prépare les brouillons pour les responsables concernés. Elle attend la validation du texte et des destinataires avant tout envoi, qui nécessite une connexion compatible et un accord explicite. Précisez horaire et fuseau, signalez une source absente ou ancienne, évitez les doublons et arrêtez le suivi à la clôture."
        },
        {
          "text": "Afficher un simple rappel sans préparer les brouillons demandés.",
          "why": "Incorrect. Un rappel personnel peut aider à penser aux relances, mais il ne produit pas les brouillons explicitement demandés. Programmez la lecture du suivi autorisé et la préparation des messages pour les actions concernées. Les textes et destinataires restent à valider avant l’envoi, avec signalement d’une source indisponible ou ancienne."
        },
        {
          "text": "Envoyer sans validation les messages aux destinataires déjà connus.",
          "why": "Incorrect. Connaître déjà le destinataire ne valide ni le contenu de la relance ni l’état actuel de ses tâches. La consigne de validation préalable s’applique à tous les messages. Préparez les brouillons à partir du suivi à jour, puis faites valider texte et destinataires avant tout envoi autorisé."
        },
        {
          "text": "Envoyer l’ancien message à tous les contacts.",
          "why": "Incorrect. L’ancien message peut ne plus correspondre aux tâches, aux responsables ou aux échéances actuels. Un envoi à tous risque aussi de relancer des actions closes ou de créer des doublons. Utilisez le suivi autorisé, préparez les brouillons utiles et faites valider le texte et chaque destinataire avant l’envoi."
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
          "why": "Incorrect. La personne qui parle le plus d’une action n’en est pas nécessairement responsable. Les notes ne permettent pas ici de l’attribuer sans inventer une décision. Conservez l’action, indiquez que responsable et échéance sont à préciser et faites compléter ces points par le pilote lors de la validation."
        },
        {
          "text": "Fixer automatiquement une échéance pour la semaine suivante.",
          "why": "Incorrect. Une date standard pour la semaine suivante n’apparaît pas dans les notes : elle serait inventée. L’IA doit rendre la lacune visible plutôt que créer un engagement. Gardez l’action avec « Responsable et échéance à préciser », puis faites confirmer ces informations par le pilote."
        },
        {
          "text": "Supprimer l’action du compte rendu.",
          "why": "Incorrect. Supprimer l’action ferait perdre une information utile des notes au lieu de montrer ce qui reste à clarifier. Conservez-la fidèlement, sans transformer une discussion en décision confirmée. Signalez le responsable et l’échéance manquants, puis soumettez le compte rendu au pilote pour validation."
        },
        {
          "text": "Conserver l’action et indiquer « Responsable et échéance à préciser ».",
          "why": "Correct. Le compte rendu reste fidèle aux notes et n’invente pas de responsabilité ni de date. Conservez l’action avec les informations absentes signalées et distinguez discussions et décisions. Pour les autres actions, reprenez les responsables et échéances effectivement indiqués. Le pilote complète les points ouverts et valide le compte rendu."
        },
        {
          "text": "Reprendre le responsable et la date d’une ancienne réunion.",
          "why": "Incorrect. Une ancienne réunion peut fournir une piste à vérifier, mais elle ne prouve pas que le même responsable et la même date s’appliquent ici. Ne les recopiez pas comme des faits confirmés. Signalez les informations manquantes et faites-les clarifier par le pilote avant validation du compte rendu."
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
    quizVersion: "2026-11-02-admin-fr-r3",
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
