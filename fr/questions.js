(function () {
  "use strict";

  const source = {
  "audience": "ADMIN",
  "training": {
    "date": "2026-11-02",
    "slideCount": 16,
    "title": "L’IA chez Advancy"
  },
  "questions": [
    {
      "kind": "scenario",
      "theme": "Communication · Charte IA",
      "q": "Vous préparez une communication interne à partir de notes de réunion. Le responsable autorise l’IA uniquement pour les décisions générales ; les noms et situations individuelles sont explicitement exclus. Quelle méthode respecte la Charte IA ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 16 : autorisation des données, extrait utile, noms réels seulement si nécessaires et autorisés, validation humaine.",
      "correct": 2,
      "options": [
        {
          "text": "Déposer toutes les notes dans l’outil approuvé, demander une anonymisation automatique, puis contrôler le brouillon.",
          "why": "Incorrect. Le contrôle de la sortie intervient trop tard : les informations individuelles exclues auraient déjà été transmises à l’outil."
        },
        {
          "text": "Faire anonymiser l’ensemble des notes par un collègue, puis les déposer intégralement pour conserver le contexte.",
          "why": "Incorrect. L’anonymisation réduit un risque mais ne justifie pas de transmettre des éléments sans rapport avec les décisions générales demandées."
        },
        {
          "text": "Retirer les éléments individuels, ne transmettre que l’extrait nécessaire et faire relire la communication avant diffusion.",
          "why": "Correct. La méthode respecte l’autorisation donnée, la minimisation des informations et la responsabilité humaine."
        },
        {
          "text": "Créer un extrait des décisions mais conserver le nom des responsables de chaque action afin de rendre le message opérationnel.",
          "why": "Incorrect. Les noms sont explicitement exclus ; il faut traiter leur réintégration séparément lors de la revue humaine, si elle est autorisée."
        },
        {
          "text": "Utiliser toutes les notes dans un outil approuvé configuré sans conservation, puis supprimer la conversation.",
          "why": "Incorrect. Les réglages de conservation et la suppression ultérieure ne remplacent pas l’autorisation sur les informations transmises."
        }
      ],
      "slides": [
        2,
        16
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · Données autorisées",
      "q": "Vous devez préparer une synthèse d’entretien. Le dossier complet du candidat contient des informations RH exclues de l’usage IA ; seules des notes limitées et identifiées comme autorisées peuvent être utilisées. Comment préparer l’entrée ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 7 : limiter les données aux notes autorisées ; un identifiant candidat ne remplace pas une autorisation.",
      "slides": [
        2,
        7
      ],
      "correct": 4,
      "options": [
        {
          "text": "Déposer le dossier complet dans l’outil approuvé, puis demander à l’IA de retirer les rubriques RH avant de rédiger la synthèse.",
          "why": "Incorrect. Les rubriques exclues seraient déjà transmises avant que l’IA ne les retire."
        },
        {
          "text": "Remplacer le nom du candidat par un identifiant dans tout le dossier, puis transmettre ce dossier anonymisé pour préserver le contexte.",
          "why": "Incorrect. L’identifiant ne rend pas autorisées les informations RH explicitement exclues."
        },
        {
          "text": "Masquer les rubriques exclues dans le fichier d’origine, puis joindre ce fichier pour conserver les notes autorisées dans leur contexte.",
          "why": "Incorrect. Masquer du contenu ne le retire pas du fichier transmis."
        },
        {
          "text": "Donner accès au dossier complet en lecture seule, en demandant à l’IA de ne consulter que les notes d’entretien utiles.",
          "why": "Incorrect. La lecture seule limite les modifications du dossier, mais pas l’accès aux informations exclues."
        },
        {
          "text": "Créer localement un extrait des seules notes autorisées, utiliser un identifiant candidat et vérifier cet extrait avant de le transmettre.",
          "why": "Correct. La préparation respecte le périmètre autorisé et le cas d’usage présenté. Le dossier complet reste hors de l’outil."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Traduction · Minimisation",
      "q": "Vous devez traduire deux paragraphes autorisés d’une procédure de douze pages. Ils emploient des termes définis ailleurs dans un glossaire approuvé ; les autres sections ne concernent pas la traduction. Quelles informations fournir à l’IA ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 13 : fournir le minimum autorisé, utiliser un glossaire approuvé et préserver le sens de la traduction.",
      "correct": 1,
      "options": [
        {
          "text": "Déposer la procédure complète, car la cohérence terminologique prime sur le volume transmis.",
          "why": "Incorrect. Le besoin de cohérence ne justifie pas l’accès aux dix pages sans rapport avec les paragraphes à traduire."
        },
        {
          "text": "Transmettre les deux paragraphes et un court glossaire autorisé des termes définis ailleurs, puis faire vérifier le sens et la terminologie.",
          "why": "Correct. Cette méthode apporte le contexte utile sans élargir inutilement le contenu transmis."
        },
        {
          "text": "Transmettre uniquement les deux paragraphes sans glossaire et demander au modèle de conserver tels quels tous les termes ambigus.",
          "why": "Incorrect. La minimisation est respectée, mais l’absence du contexte terminologique nécessaire augmente le risque d’une traduction incohérente."
        },
        {
          "text": "Joindre une ancienne traduction approuvée de la procédure complète comme exemple de style.",
          "why": "Incorrect. Un exemple utile doit lui aussi être limité aux passages nécessaires et autorisés."
        },
        {
          "text": "Faire résumer les deux paragraphes, puis traduire le résumé pour réduire encore le volume.",
          "why": "Incorrect. Traduire un résumé change le contenu et peut supprimer des obligations présentes dans le texte source."
        }
      ],
      "slides": [
        2,
        13
      ]
    },
    {
      "kind": "qcm",
      "theme": "Nouveautés · Capacités et autorisations",
      "q": "La présentation évoque de nouvelles capacités visuelles, le travail sur fichiers et les tâches d’équipe. Avant de les utiliser sur une mission, quelle conclusion reste valable, même si le nouveau modèle semble plus performant ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 2, 3 : les nouvelles capacités restent soumises à la Charte, aux accès disponibles et aux outils autorisés.",
      "slides": [
        2,
        3
      ],
      "correct": 3,
      "options": [
        {
          "text": "Confirmer que l’outil est approuvé, puis utiliser tout le dossier de la mission afin de tester les nouvelles capacités dans leur ensemble.",
          "why": "Incorrect. L’approbation de l’outil ne vaut pas autorisation pour toutes les informations du dossier."
        },
        {
          "text": "Vérifier seulement que le nouveau modèle est disponible dans l’offre Enterprise avant de lui confier les données de la mission.",
          "why": "Incorrect. La disponibilité technique ne dispense pas de vérifier les autorisations de contenu et d’usage."
        },
        {
          "text": "Choisir le modèle qui semble le plus capable et réutiliser son premier résultat comme référence pour les prochaines exécutions.",
          "why": "Incorrect. Le support demande un test du résultat avant la répétition et le respect de la Charte."
        },
        {
          "text": "Vérifier l’accès disponible, l’approbation de l’outil et les données autorisées, puis tester le résultat avant de répéter le processus.",
          "why": "Correct. Une nouvelle capacité peut élargir les usages possibles ; elle ne modifie pas les autorisations internes."
        },
        {
          "text": "Activer le travail en équipe puis partager les références de la mission avec tous les participants pour éviter les manques de contexte.",
          "why": "Incorrect. Le travail en équipe exige un périmètre d’accès autorisé et un responsable désigné, pas un partage général."
        }
      ]
    },
    {
      "kind": "qcm",
      "theme": "Support · Outil approuvé",
      "q": "Un collègue propose un outil externe dont l’approbation par Advancy n’est pas confirmée pour reformuler un message non sensible. Il active l’option « ne pas conserver mes données ». Quel critère reste décisif ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 2 : utiliser les outils et comptes Advancy approuvés ; les réglages du fournisseur ne remplacent pas cette validation.",
      "correct": 0,
      "options": [
        {
          "text": "L’outil doit être approuvé par Advancy et utilisé avec l’accès professionnel prévu, même si le texte est non sensible.",
          "why": "Correct. Les réglages proposés par un fournisseur ne remplacent pas la validation de l’outil et du compte."
        },
        {
          "text": "L’outil peut être utilisé si le collègue confirme par écrit qu’aucune donnée personnelle n’apparaît.",
          "why": "Incorrect. L’autorisation du contenu ne vaut pas approbation de l’outil."
        },
        {
          "text": "L’outil peut être testé sur un seul message, car un essai ponctuel crée une exposition négligeable.",
          "why": "Incorrect. Une utilisation ponctuelle reste une transmission à un service non approuvé."
        },
        {
          "text": "L’outil est acceptable si un compte professionnel est utilisé et si l’historique est désactivé.",
          "why": "Incorrect. Un compte professionnel et l’absence d’historique ne suffisent pas lorsque le service lui-même n’est pas approuvé."
        },
        {
          "text": "L’accord du Manager suffit si le gain de temps est documenté.",
          "why": "Incorrect. Un bénéfice opérationnel et un accord local ne remplacent pas le processus d’approbation de l’outil."
        }
      ],
      "slides": [
        2
      ]
    },
    {
      "kind": "qcm",
      "theme": "Chat, Work et Codex · Repères d’usage",
      "q": "Vous devez reformuler une accroche LinkedIn, reprendre un classeur de recrutement, puis fiabiliser une transformation récurrente de fichiers locaux. Quelle association reprend les exemples du support, sans rendre ces modes exclusifs ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 4, 16 : Chat pour une reformulation, Work pour un livrable sur fichiers, Codex pour une transformation technique contrôlée.",
      "slides": [
        4,
        16
      ],
      "correct": 1,
      "options": [
        {
          "text": "Work pour l’accroche, Chat pour un conseil général sur le classeur, puis un nouveau brouillon Chat à chaque transformation de fichiers.",
          "why": "Incorrect. Cette association laisse de côté le livrable Excel et la fiabilisation technique récurrente demandés."
        },
        {
          "text": "Chat pour l’accroche, Work pour le classeur, Codex pour la transformation récurrente avec examen des scripts et des modifications.",
          "why": "Correct. Cette association suit les repères du support. D’autres modes peuvent aider ; le choix dépend du résultat, des outils et des contrôles nécessaires."
        },
        {
          "text": "Codex pour tous les besoins, à condition de convertir au préalable chaque accroche et chaque classeur en programme informatique.",
          "why": "Incorrect. Le support ne demande pas de transformer chaque tâche en code ; il propose des modes adaptés au besoin."
        },
        {
          "text": "Chat pour l’accroche, un Project pour ranger le classeur, puis Work pour conserver l’historique des transformations sans les contrôler.",
          "why": "Incorrect. Ranger les fichiers ne produit pas le classeur attendu, et l’historique ne remplace pas le contrôle des transformations."
        },
        {
          "text": "Chat pour les trois besoins, en demandant un texte final qui décrit le classeur et les transformations à effectuer chaque semaine.",
          "why": "Incorrect. Un texte décrivant le travail ne remplace pas les fichiers modifiables et le processus contrôlé demandés."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · Synthèse d’entretien",
      "q": "Les notes autorisées d’un entretien renseignent plusieurs critères d’une grille approuvée, mais ne contiennent aucune preuve sur le leadership. Que demander à l’IA pour obtenir une évaluation utilisable par le recruteur ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 7 : conserver la grille, relier les critères aux preuves, distinguer les propos des observations et ne pas inventer de note.",
      "slides": [
        7
      ],
      "correct": 3,
      "options": [
        {
          "text": "Conserver la grille et attribuer au leadership la moyenne des critères documentés, en précisant que cette note est une estimation.",
          "why": "Incorrect. Une moyenne ne constitue pas une preuve sur un critère non évalué pendant l’entretien."
        },
        {
          "text": "Conserver les rubriques mais déduire le leadership de l’aisance orale du candidat, pour ne pas laisser la grille incomplète.",
          "why": "Incorrect. Cette déduction ajoute une appréciation que les notes ne documentent pas."
        },
        {
          "text": "Réorganiser la grille autour d’une impression générale, puis recommander directement l’embauche pour faciliter la comparaison.",
          "why": "Incorrect. Le support demande de garder la grille et laisse la décision au recruteur habilité."
        },
        {
          "text": "Conserver les rubriques, citer les éléments disponibles, distinguer propos et observations, indiquer « Non évalué » sans preuve et lister les questions à clarifier.",
          "why": "Correct. La synthèse reste factuelle et traçable. Le recruteur habilité valide l’évaluation et décide de la suite."
        },
        {
          "text": "Rédiger un compte rendu fluide en fusionnant les propos du candidat et les observations du recruteur, puis faire relire le texte.",
          "why": "Incorrect. La relecture ne remplace pas la distinction demandée entre ces deux types d’information."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · Présentation écoles",
      "q": "Vous reprenez la présentation approuvée du cabinet pour une intervention auprès d’étudiants. Les faits sont validés et l’équipe veut pouvoir modifier le PowerPoint après livraison. Quelle demande correspond au support ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 8 : adapter le récit au public étudiant, préserver les faits et le masque, livrer des objets modifiables.",
      "slides": [
        8
      ],
      "correct": 0,
      "options": [
        {
          "text": "Structurer le récit pour les étudiants, alléger les titres, conserver les faits et le masque, puis livrer des textes, tableaux et graphiques modifiables.",
          "why": "Correct. La demande améliore le fond et la forme tout en conservant les éléments approuvés et un PowerPoint réutilisable."
        },
        {
          "text": "Conserver les faits et le récit actuels, puis livrer chaque slide sous forme d’image dans un PowerPoint pour garantir son apparence.",
          "why": "Incorrect. Les images empêchent de modifier les textes et les graphiques comme demandé."
        },
        {
          "text": "Reprendre le masque et compléter les slides avec des chiffres attractifs trouvés par l’IA, sans attendre leur validation.",
          "why": "Incorrect. Les nouveaux faits doivent être vérifiés ; le support demande de repérer les preuves manquantes."
        },
        {
          "text": "Réécrire l’ensemble du support dans un nouveau style graphique et privilégier un récit général identique pour tous les publics.",
          "why": "Incorrect. Cette demande abandonne le masque approuvé et l’adaptation au public étudiant."
        },
        {
          "text": "Transformer la présentation en PDF après avoir raccourci les paragraphes, afin d’éviter toute modification avant l’intervention.",
          "why": "Incorrect. Un PDF seul ne répond pas au besoin d’un PowerPoint modifiable."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Brief · Tableau de bord recrutement",
      "q": "Vous souhaitez améliorer le classeur KPI hebdomadaire du recrutement à partir d’un export autorisé et du fichier existant. Certaines définitions d’indicateurs manquent. Quel brief prépare le mieux un résultat fiable ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 5, 9 : préciser sources, périmètre, livrable, lacunes et contrôles, notamment les doublons, dates et dénominateurs.",
      "slides": [
        5,
        9
      ],
      "correct": 4,
      "options": [
        {
          "text": "Améliore ce tableau de bord, choisis les indicateurs qui semblent les plus utiles et rends une présentation claire de la tendance.",
          "why": "Incorrect. Le résultat et les contrôles restent flous ; les indicateurs manquants ne doivent pas être choisis sans clarification."
        },
        {
          "text": "Reproduis le modèle à l’identique, complète les définitions selon les usages habituels et ne signale que les écarts très importants.",
          "why": "Incorrect. Des usages supposés ne remplacent pas les définitions validées du recrutement."
        },
        {
          "text": "Compare les chiffres disponibles et livre un commentaire de tendance ; le fichier Excel et ses formules seront contrôlés plus tard.",
          "why": "Incorrect. Le brief sépare la conclusion de la vérification des calculs qui la soutiennent."
        },
        {
          "text": "Utilise les fichiers fournis et des données publiques de recrutement pour compléter les cellules vides avant de produire le classeur.",
          "why": "Incorrect. Cette consigne élargit les sources et transforme des lacunes internes en valeurs non comparables."
        },
        {
          "text": "Utilise ces fichiers autorisés, conserve le modèle, signale les définitions manquantes et livre un Excel avec formules, sources, contrôles et commentaire à valider.",
          "why": "Correct. Le brief définit un livrable vérifiable et rend visibles les lacunes, au lieu de laisser l’IA inventer les définitions."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Usage · Crédits et validation",
      "q": "Les règles rappelées dans la présentation prévoient une enveloppe de 1 500 crédits. Un essai contrôlé est satisfaisant, mais le traitement complet risque de dépasser cette enveloppe. Quelle conduite respecte ce cadre ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 3, 16 : tester la qualité et la consommation, puis obtenir l’accord requis avant une hausse de l’enveloppe.",
      "slides": [
        3,
        16
      ],
      "correct": 2,
      "options": [
        {
          "text": "Lancer le traitement complet avec le réglage qui a réussi, puis demander une hausse si le dépassement est confirmé en fin de tâche.",
          "why": "Incorrect. L’accord requis doit précéder l’engagement du traitement qui dépasse l’enveloppe."
        },
        {
          "text": "Choisir systématiquement le modèle le plus puissant, car un résultat de meilleure qualité justifie automatiquement une consommation supérieure.",
          "why": "Incorrect. Une capacité supérieure ne remplace ni l’estimation ni l’accord prévu par les règles internes."
        },
        {
          "text": "Estimer la consommation, conserver une capacité suffisante et obtenir l’accord requis avant d’engager un traitement qui dépasse l’enveloppe.",
          "why": "Correct. La qualité du pilote ne dispense pas de respecter les règles internes de consommation et d’approbation."
        },
        {
          "text": "Diviser le même travail en petites tâches pour que chacune reste sous l’enveloppe de 1 500 crédits et ne nécessite pas d’accord.",
          "why": "Incorrect. Le fractionnement ne supprime pas la consommation totale ni l’approbation requise pour la hausse."
        },
        {
          "text": "Continuer le traitement avec un compte personnel lorsque l’enveloppe professionnelle risque de ne plus être suffisante.",
          "why": "Incorrect. Le support impose les outils et comptes Advancy approuvés, et non le contournement de l’enveloppe."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Qualités IA · Précision verbale et créativité",
      "q": "Vous demandez de « rendre le support plus dynamique », mais cette formule peut désigner le récit, la mise en page ou l’animation. Quel premier échange combine précision de la demande et créativité sans lancer une refonte mal comprise ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 5, 6 : faire reformuler le besoin, préciser le résultat et les contraintes, puis explorer plusieurs approches.",
      "slides": [
        5,
        6
      ],
      "correct": 3,
      "options": [
        {
          "text": "Demander immédiatement trois versions entièrement refaites, puis choisir celle dont la mise en page paraît la plus convaincante.",
          "why": "Incorrect. Les variantes seraient produites avant d’avoir clarifié ce que « dynamique » signifie ici."
        },
        {
          "text": "Demander à l’IA de choisir elle-même le sens de « dynamique », puisque sa créativité doit compléter les informations absentes.",
          "why": "Incorrect. La créativité ne remplace pas la clarification d’un besoin qui conditionne le résultat."
        },
        {
          "text": "Répéter la demande en insistant sur un résultat très professionnel, puis accepter la première version qui semble aboutie.",
          "why": "Incorrect. L’insistance ne précise ni le périmètre, ni les contraintes, ni le résultat attendu."
        },
        {
          "text": "Faire reformuler le besoin par l’IA, préciser le public, les contraintes et le résultat attendu, puis demander plusieurs approches à comparer.",
          "why": "Correct. La reformulation vérifie la compréhension avant l’exécution ; les variantes permettent ensuite d’explorer des solutions utiles."
        },
        {
          "text": "Décrire seulement les couleurs et le nombre de slides, puis laisser l’IA déterminer librement le public et l’objectif du support.",
          "why": "Incorrect. Le public et l’objectif doivent être précisés ; les seuls paramètres graphiques ne suffisent pas."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Qualités IA · Esprit critique et persévérance",
      "q": "L’IA produit deux versions convaincantes d’une analyse, mais leurs chiffres et leurs conclusions diffèrent. Vous disposez des sources autorisées. Quelle démarche associe esprit critique et persévérance ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 5, 6 : vérifier les sources, calculs et hypothèses, identifier les erreurs et itérer avec un retour précis.",
      "slides": [
        5,
        6
      ],
      "correct": 1,
      "options": [
        {
          "text": "Retenir la version dont le raisonnement est le plus détaillé, car la précision de l’explication permet de départager les chiffres.",
          "why": "Incorrect. Une explication détaillée ne prouve pas l’exactitude des données ou du calcul."
        },
        {
          "text": "Comparer les chiffres aux sources, contrôler les calculs et hypothèses, expliquer les écarts à l’IA puis vérifier la version corrigée.",
          "why": "Correct. La démarche apporte des preuves et un retour précis. Une nouvelle version doit être contrôlée, même si elle paraît plus convaincante."
        },
        {
          "text": "Faire voter plusieurs modèles sur les deux versions et retenir celle qui obtient le plus d’avis favorables.",
          "why": "Incorrect. L’accord entre modèles ne remplace pas la confrontation avec les sources disponibles."
        },
        {
          "text": "Redemander la même analyse jusqu’à obtenir deux réponses identiques, puis considérer cette stabilité comme une validation.",
          "why": "Incorrect. Des réponses stables peuvent répéter la même erreur ; il faut vérifier les éléments de preuve."
        },
        {
          "text": "Passer directement au modèle le plus puissant et considérer sa réponse comme la correction définitive du désaccord.",
          "why": "Incorrect. Changer de modèle ne dispense pas de diagnostiquer l’écart ni de contrôler le résultat corrigé."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Recrutement · KPI et dénominateurs",
      "q": "Sur une même cohorte clôturée, le suivi compte 120 candidatures, 48 présélections, 24 entretiens, 6 offres et 4 acceptations. Selon les définitions du support, quelle lecture des taux de conversion est correcte ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 9 : calculer chaque conversion avec le bon dénominateur sur une cohorte définie ; distinguer ces taux de l’activité de la semaine.",
      "slides": [
        9
      ],
      "correct": 4,
      "options": [
        {
          "text": "Taux d’entretien : 20 % (24/120) ; taux d’offre : 5 % (6/120) ; taux d’acceptation : 3,3 % (4/120), avec les libellés du support.",
          "why": "Incorrect. Ces ratios partent tous des candidatures ; ce ne sont pas les conversions entre étapes définies dans le support."
        },
        {
          "text": "Taux d’entretien : 50 % (24/48) ; taux d’offre : 12,5 % (6/48) ; taux d’acceptation : 16,7 % (4/24).",
          "why": "Incorrect. Les taux d’offre et d’acceptation n’utilisent pas leur dénominateur défini : respectivement les entretiens et les offres."
        },
        {
          "text": "Calculer chaque taux en divisant les événements de la semaine par les candidatures de la semaine, même si les candidats diffèrent.",
          "why": "Incorrect. Cette méthode mélange l’activité de la semaine et la conversion d’une cohorte définie."
        },
        {
          "text": "Moyenner les cinq volumes du suivi et exprimer ce résultat en pourcentage pour obtenir un taux global de conversion.",
          "why": "Incorrect. Une moyenne de volumes ne définit pas un taux de conversion ; il faut un numérateur et un dénominateur cohérents."
        },
        {
          "text": "Taux d’entretien : 50 % (24/48) ; taux d’offre : 25 % (6/24) ; taux d’acceptation : 66,7 % (4/6), sur cette même cohorte.",
          "why": "Correct. Chaque taux relie deux étapes successives selon les définitions du support ; les volumes hebdomadaires ne sont pas mélangés aux conversions."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Marketing · LinkedIn et newsletter",
      "q": "Vous avez quatre publications validées et des notes autorisées sur un nouvel événement. Vous voulez une publication LinkedIn et une version newsletter dans le ton habituel du cabinet. Quel usage des références est pertinent ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 10 : les publications précédentes fournissent le style ; les nouveaux faits proviennent du brief et restent à valider.",
      "slides": [
        10
      ],
      "correct": 0,
      "options": [
        {
          "text": "Analyser le ton, la structure et la longueur des anciens textes, utiliser les nouveaux faits, proposer deux accroches et adapter un brouillon à chaque canal.",
          "why": "Correct. Les références servent au style ; le brief fournit les faits du nouvel événement. Les brouillons sont relus et validés avant publication."
        },
        {
          "text": "Reprendre une publication validée presque à l’identique, changer le nom de l’événement et conserver les autres chiffres comme exemples.",
          "why": "Incorrect. Les chiffres d’une ancienne publication ne décrivent pas nécessairement le nouvel événement."
        },
        {
          "text": "Demander une version plus promotionnelle que les références et publier les deux formats dès que le ton paraît convaincant.",
          "why": "Incorrect. La demande porte sur le ton habituel, et la publication exige une autorisation explicite."
        },
        {
          "text": "Produire le même texte pour LinkedIn et la newsletter, afin de garantir une cohérence de style sans modifier la longueur.",
          "why": "Incorrect. Le message doit être adapté à chaque canal ; une cohérence de ton n’impose pas un texte identique."
        },
        {
          "text": "Compléter les notes avec les détails qui manquent dans les anciens textes, puis ne faire vérifier que les nouvelles formulations.",
          "why": "Incorrect. Les détails absents du nouveau brief doivent être signalés, et non repris d’un autre événement sans vérification."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Projets et skills · Contexte et méthode",
      "q": "L’équipe reprend chaque semaine un suivi avec les mêmes références autorisées, un modèle et des contrôles validés. Elle veut conserver le contexte et réutiliser sa méthode, sans élargir le partage des données. Quelle organisation choisir ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 15 : un projet rassemble le contexte autorisé ; un skill réunit méthode, modèles et contrôles, avec un responsable.",
      "slides": [
        15
      ],
      "correct": 2,
      "options": [
        {
          "text": "Regrouper tous les fichiers ADMIN dans un projet partagé avec l’ensemble de l’équipe, puis laisser les droits se régler au fil des usages.",
          "why": "Incorrect. Le périmètre et les droits de partage doivent être vérifiés avant de réunir les références."
        },
        {
          "text": "Créer un skill qui conserve le résultat du premier essai et réutilise ce résultat comme source unique des semaines suivantes.",
          "why": "Incorrect. Un résultat passé ne remplace pas la méthode, les données actualisées, les modèles et les contrôles."
        },
        {
          "text": "Réunir le contexte autorisé dans un projet aux droits vérifiés, formaliser la méthode, les modèles et les contrôles dans un skill, et désigner un responsable.",
          "why": "Correct. Le projet facilite la continuité du contexte ; le skill rend la méthode réutilisable sans supprimer les contrôles ni la responsabilité."
        },
        {
          "text": "Utiliser un projet pour conserver les références, puis supprimer la revue humaine puisque les mêmes instructions sont réutilisées.",
          "why": "Incorrect. Un contexte stable ne rend pas le résultat automatiquement fiable ; un responsable doit le valider."
        },
        {
          "text": "Créer un nouveau projet à chaque exécution et réécrire la méthode de mémoire pour éviter de conserver des instructions trop anciennes.",
          "why": "Incorrect. Cette organisation perd la continuité recherchée et empêche l’entretien d’une méthode validée et réutilisable."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Événements · Rétroplanning interactif",
      "q": "La date d’un événement est reportée de deux semaines. Le suivi doit rester modifiable et permettre de voir les responsabilités, les dépendances et les retards. Quel livrable répond au rétroplanning interactif présenté ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 11 : lier les échéances au jour J, nommer les responsables, montrer dépendances, priorités, statuts et retards.",
      "slides": [
        11
      ],
      "correct": 4,
      "options": [
        {
          "text": "Un calendrier PDF aux dates actualisées, accompagné d’une liste de contacts et d’un récapitulatif des tâches classées par priorité.",
          "why": "Incorrect. Le PDF ne permet ni recalcul des échéances ni mise à jour directe des statuts comme demandé."
        },
        {
          "text": "Un Excel contenant toutes les tâches et leurs dates saisies manuellement, sans relations avec le jour J pour garder le fichier simple.",
          "why": "Incorrect. Sans lien avec J, le report exige des modifications manuelles et peut laisser des échéances incohérentes."
        },
        {
          "text": "Un tableau qui recalcule toutes les dates mais conserve « équipe ADMIN » comme seul responsable de l’ensemble des tâches.",
          "why": "Incorrect. Le support demande un responsable identifié par tâche pour rendre le suivi et les relances opérationnels."
        },
        {
          "text": "Un tableau partagé qui reprend à l’identique les délais de l’exemple et déclenche les rappels avant de nommer les responsables.",
          "why": "Incorrect. Les délais doivent être adaptés à l’événement et les responsables désignés avant de programmer les rappels."
        },
        {
          "text": "Un Excel ou tableau partagé approuvé avec dates liées au jour J, responsables, contacts, priorités, dépendances, filtres et statuts modifiables.",
          "why": "Correct. Les échéances sont recalculées quand J change et les blocages restent visibles ; les délais illustratifs sont adaptés à l’événement réel."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Codex · Transformations récurrentes",
      "q": "Chaque semaine, des exports de recrutement autorisés, de format stable, doivent alimenter le même classeur. Vous voulez fiabiliser les transformations et pouvoir examiner ce qui change avant utilisation. Quel usage de Codex correspond au support ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 4, 5, 9, 15 : borner les fichiers, formaliser une transformation répétable, examiner les scripts et modifications et vérifier les sorties.",
      "slides": [
        4,
        5,
        9,
        15
      ],
      "correct": 0,
      "options": [
        {
          "text": "Définir les sources et règles validées, préparer une transformation réutilisable limitée aux fichiers utiles, examiner les modifications et contrôler le classeur produit.",
          "why": "Correct. La transformation devient répétable et vérifiable ; la méthode, les modèles et les contrôles peuvent être entretenus pour les exécutions suivantes."
        },
        {
          "text": "Donner accès à tous les dossiers de recrutement et laisser Codex déduire les définitions d’indicateurs nécessaires à chaque exécution.",
          "why": "Incorrect. Le périmètre reste trop large et les définitions ne doivent pas être déduites sans validation."
        },
        {
          "text": "Rendre la transformation automatique dès qu’un premier fichier semble correct, puis se limiter à vérifier que le programme se termine.",
          "why": "Incorrect. Une exécution sans erreur technique ne prouve pas que les données, formules et indicateurs sont corrects."
        },
        {
          "text": "Créer un skill qui décrit la transformation mais ne précise ni les fichiers à utiliser, ni les règles de calcul, ni les contrôles de sortie.",
          "why": "Incorrect. Une méthode réutilisable doit définir ses entrées, ses règles et ses contrôles pour être fiable."
        },
        {
          "text": "Demander chaque semaine un commentaire sur les chiffres copiés dans la conversation, puis considérer ce texte comme le classeur actualisé.",
          "why": "Incorrect. Le commentaire ne remplace pas la transformation contrôlée des fichiers et le classeur demandé."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Marketing · Météo et Canva",
      "q": "Une présentation Canva doit afficher la météo des villes des bureaux. Les champs de données et les accès ne sont pas encore vérifiés. Certaines valeurs météo sont anciennes. Quelle méthode correspond à la démonstration envisagée ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 12 : séparer la collecte météo du remplissage Canva, vérifier lieux, périodes, unités, fraîcheur et champs, puis tester une copie.",
      "slides": [
        12
      ],
      "correct": 2,
      "options": [
        {
          "text": "Demander à Canva de mettre à jour les libellés visibles, sans vérifier s’ils correspondent à des champs nommés dans le design.",
          "why": "Incorrect. La mise à jour par données exige de vérifier les noms et les types des champs concernés."
        },
        {
          "text": "Remplir les champs avec les dernières valeurs disponibles, en conservant les valeurs anciennes sans signalement pour ne pas laisser de vide.",
          "why": "Incorrect. La fraîcheur et les valeurs absentes ou anciennes doivent être visibles et contrôlées."
        },
        {
          "text": "Vérifier la source météo, les villes, périodes et valeurs manquantes, structurer les données, vérifier les champs et accès Canva, puis tester une copie avant validation.",
          "why": "Correct. La collecte et la mise à jour du design sont deux étapes distinctes. La faisabilité dépend des accès et du paramétrage ; une valeur ancienne doit être signalée."
        },
        {
          "text": "Récupérer les températures par pays et appliquer le même fuseau à tous les bureaux avant de remplacer directement la présentation utilisée.",
          "why": "Incorrect. Le support demande les villes et périodes locales, ainsi qu’un essai sur une copie avant remplacement."
        },
        {
          "text": "Structurer correctement les données météo, puis considérer que toute présentation Canva pourra être actualisée sans autre vérification.",
          "why": "Incorrect. Des données bien structurées ne garantissent pas que les accès et les champs du design permettent la mise à jour."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Automatisations · Rappel, brouillon et envoi",
      "q": "Vous voulez un suivi chaque lundi à 09 h, Europe/Paris : repérer les tâches événementielles en retard et préparer des relances. Vous demandez explicitement de valider les destinataires et les textes avant tout envoi. Quel paramétrage retenir ?",
      "source": "Formation Advancy du 2 novembre 2026, slides 14, 16 : séparer rappel et envoi, utiliser la source autorisée, signaler les échecs, éviter les doublons et arrêter à la clôture.",
      "slides": [
        14,
        16
      ],
      "correct": 1,
      "options": [
        {
          "text": "Envoyer automatiquement les relances aux responsables déjà connus, puis faire valider uniquement les nouveaux destinataires.",
          "why": "Incorrect. La demande impose de valider les destinataires et les textes avant tout envoi, même pour des responsables connus."
        },
        {
          "text": "Planifier la lecture du suivi autorisé et la préparation des brouillons, signaler les sources indisponibles ou anciennes, éviter les doublons et attendre la validation avant envoi.",
          "why": "Correct. Le suivi respecte l’action demandée. L’envoi reste distinct et suppose un outil compatible ainsi que l’autorisation explicite requise."
        },
        {
          "text": "Planifier seulement un rappel « penser aux relances », sans lecture du suivi ni préparation de messages pour les responsables concernés.",
          "why": "Incorrect. Ce rappel personnel ne réalise pas le suivi et les brouillons explicitement demandés."
        },
        {
          "text": "Utiliser la dernière liste disponible si la source est inaccessible et préparer les relances sans signaler que les informations peuvent être anciennes.",
          "why": "Incorrect. Le support demande de signaler l’échec ou l’ancienneté de la source sans inventer l’état des tâches."
        },
        {
          "text": "Relancer toutes les tâches de la liste chaque lundi, y compris les tâches closes, pour ne manquer aucun responsable.",
          "why": "Incorrect. Il faut éviter les doublons et arrêter le suivi à la clôture ; toutes les tâches ne justifient pas une relance."
        }
      ]
    },
    {
      "kind": "scenario",
      "theme": "Documents · Notes en compte rendu",
      "q": "Des notes autorisées mêlent discussions, décisions et actions envisagées. Pour une action, ni responsable ni échéance n’ont été précisés. Que demander à l’IA avant de faire valider le compte rendu par le pilote ?",
      "source": "Formation Advancy du 2 novembre 2026, slide 13 : distinguer décisions et discussions, extraire les actions et signaler les informations non précisées.",
      "slides": [
        13
      ],
      "correct": 3,
      "options": [
        {
          "text": "Attribuer l’action à la personne qui en a le plus parlé et fixer une échéance standard pour rendre le compte rendu directement opérationnel.",
          "why": "Incorrect. La personne qui intervient le plus n’est pas nécessairement le responsable ; l’échéance serait inventée."
        },
        {
          "text": "Présenter toutes les actions évoquées comme des décisions, puis demander au pilote de retirer celles qui ne sont pas confirmées.",
          "why": "Incorrect. Le compte rendu doit distinguer les discussions et les décisions avant validation."
        },
        {
          "text": "Retirer l’action incomplète du compte rendu pour éviter de diffuser une liste qui contient des informations manquantes.",
          "why": "Incorrect. Le support demande de signaler les informations non précisées, pas de supprimer l’action évoquée."
        },
        {
          "text": "Séparer discussions et décisions, lister les actions, reprendre les responsables et dates présents, et signaler ce qui n’est pas précisé au lieu de le compléter.",
          "why": "Correct. Le compte rendu reste fidèle aux notes et rend les lacunes visibles pour la validation par le pilote."
        },
        {
          "text": "Fusionner discussions, décisions et actions dans un résumé fluide, sans conserver de liste de points à clarifier.",
          "why": "Incorrect. Cette synthèse efface les distinctions et les lacunes qui rendent le compte rendu vérifiable et utile."
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
    quizVersion: "2026-11-02-admin-fr",
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
      chooseAnswer: "Choisissez la réponse la plus adaptée aux contraintes de cette situation.",
      privacyBeforeAnswer: "Pour répondre, cochez la confirmation de lecture de la notice de confidentialité dans le panneau du questionnaire.",
      submitAnswer: "Valider la réponse",
      finalizeAssessment: "Terminer le questionnaire",
      nextQuestion: "Question suivante",
      restartAttempt: "Recommencer cette tentative",
      scenarioLabel: "Mise en situation ADMIN",
      qcmLabel: "Question de repérage",
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
