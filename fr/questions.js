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
        "Vous préparez une communication interne à partir de notes classées Orange. Les noms et situations individuelles sont hors périmètre. Quelle méthode respecte la Charte IA ?",
        "Présentation septembre 2026, slide 2 : couleur de la mission, outil approuvé, minimum d’information, revue humaine et escalade.",
        2,
        [
          ["Déposer toutes les notes dans l’outil approuvé, puis demander au modèle d’anonymiser le résultat.", "Incorrect. Un outil approuvé ne rend pas autorisées des informations exclues du périmètre, même si la sortie est ensuite anonymisée."],
          ["Utiliser un compte personnel pour séparer le brouillon des systèmes Advancy.", "Incorrect. Les comptes personnels et outils non approuvés font partie des interdits absolus."],
          ["Retirer les éléments individuels, ne transmettre que l’extrait nécessaire et faire relire la communication avant diffusion.", "Correct. La méthode respecte le périmètre Orange, la minimisation des données et la responsabilité humaine."],
          ["Envoyer les notes complètes si elles représentent moins de dix pages.", "Incorrect. Dix pages constituent un plafond pour un extrait nécessaire, pas une autorisation générale."],
          ["Demander au modèle de décider seul quelles informations sont sensibles.", "Incorrect. La classification et l’autorisation relèvent de l’équipe et du responsable, pas du modèle."]
        ]
      ),
      question(
        "scenario",
        "Finance · Données interdites",
        "Pour préparer un suivi de paiements, on vous transmet un fichier contenant des coordonnées bancaires de fournisseurs et des commentaires confidentiels. Que faites-vous avant toute utilisation d’IA ?",
        "Présentation septembre 2026, slide 2 : interdits absolus, données sensibles et obligation d’escalade en cas de doute.",
        4,
        [
          ["Importer le fichier dans Work, puisque la finalité est interne.", "Incorrect. Une finalité interne ne lève pas les restrictions liées aux données sensibles ou confidentielles."],
          ["Masquer seulement le nom du fichier avant de le déposer.", "Incorrect. Renommer un fichier ne modifie pas son contenu ni son niveau de sensibilité."],
          ["Copier les colonnes dans le prompt plutôt que de joindre le fichier.", "Incorrect. Copier le contenu revient toujours à le transmettre à l’outil."],
          ["Utiliser le modèle le plus puissant afin de réduire le risque d’erreur.", "Incorrect. Le choix du modèle ne remplace ni l’autorisation ni la protection des données."],
          ["Ne rien transmettre, demander un extrait autorisé et assaini, ou escalader vers le responsable si le besoin reste ambigu.", "Correct. Les données sensibles restent hors périmètre tant qu’une version autorisée et minimale n’a pas été définie."]
        ]
      ),
      question(
        "scenario",
        "Traduction · Minimisation",
        "Vous devez traduire deux paragraphes non sensibles d’une procédure interne de douze pages. Quel apport à l’IA est proportionné ?",
        "Présentation septembre 2026, slide 2 : n’utiliser que le minimum nécessaire et traiter la limite de dix pages comme un plafond, non comme une permission.",
        1,
        [
          ["Déposer les douze pages afin de préserver tout le contexte.", "Incorrect. Le document complet dépasse le besoin de traduction défini."],
          ["Transmettre uniquement les deux paragraphes nécessaires, après vérification de leur caractère autorisé.", "Correct. L’entrée est limitée au contenu utile et reste dans le périmètre permis."],
          ["Transmettre dix pages, puisque le support mentionne ce maximum.", "Incorrect. Le maximum n’est ni une cible ni une autorisation automatique."],
          ["Envoyer le document vers une messagerie personnelle avant de le traduire.", "Incorrect. Un compte personnel est interdit et ne réduit pas la sensibilité du contenu."],
          ["Faire traduire l’intégralité du document, puis supprimer les pages inutiles de la réponse.", "Incorrect. La minimisation doit intervenir avant la transmission à l’outil."]
        ]
      ),
      question(
        "scenario",
        "Mail · Revue humaine",
        "Chat rédige un e-mail annonçant un changement de procédure aux équipes. Le texte paraît fluide. Quelle est la prochaine étape ?",
        "Présentation septembre 2026, slides 2 et 3 : l’IA accélère le brouillon, mais l’ADMIN reste responsable du message final.",
        3,
        [
          ["Envoyer immédiatement : un texte fluide est suffisamment fiable.", "Incorrect. La fluidité ne garantit ni l’exactitude, ni le bon ton, ni la conformité à la procédure."],
          ["Ajouter une mention indiquant que l’e-mail a été produit par une IA, puis l’envoyer sans autre contrôle.", "Incorrect. Une mention ne remplace pas la vérification du fond et l’approbation humaine."],
          ["Demander au modèle de confirmer lui-même que toutes les informations sont exactes.", "Incorrect. Le modèle ne peut pas être sa propre source de validation."],
          ["Vérifier dates, destinataires, règles citées et ton, puis obtenir l’approbation requise avant envoi.", "Correct. Le brouillon IA devient utilisable seulement après revue et décision humaines."],
          ["Conserver l’e-mail comme modèle permanent sans tester d’autres situations.", "Incorrect. La réutilisation exige une méthode stable et des contrôles adaptés à chaque envoi."]
        ]
      ),
      question(
        "qcm",
        "Support · Outil approuvé",
        "Quelle règle s’applique à toute tâche ADMIN réalisée avec une IA, même lorsque le contenu semble banal ?",
        "Présentation septembre 2026, slide 2 : utiliser exclusivement un outil approuvé avec l’accès professionnel autorisé.",
        0,
        [
          ["Utiliser un outil approuvé par Advancy avec son accès professionnel, dans le périmètre autorisé.", "Correct. L’outil, le compte et le contenu doivent tous être autorisés."],
          ["Utiliser n’importe quel outil gratuit si aucun nom de client n’apparaît.", "Incorrect. L’absence de nom de client ne rend pas un outil non approuvé acceptable."],
          ["Utiliser un compte personnel si la réponse reste sur l’ordinateur.", "Incorrect. Le contenu est transmis au service avant que la réponse n’apparaisse sur l’ordinateur."],
          ["Installer une extension de navigateur si elle permet de gagner du temps.", "Incorrect. Les extensions non approuvées font partie des interdits absolus."],
          ["Partager une connexion entre collègues pour centraliser les usages.", "Incorrect. Les connexions et comptes partagés ne sont pas autorisés."]
        ]
      ),
      question(
        "scenario",
        "Mail · Choix de Chat",
        "Vous devez reformuler un rappel interne non sensible sur la réservation des salles et comparer trois tons possibles. Quel workflow est le plus adapté ?",
        "Présentation septembre 2026, slides 4 à 7 : Chat convient aux demandes ponctuelles, ciblées et conversationnelles.",
        1,
        [
          ["Créer immédiatement un assistant permanent avec accès à tous les dossiers ADMIN.", "Incorrect. La tâche est ponctuelle et ne justifie ni assistant réutilisable ni accès étendu."],
          ["Utiliser Chat avec le message nécessaire, demander trois variantes, puis choisir et relire la version finale.", "Correct. Chat est adapté à une itération courte sans chaîne d’outils ni livrable complexe."],
          ["Utiliser Codex pour modifier les paramètres de messagerie des destinataires.", "Incorrect. Aucune action technique sur les comptes n’est nécessaire."],
          ["Utiliser Work pour rechercher automatiquement toutes les politiques de réservation de l’entreprise.", "Incorrect. Le besoin est déjà cadré et ne demande pas de recherche ou d’exécution multiétape."],
          ["Envoyer le premier brouillon généré pour économiser des crédits.", "Incorrect. L’économie de crédits ne justifie pas l’absence de revue humaine."]
        ]
      ),
      question(
        "scenario",
        "Excel · Choix de Work",
        "Vous devez consolider plusieurs fichiers autorisés de suivi logistique, nettoyer les colonnes et produire un classeur Excel final avec contrôles. Quel environnement choisir ?",
        "Présentation septembre 2026, slides 5 à 7 : Work est adapté aux fichiers, aux outils et aux livrables multiétapes.",
        3,
        [
          ["Chat, en copiant successivement chaque ligne des fichiers dans la conversation.", "Incorrect. Cette méthode fragmente le contexte et augmente les risques d’oubli ou de copie."],
          ["Un traducteur automatique, puisque les colonnes comportent du texte.", "Incorrect. Le besoin principal est une consolidation structurée et contrôlée, pas une traduction."],
          ["Un assistant permanent créé avant d’avoir défini les contrôles du classeur.", "Incorrect. Il faut d’abord stabiliser la méthode et les critères de qualité."],
          ["Work, avec les seuls fichiers nécessaires, un brief précis, les permissions minimales et une revue du classeur produit.", "Correct. Work correspond à une exécution multiétape sur fichiers avec livrable fini et contrôles explicites."],
          ["Le modèle le plus coûteux, sans préciser le format attendu.", "Incorrect. Le choix d’un modèle ne remplace pas le brief, les permissions ou les contrôles Excel."]
        ]
      ),
      question(
        "scenario",
        "Support · Permissions",
        "Dans Work, un agent de support propose d’ouvrir tout le disque partagé et d’envoyer directement une réponse à un prestataire. Quelle décision prendre ?",
        "Présentation septembre 2026, slide 7 : distinguer accès et actions, appliquer le moindre privilège et confirmer avant toute action externe.",
        0,
        [
          ["Limiter l’accès au dossier strictement nécessaire et conserver l’envoi externe sous validation humaine.", "Correct. Les permissions doivent être minimales et l’action vers un tiers doit rester explicitement contrôlée."],
          ["Autoriser tout le disque pour éviter que l’agent manque de contexte.", "Incorrect. Un accès large augmente inutilement l’exposition de données."],
          ["Autoriser l’envoi automatique si le prestataire est déjà connu.", "Incorrect. Une relation existante ne dispense pas du contrôle du contenu et du destinataire."],
          ["Donner un accès complet pendant une heure, puis le révoquer.", "Incorrect. Une durée courte ne justifie pas un périmètre d’accès excessif."],
          ["Laisser l’agent choisir les autorisations dont il pense avoir besoin.", "Incorrect. Les autorisations sont définies par l’utilisateur responsable avant l’exécution."]
        ]
      ),
      question(
        "scenario",
        "Finance · Qualité du brief",
        "Vous demandez à Work de comparer des offres fournisseurs autorisées dans un tableau. Quel brief donne la meilleure base de travail ?",
        "Présentation septembre 2026, slide 8 : préciser objectif, contexte, sources, exclusions, format de sortie et contrôles.",
        4,
        [
          ["Compare ces offres et dis-moi laquelle est la meilleure.", "Incorrect. Les critères, le format et les contrôles restent indéfinis."],
          ["Fais un tableau très complet en utilisant toutes les informations disponibles.", "Incorrect. Le périmètre est trop large et la notion de complétude n’est pas contrôlable."],
          ["Utilise ton jugement pour combler les prix ou conditions manquants.", "Incorrect. Le modèle ne doit pas inventer des données financières absentes."],
          ["Choisis automatiquement le fournisseur et prépare le bon de commande final.", "Incorrect. La recommandation et l’engagement financier exigent une validation humaine."],
          ["Compare uniquement les fichiers autorisés, selon les critères fournis, signale les données manquantes et livre un Excel avec sources et contrôles.", "Correct. Le brief rend le périmètre, les critères, la sortie et la vérification explicites."]
        ]
      ),
      question(
        "qcm",
        "RH · Crédits",
        "Selon le support de septembre 2026, quelle conduite adopter avant de lancer une tâche RH non sensible et autorisée, susceptible de consommer beaucoup de crédits ?",
        "Présentation septembre 2026, slide 9 : enveloppe mensuelle de 1 500 crédits et approbation requise pour une augmentation.",
        2,
        [
          ["Lancer la tâche plusieurs fois et conserver la meilleure réponse.", "Incorrect. Les répétitions non cadrées consomment des crédits sans améliorer la méthode."],
          ["Utiliser systématiquement le modèle le plus avancé pour éviter de recommencer.", "Incorrect. Le modèle le plus avancé n’est pas toujours nécessaire ni le plus efficient."],
          ["Estimer le besoin, commencer avec la capacité suffisante et demander l’approbation avant toute augmentation de crédits.", "Correct. La consommation doit être proportionnée et toute hausse suit le processus d’approbation."],
          ["Fractionner la tâche entre plusieurs comptes pour contourner la limite.", "Incorrect. Le contournement des limites et le partage de comptes ne sont pas autorisés."],
          ["Attendre la fin du mois sans vérifier la consommation prévue.", "Incorrect. Le bon réflexe est de cadrer le besoin avant l’exécution."]
        ]
      ),
      question(
        "scenario",
        "Traduction · Modèle et effort",
        "Vous devez traduire un court message logistique non sensible, puis vérifier la terminologie. Quel réglage est le plus rationnel ?",
        "Présentation septembre 2026, slides 10 et 11 : choisir le niveau de capacité et d’effort nécessaire, puis augmenter seulement face à un problème identifié.",
        3,
        [
          ["Utiliser toujours le modèle frontière avec l’effort maximal.", "Incorrect. Une tâche simple ne justifie pas automatiquement la capacité et le coût les plus élevés."],
          ["Choisir au hasard afin d’éviter un biais de sélection.", "Incorrect. Le choix doit dépendre de la complexité, de la qualité requise et du coût."],
          ["Utiliser le modèle le plus rapide et envoyer la traduction sans contrôle.", "Incorrect. L’efficacité ne supprime pas la vérification de la terminologie et du sens."],
          ["Commencer avec un modèle suffisant et un effort adapté, contrôler la traduction, puis augmenter seulement si un défaut précis apparaît.", "Correct. Cette approche suit le compromis coût-intelligence présenté dans le support."],
          ["Traduire le document complet pour donner davantage de contexte, même si un seul message est requis.", "Incorrect. Le choix du modèle ne dispense pas du principe de minimisation."]
        ]
      ),
      question(
        "scenario",
        "RH · Choix du workflow",
        "Vous préparez une FAQ d’onboarding à partir de procédures internes autorisées. Une première version existe, mais les réponses sont parfois incomplètes. Quelle amélioration tester d’abord ?",
        "Présentation septembre 2026, slides 5, 8, 10 et 12 : diagnostiquer le défaut, améliorer brief et sources, puis ajuster le modèle si nécessaire.",
        1,
        [
          ["Donner immédiatement accès à tous les dossiers RH.", "Incorrect. L’augmentation des accès ne doit jamais être la réponse par défaut à un problème de qualité."],
          ["Identifier les réponses manquantes, préciser les sources et le format attendu, puis retester avant d’augmenter la capacité du modèle.", "Correct. Le défaut est traité de façon ciblée, en privilégiant d’abord le cadrage et l’évidence."],
          ["Supprimer les références aux procédures pour rendre les réponses plus fluides.", "Incorrect. La fluidité ne doit pas affaiblir la traçabilité ou l’exactitude."],
          ["Publier la FAQ et corriger seulement si un salarié signale une erreur.", "Incorrect. Une revue humaine doit précéder la diffusion."],
          ["Transformer immédiatement la FAQ en assistant permanent.", "Incorrect. La méthode doit être stabilisée et validée avant d’être réutilisée à grande échelle."]
        ]
      ),
      question(
        "scenario",
        "Excel · Revue de l’évidence",
        "Work extrait des montants depuis des factures autorisées et construit un suivi Excel. Comment valider le livrable ?",
        "Présentation septembre 2026, slide 12 : vérifier l’évidence, la couverture, les calculs et les incohérences avant usage.",
        4,
        [
          ["Contrôler uniquement que le total final paraît plausible.", "Incorrect. Un total plausible peut masquer des lignes oubliées ou mal lues."],
          ["Vérifier seulement les trois plus gros montants.", "Incorrect. Un échantillon limité ne suffit pas si le fichier doit servir de suivi officiel."],
          ["Demander au modèle s’il est certain de ses extractions.", "Incorrect. Une déclaration de confiance du modèle n’est pas une preuve."],
          ["Comparer le total avec le mois précédent et accepter s’il est proche.", "Incorrect. Une proximité historique ne valide pas les pièces, les formules ou l’exhaustivité."],
          ["Rapprocher les lignes des sources, contrôler les formules, repérer les champs manquants et faire valider le fichier avant usage.", "Correct. La validation couvre les preuves, les calculs, l’exhaustivité et la responsabilité humaine."]
        ]
      ),
      question(
        "scenario",
        "Communication · Validation finale",
        "Une IA prépare une note interne résumant une nouvelle procédure de support. Quelle règle d’arrêt appliquer avant diffusion ?",
        "Présentation septembre 2026, slides 3, 12 et 16 : arrêter l’automatisation au point de décision et appliquer un contrôle humain final.",
        0,
        [
          ["Un ADMIN vérifie la note contre la procédure source, corrige les écarts et approuve explicitement la diffusion.", "Correct. La décision de publier et la responsabilité du contenu restent humaines."],
          ["Diffuser dès que la note ne contient aucune faute d’orthographe.", "Incorrect. L’orthographe ne prouve pas l’exactitude de la procédure."],
          ["Diffuser si le modèle cite au moins une source.", "Incorrect. Une citation isolée ne garantit ni couverture ni fidélité."],
          ["Laisser le modèle décider si son niveau de confiance est suffisant.", "Incorrect. La confiance déclarée par le modèle ne remplace pas un contrôle indépendant."],
          ["Diffuser automatiquement aux petites équipes seulement.", "Incorrect. La taille du public ne supprime pas la responsabilité humaine."]
        ]
      ),
      question(
        "qcm",
        "Agenda · Chat Projects",
        "Quand un Chat Project est-il particulièrement utile pour une activité ADMIN ?",
        "Présentation septembre 2026, slide 13 : regrouper conversations, fichiers et instructions pour un travail récurrent et contextualisé.",
        2,
        [
          ["Pour envoyer automatiquement toutes les invitations d’agenda sans contrôle.", "Incorrect. Un Project organise le contexte ; il n’autorise pas des actions externes automatiques."],
          ["Pour contourner les restrictions d’accès aux fichiers partagés.", "Incorrect. Les règles d’accès restent inchangées dans un Project."],
          ["Pour suivre dans la durée l’organisation d’un cycle de réunions avec les mêmes instructions et documents autorisés.", "Correct. Le Project maintient un contexte de travail récurrent sans redémarrer chaque échange."],
          ["Pour stocker des données RH sensibles qui ne doivent pas être utilisées ailleurs.", "Incorrect. Un Project ne transforme pas une donnée interdite en donnée autorisée."],
          ["Pour remplacer l’agenda officiel de l’entreprise.", "Incorrect. Le Project complète le workflow, mais ne remplace pas le système de référence."]
        ]
      ),
      question(
        "scenario",
        "Support · Assistant no-code",
        "L’équipe ADMIN reçoit chaque semaine les mêmes questions sur une procédure de support stable et autorisée. Quand créer un assistant no-code ?",
        "Présentation septembre 2026, slide 14 : transformer une méthode répétable et validée en assistant réutilisable avec garde-fous.",
        4,
        [
          ["Dès la première question, avant d’identifier les variantes et les erreurs possibles.", "Incorrect. Une méthode non stabilisée ne doit pas être industrialisée."],
          ["Après avoir donné à l’assistant accès à tous les dossiers pour qu’il apprenne seul.", "Incorrect. Les accès doivent rester limités aux sources nécessaires et autorisées."],
          ["Seulement si l’assistant peut répondre sans jamais demander une validation humaine.", "Incorrect. Les cas ambigus et les actions sensibles doivent toujours être escaladés."],
          ["Quand le volume est élevé, même si la procédure change chaque jour.", "Incorrect. Une forte instabilité rend la méthode difficile à fiabiliser et à maintenir."],
          ["Après validation des sources, réponses types, limites, cas d’escalade et tests sur des exemples représentatifs.", "Correct. L’assistant réutilise une méthode déjà comprise, contrôlée et documentée."]
        ]
      ),
      question(
        "scenario",
        "Excel · Skill Codex",
        "Chaque mois, vous devez renommer des fichiers non sensibles, vérifier leur présence et générer le même tableau de contrôle. Quel usage de Codex est pertinent ?",
        "Présentation septembre 2026, slide 15 : créer une skill pour une séquence technique répétable, bornée et testable.",
        0,
        [
          ["Créer une skill bornée aux dossiers autorisés, avec étapes explicites, contrôles et validation avant toute action irréversible.", "Correct. La séquence est stable, technique et testable, ce qui correspond à une skill Codex."],
          ["Donner à Codex un accès général à l’ordinateur afin qu’il retrouve seul les fichiers.", "Incorrect. L’accès doit être limité aux dossiers strictement nécessaires."],
          ["Créer un assistant de conversation qui devine les règles de nommage.", "Incorrect. Les règles doivent être formalisées et testées, pas déduites au hasard."],
          ["Exécuter directement la suppression des fichiers manquants ou en double.", "Incorrect. Une action destructive nécessite une cible certaine et une validation explicite."],
          ["Utiliser Chat et copier manuellement tous les noms de fichiers chaque mois.", "Incorrect. Cette solution ne tire pas parti du caractère répétable et vérifiable de la tâche."]
        ]
      ),
      question(
        "scenario",
        "Finance · Escalade",
        "On vous demande en urgence de résumer un document financier interne dont la sensibilité et l’autorisation IA ne sont pas claires. Quelle réaction est correcte ?",
        "Présentation septembre 2026, slides 2 et 16 : en cas de doute sur le périmètre, s’arrêter et escalader avant toute transmission.",
        2,
        [
          ["Le charger dans Chat en précisant dans le prompt qu’il est confidentiel.", "Incorrect. Mentionner la confidentialité ne crée pas une autorisation d’usage."],
          ["Le déposer dans Work parce que la demande est urgente.", "Incorrect. L’urgence ne remplace pas la classification ou l’autorisation."],
          ["Suspendre l’usage de l’IA, demander la classification et l’autorisation, puis reprendre seulement avec un extrait permis.", "Correct. La règle d’arrêt protège le périmètre lorsque le statut du document est incertain."],
          ["Traduire d’abord le document pour masquer sa nature financière.", "Incorrect. Une traduction ne change ni la sensibilité ni les restrictions du document."],
          ["Retirer le logo Advancy avant de le transmettre à l’outil.", "Incorrect. La suppression du logo ne neutralise pas les informations confidentielles."]
        ]
      ),
      question(
        "scenario",
        "Communication · Idée d’agent",
        "Après la formation, vous souhaitez suggérer un agent pour préparer les communications récurrentes de l’équipe ADMIN. Quelle description est la plus utile et la plus sûre ?",
        "Présentation septembre 2026, slides 8, 14 et 16 : décrire le processus, les entrées autorisées, la sortie, les contrôles et les cas d’escalade.",
        1,
        [
          ["Un agent qui lit tous les e-mails et envoie automatiquement les réponses appropriées.", "Incorrect. Le périmètre, les permissions, les garde-fous et la validation sont absents."],
          ["Un agent qui transforme des consignes internes autorisées en brouillons, cite ses sources, signale les informations manquantes et attend une validation avant envoi.", "Correct. Le cas d’usage précise la donnée, la sortie, la traçabilité et la décision humaine."],
          ["Un agent très intelligent pour faire gagner du temps à tout le monde.", "Incorrect. La formulation ne définit ni tâche, ni entrée, ni livrable, ni contrôle."],
          ["Un agent qui centralise des informations RH, finance et fournisseurs dans une base unique.", "Incorrect. Cette centralisation élargit inutilement l’accès à des données potentiellement sensibles."],
          ["Un agent qui choisit seul le bon destinataire et le bon moment d’envoi.", "Incorrect. Les décisions de diffusion doivent rester explicites et contrôlées."]
        ]
      ),
      question(
        "scenario",
        "Agenda · Cas intégré ADMIN",
        "Vous organisez un séminaire interne : agenda, e-mails, traduction d’une invitation, suivi Excel et réponses de support, à partir de contenus autorisés. Quel enchaînement est le plus solide ?",
        "Présentation septembre 2026, synthèse des slides 2, 5, 7, 8, 12 et 16.",
        3,
        [
          ["Ouvrir tous les dossiers disponibles dans Work, puis décider des livrables à la fin.", "Incorrect. Le périmètre, les sources et les livrables doivent être définis avant l’exécution."],
          ["Utiliser Chat pour tout produire en une seule réponse, puis envoyer les éléments si l’ensemble paraît cohérent.", "Incorrect. Le cas combine fichiers, outils, contrôles et actions qui exigent un workflow structuré."],
          ["Créer immédiatement un assistant permanent qui gère seul agenda, e-mails et support.", "Incorrect. La méthode et les garde-fous doivent d’abord être testés et validés."],
          ["Classifier les contenus, définir brief et permissions, choisir Chat ou Work par tâche, vérifier chaque livrable, puis faire valider les envois.", "Correct. L’enchaînement couvre autorisation, choix d’outil, qualité, preuve et responsabilité humaine."],
          ["Utiliser le modèle le plus avancé pour réduire le besoin de contrôles.", "Incorrect. Un modèle plus puissant ne supprime ni les permissions, ni les vérifications, ni l’approbation finale."]
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
