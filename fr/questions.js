(function () {
  "use strict";

  function question(kind, theme, prompt, source, correct, options) {
    return {
      kind,
      theme,
      q: prompt,
      source,
      correct,
      options: options.map(function (option) {
        return { text: option[0], why: option[1] };
      })
    };
  }

  const source = {
    audience: "ADMIN",
    questions: [
      question(
        "scenario",
        "Communication · Charte IA",
        "Vous préparez une communication interne à partir de notes de réunion. Le responsable autorise l’IA uniquement pour les décisions générales ; les noms et situations individuelles sont explicitement exclus. Quelle méthode respecte la Charte IA ?",
        "Présentation septembre 2026, slide 2 : vérifier l’autorisation des informations, utiliser un outil approuvé, limiter les entrées et prévoir une revue humaine.",
        2,
        [
          ["Déposer toutes les notes dans l’outil approuvé, demander une anonymisation automatique, puis contrôler le brouillon.", "Incorrect. Le contrôle de la sortie intervient trop tard : les informations individuelles exclues auraient déjà été transmises à l’outil."],
          ["Faire anonymiser l’ensemble des notes par un collègue, puis les déposer intégralement pour conserver le contexte.", "Incorrect. L’anonymisation réduit un risque mais ne justifie pas de transmettre des éléments sans rapport avec les décisions générales demandées."],
          ["Retirer les éléments individuels, ne transmettre que l’extrait nécessaire et faire relire la communication avant diffusion.", "Correct. La méthode respecte l’autorisation donnée, la minimisation des informations et la responsabilité humaine."],
          ["Créer un extrait des décisions mais conserver le nom des responsables de chaque action afin de rendre le message opérationnel.", "Incorrect. Les noms sont explicitement exclus ; il faut traiter leur réintégration séparément lors de la revue humaine, si elle est autorisée."],
          ["Utiliser toutes les notes dans un outil approuvé configuré sans conservation, puis supprimer la conversation.", "Incorrect. Les réglages de conservation et la suppression ultérieure ne remplacent pas l’autorisation sur les informations transmises."]
        ]
      ),
      question(
        "scenario",
        "Finance · Données interdites",
        "Un fichier de 800 paiements contient des coordonnées bancaires et des commentaires confidentiels. Vous avez seulement besoin des montants mensuels par statut. Quelle préparation est la plus pertinente avant d’utiliser l’IA ?",
        "Présentation septembre 2026, slide 2 : interdits absolus, données sensibles et obligation d’escalade en cas de doute.",
        4,
        [
          ["Masquer les colonnes bancaires dans Excel et transmettre le fichier, car les colonnes masquées ne seront pas affichées au modèle.", "Incorrect. Une colonne masquée reste présente dans le fichier et peut être lue par l’outil."],
          ["Exporter les 800 lignes avec seulement le montant et le statut, afin de préserver la possibilité de refaire tous les calculs.", "Incorrect. Les données ligne à ligne dépassent le besoin annoncé, qui porte uniquement sur des agrégats mensuels."],
          ["Donner un accès en lecture seule au fichier complet et supprimer la conversation dès que le tableau est produit.", "Incorrect. Le mode lecture seule protège le fichier source, mais pas les informations transmises à l’outil."],
          ["Remplacer les coordonnées bancaires par des identifiants fictifs tout en conservant les commentaires pour expliquer les anomalies.", "Incorrect. Les commentaires confidentiels restent inutiles pour calculer les montants par statut."],
          ["Produire localement un extrait agrégé et autorisé, vérifier qu’il ne contient ni colonne cachée ni commentaire, puis transmettre seulement ces totaux.", "Correct. La solution sépare le calcul nécessaire des données sensibles et réduit l’entrée au strict besoin."]
        ]
      ),
      question(
        "scenario",
        "Traduction · Minimisation",
        "Vous devez traduire deux paragraphes non sensibles d’une procédure interne de douze pages. Quel apport à l’IA est proportionné ?",
        "Présentation septembre 2026, slide 2 : n’utiliser que le minimum nécessaire et traiter la limite de dix pages comme un plafond, non comme une permission.",
        1,
        [
          ["Déposer la procédure complète, car la cohérence terminologique prime sur le volume transmis.", "Incorrect. Le besoin de cohérence ne justifie pas l’accès aux dix pages sans rapport avec les paragraphes à traduire."],
          ["Transmettre les deux paragraphes et un court glossaire autorisé des termes définis ailleurs, puis faire vérifier le sens et la terminologie.", "Correct. Cette méthode apporte le contexte utile sans élargir inutilement le contenu transmis."],
          ["Transmettre uniquement les deux paragraphes sans glossaire et demander au modèle de conserver tels quels tous les termes ambigus.", "Incorrect. La minimisation est respectée, mais l’absence du contexte terminologique nécessaire augmente le risque d’une traduction incohérente."],
          ["Joindre une ancienne traduction approuvée de la procédure complète comme exemple de style.", "Incorrect. Un exemple utile doit lui aussi être limité aux passages nécessaires et autorisés."],
          ["Faire résumer les deux paragraphes, puis traduire le résumé pour réduire encore le volume.", "Incorrect. Traduire un résumé change le contenu et peut supprimer des obligations présentes dans le texte source."]
        ]
      ),
      question(
        "scenario",
        "Mail · Revue humaine",
        "Chat rédige un e-mail annonçant un changement de procédure qui entre en vigueur à des dates différentes selon les bureaux. Le texte paraît fluide. Quelle revue apporte le plus de sécurité avant l’envoi ?",
        "Présentation septembre 2026, slides 2 et 3 : l’IA accélère le brouillon, mais l’ADMIN reste responsable du message final.",
        3,
        [
          ["Contrôler uniquement les dates, puisque le reste du texte reprend la formulation fournie dans le prompt.", "Incorrect. Les dates sont critiques, mais les destinataires, les exceptions locales et le ton peuvent aussi avoir été mal interprétés."],
          ["Transmettre le brouillon au responsable de la procédure et considérer son accord général comme suffisant pour l’envoi.", "Incorrect. L’accord du responsable est utile, mais il faut encore vérifier la liste des destinataires et l’adaptation par bureau."],
          ["Faire relire le message par un second modèle et retenir la version sur laquelle les deux modèles convergent.", "Incorrect. La convergence entre modèles ne remplace pas la comparaison avec la procédure de référence."],
          ["Vérifier dates, destinataires, règles citées et ton, puis obtenir l’approbation requise avant envoi.", "Correct. Le brouillon IA devient utilisable seulement après revue et décision humaines."],
          ["Envoyer d’abord le message à un petit bureau pour identifier les incompréhensions avant la diffusion générale.", "Incorrect. Un pilote ne doit pas servir à détecter des erreurs factuelles qui peuvent être vérifiées avant tout envoi."]
        ]
      ),
      question(
        "qcm",
        "Support · Outil approuvé",
        "Un collègue propose un outil externe plus rapide pour reformuler un message non sensible, en activant l’option « ne pas conserver mes données ». Quel critère reste décisif ?",
        "Présentation septembre 2026, slide 2 : utiliser exclusivement un outil approuvé avec l’accès professionnel autorisé.",
        0,
        [
          ["L’outil doit être approuvé par Advancy et utilisé avec l’accès professionnel prévu, même si le texte est non sensible.", "Correct. Les réglages proposés par un fournisseur ne remplacent pas la validation de l’outil et du compte."],
          ["L’outil peut être utilisé si le collègue confirme par écrit qu’aucune donnée personnelle n’apparaît.", "Incorrect. L’autorisation du contenu ne vaut pas approbation de l’outil."],
          ["L’outil peut être testé sur un seul message, car un essai ponctuel crée une exposition négligeable.", "Incorrect. Une utilisation ponctuelle reste une transmission à un service non approuvé."],
          ["L’outil est acceptable si un compte professionnel est utilisé et si l’historique est désactivé.", "Incorrect. Un compte professionnel et l’absence d’historique ne suffisent pas lorsque le service lui-même n’est pas approuvé."],
          ["L’accord du Manager suffit si le gain de temps est documenté.", "Incorrect. Un bénéfice opérationnel et un accord local ne remplacent pas le processus d’approbation de l’outil."]
        ]
      ),
      question(
        "scenario",
        "Mail · Choix de Chat",
        "Vous devez reformuler un rappel interne non sensible sur la réservation des salles et comparer trois tons possibles. Quel workflow est le plus adapté ?",
        "Présentation septembre 2026, slides 4 à 7 : Chat convient aux demandes ponctuelles, ciblées et conversationnelles.",
        1,
        [
          ["Utiliser Work avec un brief formel, produire un fichier de variantes et l’archiver pour de futurs rappels.", "Incorrect. Work pourrait réaliser la tâche, mais ajoute une exécution et un livrable inutiles pour ce besoin ponctuel."],
          ["Utiliser Chat avec le message nécessaire, demander trois variantes, puis choisir et relire la version finale.", "Correct. Chat est adapté à une itération courte sans chaîne d’outils ni livrable complexe."],
          ["Créer un Chat Project afin de conserver durablement le contexte et toutes les versions du rappel.", "Incorrect. Un Project devient utile pour un travail récurrent ; ici, la conservation du contexte n’apporte pas assez de valeur."],
          ["Créer un assistant no-code proposant les trois tons à chaque nouvelle demande.", "Incorrect. Industrialiser une tâche avant d’en avoir confirmé la fréquence et la méthode serait prématuré."],
          ["Demander à Chat une seule version très aboutie, puis la relire avant envoi.", "Incorrect. Cette approche est possible, mais elle répond moins bien au besoin explicite de comparer plusieurs tons avant de choisir."]
        ]
      ),
      question(
        "scenario",
        "Excel · Choix de Work",
        "Vous souhaitez utiliser l’IA pour consolider quatre fichiers autorisés de suivi logistique. Les colonnes diffèrent selon les bureaux et le livrable attendu est un Excel contrôlé ; la méthode n’est pas encore stabilisée. Quel environnement choisir ?",
        "Présentation septembre 2026, slides 5 à 7 : Work est adapté aux fichiers, aux outils et aux livrables multiétapes.",
        3,
        [
          ["Demander à Chat des règles génériques de nettoyage, puis appliquer manuellement ces règles dans chaque fichier.", "Incorrect. Cette approche peut aider à réfléchir, mais elle ne traite pas efficacement la consolidation ni la traçabilité du livrable."],
          ["Développer immédiatement avec Codex un script permanent couvrant toutes les variantes de colonnes observées.", "Incorrect. Un script réutilisable est prématuré tant que les variantes et les contrôles ne sont pas stabilisés."],
          ["Créer un assistant no-code qui apprend les correspondances au fil des fichiers et corrige ses erreurs en production.", "Incorrect. Les règles de correspondance doivent être explicites et testées avant d’être réutilisées."],
          ["Work, avec les seuls fichiers nécessaires, un brief précis, les permissions minimales et une revue du classeur produit.", "Correct. Work correspond à une exécution multiétape sur fichiers avec livrable fini et contrôles explicites."],
          ["Créer un Chat Project pour conserver les quatre fichiers et demander ensuite un tableau récapitulatif dans la conversation.", "Incorrect. Le Project organise le contexte, mais n’est pas le meilleur choix pour produire et contrôler un fichier Excel multiétape."]
        ]
      ),
      question(
        "scenario",
        "Support · Permissions",
        "Dans Work, un agent de support doit rechercher une procédure dans un dossier précis puis préparer une réponse à un prestataire. Il propose un accès plus large pour éviter les erreurs de contexte et un envoi automatique. Quel réglage est le plus équilibré ?",
        "Présentation septembre 2026, slide 7 : distinguer accès et actions, appliquer le moindre privilège et confirmer avant toute action externe.",
        0,
        [
          ["Donner un accès en lecture au seul dossier utile, limiter l’agent à la préparation d’un brouillon et valider le message avant l’envoi.", "Correct. Le réglage sépare correctement l’accès nécessaire de l’action externe qui engage l’entreprise."],
          ["Donner un accès en lecture à tout le disque partagé, mais interdire l’envoi automatique.", "Incorrect. Le contrôle de l’envoi est adéquat, mais le périmètre de lecture reste excessif."],
          ["Limiter l’accès au bon dossier et autoriser l’envoi automatique uniquement vers ce prestataire déjà référencé.", "Incorrect. Le périmètre documentaire est correct, mais la qualité et le contexte de chaque message doivent encore être vérifiés."],
          ["Donner un accès complet pendant la recherche, puis réduire les droits avant la rédaction du message.", "Incorrect. Une permission temporaire reste trop large si la recherche peut être réalisée dans un dossier identifié."],
          ["Copier les documents utiles dans un dossier dédié et autoriser l’agent à préparer puis envoyer la réponse.", "Incorrect. Le dossier dédié réduit l’accès, mais l’envoi externe ne doit pas être délégué sans validation du contenu final."]
        ]
      ),
      question(
        "scenario",
        "Finance · Qualité du brief",
        "Vous demandez à Work de comparer quatre offres fournisseurs autorisées. Deux offres omettent certains frais et le choix final reste au responsable achats. Quel brief donne la base d’analyse la plus fiable ?",
        "Présentation septembre 2026, slide 8 : préciser objectif, contexte, sources, exclusions, format de sortie et contrôles.",
        4,
        [
          ["Compare les prix connus, classe les offres et recommande la première ; les frais manquants seront vérifiés ensuite.", "Incorrect. Le classement serait trompeur tant que des composantes de coût importantes restent inconnues."],
          ["Construis le tableau le plus complet possible à partir des offres et d’informations publiques sur les fournisseurs.", "Incorrect. Ajouter des sources non demandées élargit le périmètre sans résoudre de façon contrôlée les données manquantes."],
          ["Estime les frais manquants à partir de la moyenne des autres offres et indique clairement qu’il s’agit d’hypothèses.", "Incorrect. Une hypothèse visible peut servir à une simulation, mais ne doit pas être confondue avec la comparaison factuelle demandée."],
          ["Produis l’Excel comparatif et propose un fournisseur, en laissant au responsable achats le soin de vérifier les données.", "Incorrect. La décision reste humaine, mais le brief ne prévoit ni signalement systématique des lacunes ni traçabilité des sources."],
          ["Compare uniquement les fichiers autorisés, selon les critères fournis, signale les données manquantes et livre un Excel avec sources et contrôles.", "Correct. Le brief rend le périmètre, les critères, la sortie et la vérification explicites."]
        ]
      ),
      question(
        "qcm",
        "RH · Crédits",
        "Une tâche RH non sensible et autorisée doit produire 60 fiches à partir du même modèle. Un essai sur trois fiches est satisfaisant avec un modèle intermédiaire. Quelle stratégie est la plus rationnelle ?",
        "Présentation septembre 2026, slide 9 : enveloppe mensuelle de 1 500 crédits et approbation requise pour une augmentation.",
        2,
        [
          ["Passer au modèle le plus avancé pour les 60 fiches afin de réduire au maximum le risque d’une reprise.", "Incorrect. Le pilote n’indique pas que la capacité supplémentaire soit nécessaire ; cette hausse augmenterait le coût sans problème identifié."],
          ["Produire directement les 60 fiches avec le modèle intermédiaire, puisque le pilote a réussi, puis contrôler seulement la dernière.", "Incorrect. Le choix du modèle est raisonnable, mais le plan de contrôle est insuffisant pour détecter une dérive en cours de série."],
          ["Estimer les crédits, conserver le modèle suffisant, traiter par lots avec contrôles intermédiaires et demander une approbation seulement si une hausse devient nécessaire.", "Correct. La stratégie combine maîtrise du coût, contrôle qualité et respect du processus d’augmentation des crédits."],
          ["Répartir les fiches entre plusieurs sessions afin que chaque exécution paraisse moins coûteuse.", "Incorrect. Le fractionnement masque la consommation globale sans améliorer ni la méthode ni les contrôles."],
          ["Reporter toute la tâche au mois suivant pour préserver l’enveloppe actuelle.", "Incorrect. Le report ne se justifie pas tant que le besoin peut être estimé et exécuté dans l’enveloppe avec un modèle suffisant."]
        ]
      ),
      question(
        "scenario",
        "Traduction · Modèle et effort",
        "Vous devez traduire une invitation logistique non sensible. Un glossaire approuvé existe et le texte contient une formule idiomatique qui avait posé problème lors d’un précédent essai. Quel réglage est le plus rationnel ?",
        "Présentation septembre 2026, slides 10 et 11 : choisir le niveau de capacité et d’effort nécessaire, puis augmenter seulement face à un problème identifié.",
        3,
        [
          ["Utiliser le modèle frontière avec l’effort maximal pour éviter toute ambiguïté, puis vérifier seulement la mise en page.", "Incorrect. Une capacité maximale ne dispense pas de contrôler le sens, notamment sur l’expression déjà identifiée comme difficile."],
          ["Utiliser le modèle le plus rapide et confier la vérification intégrale à un collègue bilingue.", "Incorrect. Cette solution peut fonctionner, mais transfère inutilement tout l’effort de qualité à la revue humaine."],
          ["Faire traduire le texte par deux modèles et retenir les formulations sur lesquelles ils convergent.", "Incorrect. Un consensus entre modèles ne garantit ni le respect du glossaire ni la justesse de l’expression idiomatique."],
          ["Utiliser le glossaire avec un modèle suffisant, demander une alternative pour la formule idiomatique, contrôler le résultat, puis augmenter la capacité seulement si ce point reste défaillant.", "Correct. La stratégie cible le risque connu et n’augmente le coût qu’en réponse à un défaut observé."],
          ["Découper l’invitation phrase par phrase afin de simplifier la tâche pour un modèle moins coûteux.", "Incorrect. Le découpage réduit la complexité locale mais peut faire perdre le ton et la cohérence d’ensemble."]
        ]
      ),
      question(
        "scenario",
        "RH · Choix du workflow",
        "Une FAQ d’onboarding répond correctement à 14 questions sur 20. Les six échecs concernent tous des règles décrites dans une annexe autorisée mais absente des sources fournies. Quelle amélioration tester d’abord ?",
        "Présentation septembre 2026, slides 5, 8, 10 et 12 : diagnostiquer le défaut, améliorer brief et sources, puis ajuster le modèle si nécessaire.",
        1,
        [
          ["Passer au modèle le plus puissant en conservant exactement les mêmes sources.", "Incorrect. Le problème observé vient d’une information absente, pas d’une capacité de raisonnement insuffisante."],
          ["Ajouter l’annexe autorisée, préciser que chaque réponse doit citer sa procédure et rejouer les 20 questions de test avant tout changement de modèle.", "Correct. La correction vise la cause identifiée et permet de vérifier qu’elle n’introduit pas de régression."],
          ["Donner accès à l’ensemble du dossier RH afin de couvrir d’éventuelles autres lacunes.", "Incorrect. L’accès serait disproportionné alors que la source manquante est précisément identifiée."],
          ["Corriger manuellement les six réponses et publier la FAQ, puisque les autres réponses sont déjà satisfaisantes.", "Incorrect. Cette action corrige les exemples, mais pas le mécanisme qui produira les prochaines réponses."],
          ["Transformer la FAQ en assistant avec une consigne d’escalade lorsqu’une réponse semble incomplète.", "Incorrect. L’escalade est utile, mais l’industrialisation doit attendre la correction et la validation de la méthode."]
        ]
      ),
      question(
        "scenario",
        "Excel · Revue de l’évidence",
        "Work extrait 240 factures autorisées dans un Excel de pré-validation mensuelle. Le fichier servira à préparer, mais pas à déclencher, les paiements. Quel plan de contrôle offre le meilleur équilibre entre fiabilité et efficacité ?",
        "Présentation septembre 2026, slide 12 : vérifier l’évidence, la couverture, les calculs et les incohérences avant usage.",
        4,
        [
          ["Rapprocher le total global avec la comptabilité et vérifier une facture choisie au hasard par fournisseur.", "Incorrect. Ce contrôle peut manquer des erreurs concentrées sur certains formats, montants ou champs manquants."],
          ["Contrôler toutes les factures au-dessus d’un seuil élevé et accepter automatiquement les autres.", "Incorrect. Le montant est un facteur de risque, mais les petits montants peuvent aussi présenter des erreurs systématiques."],
          ["Relancer la même extraction et considérer comme fiables les lignes identiques dans les deux résultats.", "Incorrect. Deux exécutions peuvent reproduire la même erreur et ne valident pas les formules du classeur."],
          ["Effectuer une double saisie manuelle complète des 240 factures dans un second fichier, puis comparer les deux versions.", "Incorrect. La méthode serait robuste mais disproportionnée pour une pré-validation et supprimerait l’essentiel du gain attendu."],
          ["Rapprocher les totaux, contrôler les formules, vérifier toutes les exceptions et lignes à risque, échantillonner le reste et étendre le contrôle si des erreurs apparaissent.", "Correct. Le plan combine contrôles exhaustifs ciblés, échantillonnage et règle d’escalade proportionnée au risque."]
        ]
      ),
      question(
        "scenario",
        "Communication · Validation finale",
        "Une IA prépare une note interne sur une nouvelle procédure de support. La procédure comporte une règle générale et une exception pour un ancien outil encore utilisé par deux bureaux. Quelle validation appliquer avant diffusion ?",
        "Présentation septembre 2026, slides 3, 12 et 16 : arrêter l’automatisation au point de décision et appliquer un contrôle humain final.",
        0,
        [
          ["Comparer la note à la source, tester explicitement le cas des deux bureaux, corriger les écarts et faire approuver la version destinée à chaque public.", "Correct. La revue couvre la règle générale, l’exception et l’adéquation des destinataires avant diffusion."],
          ["Vérifier uniquement le passage modifié, puisque le reste de la note reprend une procédure déjà connue.", "Incorrect. Une modification peut créer une incohérence avec les autres parties ou l’exception existante."],
          ["Accepter la note si elle cite la procédure et mentionne qu’une exception existe.", "Incorrect. Il faut vérifier que l’exception est correctement expliquée aux bureaux concernés, pas seulement signalée."],
          ["Faire approuver la note par un expert support sans lui fournir la procédure source, afin d’obtenir une revue indépendante.", "Incorrect. L’expertise aide, mais une validation fiable nécessite l’accès au texte de référence."],
          ["Diffuser d’abord aux bureaux non concernés par l’exception, puis adapter le message en fonction de leurs retours.", "Incorrect. Les retours d’un public non concerné ne valident pas le traitement du cas exceptionnel."]
        ]
      ),
      question(
        "qcm",
        "Agenda · Chat Projects",
        "Pendant quatre mois, vous organisez chaque semaine le même comité : mêmes modèles, documents de référence et suivi de décisions. Les invitations restent gérées dans l’agenda officiel. Quel usage apporte le plus de continuité sans automatisation excessive ?",
        "Présentation septembre 2026, slide 13 : regrouper conversations, fichiers et instructions pour un travail récurrent et contextualisé.",
        2,
        [
          ["Ouvrir un nouveau Chat chaque semaine et copier le dernier compte rendu pour éviter que le contexte ancien influence la réunion suivante.", "Incorrect. Cette méthode limite les biais de contexte mais multiplie les recopies et augmente le risque d’oublier des décisions antérieures."],
          ["Utiliser Work pour créer et envoyer automatiquement les invitations, comptes rendus et relances à partir des fichiers du comité.", "Incorrect. L’exécution automatique dépasse le besoin exprimé et introduit des actions externes inutiles."],
          ["Créer un Chat Project avec les instructions, modèles et documents autorisés du comité, tout en conservant l’agenda officiel et la validation des communications.", "Correct. Le Project apporte la continuité recherchée sans se substituer aux systèmes ni aux décisions de diffusion."],
          ["Créer un assistant no-code dès la deuxième réunion afin qu’il réponde à toutes les questions relatives au comité.", "Incorrect. Un assistant permanent serait prématuré avant de stabiliser les besoins et les cas d’usage récurrents."],
          ["Créer une skill Codex pour générer chaque semaine les invitations et modifier automatiquement les fichiers de suivi.", "Incorrect. La tâche principale est la continuité du contexte, pas une séquence technique déterministe à exécuter sur des fichiers."]
        ]
      ),
      question(
        "scenario",
        "Support · Assistant no-code",
        "L’équipe ADMIN reçoit chaque semaine 40 questions sur une procédure stable. L’analyse montre que 85 % suivent six réponses types et que 15 % nécessitent un expert. Quand un assistant no-code devient-il pertinent ?",
        "Présentation septembre 2026, slide 14 : transformer une méthode répétable et validée en assistant réutilisable avec garde-fous.",
        4,
        [
          ["Dès que les six réponses types sont rédigées, en demandant aux utilisateurs de signaler les erreurs après le lancement.", "Incorrect. Les réponses types sont une base utile, mais un test avant diffusion reste nécessaire."],
          ["Après avoir ajouté l’ensemble des archives du support afin que l’assistant puisse traiter aussi les 15 % de cas atypiques.", "Incorrect. Élargir les sources ne garantit pas la qualité des cas atypiques et augmente inutilement les accès."],
          ["Lorsque l’assistant peut proposer une réponse à chaque question, quitte à faire relire un échantillon hebdomadaire.", "Incorrect. Les cas hors périmètre doivent être reconnus et escaladés, pas couverts par une réponse forcée."],
          ["Dès maintenant pour un petit groupe, car un pilote en conditions réelles remplacera un jeu de tests théorique.", "Incorrect. Un pilote est utile après des tests préalables ; il ne doit pas exposer les utilisateurs aux erreurs évitables."],
          ["Après validation des six réponses, définition d’un refus avec escalade pour les autres cas, tests représentatifs et désignation d’un responsable de mise à jour.", "Correct. L’assistant automatise le périmètre stable tout en conservant une voie sûre pour les 15 % de cas complexes."]
        ]
      ),
      question(
        "scenario",
        "Excel · Skill Codex",
        "Chaque mois, 120 fichiers non sensibles doivent être contrôlés, renommés selon une règle stable et recensés dans un Excel. Les doublons doivent être signalés mais jamais supprimés automatiquement. Quel usage de Codex est pertinent ?",
        "Présentation septembre 2026, slide 15 : créer une skill pour une séquence technique répétable, bornée et testable.",
        0,
        [
          ["Créer une skill limitée au dossier autorisé, avec mode simulation, manifeste des renommages, signalement des doublons et validation avant application.", "Correct. La séquence est déterministe, répétable et contrôlable sans déléguer la suppression."],
          ["Demander chaque mois à Codex d’écrire puis d’exécuter un nouveau script à partir d’une consigne libre.", "Incorrect. Cette approche peut fonctionner, mais elle réintroduit chaque mois une variation inutile dans une méthode stable."],
          ["Créer un assistant no-code qui parcourt le dossier et propose les nouveaux noms dans la conversation.", "Incorrect. Le besoin porte sur une opération technique répétable sur fichiers, mieux adaptée à une skill bornée et testable."],
          ["Créer une skill qui renomme les fichiers et supprime automatiquement les doublons exacts après comparaison de leur taille.", "Incorrect. La taille ne suffit pas à prouver l’identité et la suppression automatique contredit la règle du scénario."],
          ["Conserver une checklist manuelle et utiliser Chat uniquement pour générer la formule du tableau de contrôle.", "Incorrect. La solution est prudente mais laisse inutilisé le potentiel d’automatisation d’une séquence stable et vérifiable."]
        ]
      ),
      question(
        "scenario",
        "Finance · Escalade",
        "On vous demande en urgence de résumer un document financier interne contenant des prévisions non publiques. Personne n’a confirmé que ce document pouvait être traité par une IA. Quelle réaction est correcte ?",
        "Présentation septembre 2026, slides 2 et 16 : lorsqu’une information non publique n’est pas explicitement autorisée, s’arrêter et demander une source permise avant toute transmission.",
        2,
        [
          ["Extraire uniquement les titres de sections pour que Chat propose la structure du résumé, puis compléter avec les chiffres hors de l’outil.", "Incorrect. Les titres peuvent eux-mêmes révéler le contenu du document et aucune autorisation n’a été confirmée."],
          ["Utiliser Work en lecture seule et demander que les prévisions ne soient pas reprises dans la réponse finale.", "Incorrect. L’exclusion dans la sortie n’empêche pas la transmission initiale des prévisions à l’outil."],
          ["Bloquer l’usage du document, prévenir le demandeur et proposer en attendant un gabarit générique construit sans son contenu, jusqu’à réception d’une version autorisée.", "Correct. La réponse protège les informations tout en permettant d’avancer sur la structure sans exposer le document."],
          ["Demander à un collègue de paraphraser les prévisions, puis utiliser cette reformulation comme entrée.", "Incorrect. Une paraphrase conserve la substance non publique et ne crée pas d’autorisation."],
          ["Rédiger manuellement un premier résumé, puis utiliser l’IA uniquement pour en améliorer le style.", "Incorrect. Le résumé manuel contient encore les informations issues du document non autorisé."]
        ]
      ),
      question(
        "scenario",
        "Communication · Idée d’agent",
        "Vous proposez un agent pour préparer chaque lundi une communication interne à partir de consignes validées. Les faits doivent être traçables et aucun message ne doit partir sans approbation. Quelle spécification est la plus solide ?",
        "Présentation septembre 2026, slides 8, 14 et 16 : décrire le processus, les entrées autorisées, la sortie, les contrôles et les cas d’escalade.",
        1,
        [
          ["Un agent qui lit les e-mails du dossier ADMIN, produit et envoie le message, avec un contrôle humain aléatoire une fois par mois.", "Incorrect. L’accès est trop large et l’échantillonnage a posteriori ne respecte pas l’approbation exigée pour chaque envoi."],
          ["Un agent qui transforme des consignes internes autorisées en brouillons, cite ses sources, signale les informations manquantes et attend une validation avant envoi.", "Correct. Le cas d’usage précise la donnée, la sortie, la traçabilité et la décision humaine."],
          ["Un agent qui utilise uniquement les consignes validées et cite ses sources, mais complète les informations manquantes à partir des communications précédentes.", "Incorrect. La traçabilité est prévue, mais la réutilisation de faits antérieurs peut introduire des informations périmées ou non autorisées."],
          ["Un agent qui centralise les consignes de communication, les informations RH et les données fournisseurs, puis soumet chaque brouillon à validation.", "Incorrect. La validation finale est correcte, mais le périmètre de données est beaucoup plus large que le besoin."],
          ["Un agent qui produit un brouillon sourcé et laisse l’utilisateur choisir les destinataires, mais publie automatiquement dès que le texte n’est pas modifié pendant 24 heures.", "Incorrect. L’absence de modification n’équivaut pas à une approbation explicite."]
        ]
      ),
      question(
        "scenario",
        "Agenda · Cas intégré ADMIN",
        "Vous organisez un séminaire interne : agenda évolutif, invitation bilingue, suivi Excel des inscriptions et FAQ logistique. Les sources sont autorisées, mais chaque communication externe doit être approuvée. Quel plan de travail est le plus solide ?",
        "Présentation septembre 2026, synthèse des slides 2, 5, 7, 8, 12 et 16.",
        3,
        [
          ["Utiliser Work pour produire tous les livrables en une seule exécution, puis effectuer une revue globale juste avant les envois.", "Incorrect. Une revue uniquement finale risque de laisser se propager une erreur d’agenda dans la traduction, le suivi et la FAQ."],
          ["Traiter chaque livrable dans un Chat séparé avec un extrait adapté, puis consolider manuellement les versions approuvées.", "Incorrect. La minimisation est bonne, mais la fragmentation rend difficile la cohérence entre l’agenda, l’invitation, l’Excel et la FAQ."],
          ["Créer un assistant dédié au séminaire après un premier brouillon satisfaisant et lui confier les mises à jour jusqu’au jour J.", "Incorrect. Un premier résultat ne suffit pas à stabiliser les règles, les exceptions et les validations d’un processus évolutif."],
          ["Vérifier que chaque source est autorisée et sans donnée exclue, définir brief et permissions, choisir Chat ou Work, contrôler les livrables, puis faire valider les envois.", "Correct. L’enchaînement couvre autorisation, choix d’outil, qualité, preuve et responsabilité humaine."],
          ["Utiliser Work avec des accès en lecture aux dossiers du séminaire, automatiser les mises à jour et demander une validation uniquement pour les e-mails externes.", "Incorrect. Les permissions sont raisonnables, mais les mises à jour de l’agenda et du suivi doivent aussi être contrôlées car elles alimentent les communications."]
        ]
      )
    ],
    evaluation: {
      title: "Votre retour ADMIN",
      intro: "La note et les commentaires sont facultatifs. Ils nous aident à améliorer la formation et à identifier des usages ADMIN utiles. N’indiquez aucune information client, financière, RH, personnelle ou sensible.",
      scaleLabel: "Note globale : 1 = insuffisant, 5 = excellent.",
      criteria: [
        { id: "overall_satisfaction", label: "Satisfaction globale sur la formation et le questionnaire ADMIN" }
      ]
    }
  };

  window.quizQuestions = source.questions;
  window.quizConfig = {
    quizId: "advancy-ai-admin-fr",
    quizName: "Évaluation IA générative — ADMIN",
    quizVersion: "2026-09-25-admin-fr",
    storageNamespace: "admin-fr",
    privacyNoticeVersion: "2026-07-09",
    apiBase: "https://advancy-ai-score-api.advancy-ai-training.workers.dev",
    passThreshold: 0.7,
    correctionTitle: "Correction et explications",
    trainingEvaluation: source.evaluation,
    ui: {
      sectionContext: "ADMIN · Communication · Excel · Support",
      assessmentFallbackName: "Évaluation IA — ADMIN",
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
      startAnotherAttempt: "Commencer une nouvelle tentative",
      chooseAnswer: "Choisissez une réponse.",
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
