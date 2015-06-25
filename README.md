# Documentation Technique Application Adonif #

### Configurer Cordova sur son ordinateur

Pour utiliser cordova, il faut installer les outils en ligne de commande. Ces outils permettent d'installer des plugins,
compiler l'application et l'envoyer sur le mobile...

[Tutoriel sur la documentation officielle](http://docs.phonegap.com/en/edge/guide_cli_index.md.html#The%20Command-Line%20Interface)

[Configuration pour compiler vers Android](http://docs.phonegap.com/en/edge/guide_platforms_android_index.md.html#Android%20Platform%20Guide)

[Configuration pour compiler vers iOS (sur mac seulement)](http://docs.phonegap.com/en/edge/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide)

Commandes pratiques (à exécuter depuis la racine du projet) :

- Pour voir les plugins installés : cordova plugins ls
- Plateformes disponibles et installées : cordova platform ls
- Lancer sur une plateforme : cordova run [platform]
- ex: cordova run android

Parfois, la compilation retourne une erreur de timeout. Vérifiez que votre appareil est bien branché, et relancez la commande de compilation, ça arrive parfois sans raison apparente.

### Fonctionnement du projet
Le projet est une SPA (Single Page App). Ainsi, on a un seul fichier HTML contenant plusieurs DIVS, chacune correspondant à une page. Au premier lancement de l'application, on requiert une connexion par l'utilisateur car l'inscription sur adonif est 
obligatoire pour utiliser l'application. Au mÃªme moment, on charge les informations du référentiel pour l'autocomplétion.
Ces informations sont stockées dans une base de données sqlite. Ensuite, l'utilisateur peut créer ses récoltes, qui seront
stockées dans la base au format JSON (étant donné que l'on n'a pas besoin de faire des recherches dessus, évite les tables avec plein de colonnes.).

L'utilisateur peut ensuite lister ses récoltes et les uploader. Les photos sont copiées dans la galerie de l'utilisateur via un plugin pour qu'il puisse les récupérer facilement. 

### Arborescence du projet

Adonif

	|- hooks : permet de customiser les commandes de cordova, inutile dans ce projet à ce jour

	|- img : contient les images des splashscreen et des icones, elles sont ajoutées dans les projets des plateformes à la compilation. L'emplacement des images est configuré dans le fichier config.xml

	|- php : dossier contenant tous les fichiers php ayant un rapport avec ce projet -> script appelés par l'application ou par le formulaire de gestion des récoltes mobiles sur le site de l'inventaire.

	|- platforms : dossier contenant les applications compilées pour chaque plateforme disponible.

	|- plugins : dossier où sont stockés les sources des plugins de l'application

	|- www : dossier contenant les sources du projet. Toutes les sources doivent être placées dans ce dossier.
		
		|- css : contient les feuilles css concernant le projet
		
		|- fonts : contient les polices associées au projet. Utile pour avoir les glyphicons de bootstrap
		
		|- img: contient les images du projet (logo d'adonif notamment).
		
		|- js: contient le javascript associé au projet.
			
			|- libs: dossier contenant les librairies javascript
				
				|- awesomplete.js : librairies permettant l'autocomplétion des champs (genre, épithète...). Des modifications spécifiques à l'application ont été apportées, veillez donc à les répercuter en cas de souhait de mise à jour.
				
				|- bootstrap.min.js : javascript associé à bootstrap
				
				|- fastclick.js : Sur les sites webs sur mobile, lorsque l'on fait un clic, l'application attends 300ms pour voir si l'on va faire un clic ou un double clic. Cette librairie permet d'annuler ce temps de 300ms pour que l'application soit plus réactive.
				
				|- jquery-2.1.3.min.js : librairie JQuery permettant de nombreuses opérations sur le DOM.
			
			|- all.js: fichier contenant les fonctions servant un peu partout.
			
			|- database.js: fichier contenant la création de la base de données, son remplissage par des requÃªtes sur le serveur du référentiel et les requÃªtes sur la base.
			
			|- form.js : contient tout le javascript correspondant au formulaire (remplissage des champs, sauvegarde...).
			
			|- form_queries.js : contient les requÃªtes effectuées pour l'autocomplétion des champs du formulaire.
			
			|- navigation.js: contient les fonctions permettant de naviguer entre les pages
			
			|- plugins.js: contient les fonctions associées aux plugins. Principalement le plugin de photo et de géolocalisation.
			
			|- recolts_list.js: js correspondant à la page de listage des récoltes
			
			|- upload.js: fichier correspondant à la gestion de l'upload des récoltes
			
			|- utils.js: fonctions formant une surcouche sur diverses fonctions utilitaires pour faciliter l'écriture.

		|- index.html: Unique fichier HTML du projet. Le fichier contient plusieurs divs correspondant à chaque page, et lors d'un changement de page on cache les divs et on affiche celle de la page que l'on souhaite.

	|- config.xml : configuration du projet.

### Liens

Documentation de phonegap/cordova : http://docs.phonegap.com/en/edge/guide_overview_index.md.html#Overview

Librairies :
-[Bootstrap](http://getbootstrap.com/)
-[Awesomplete](https://leaverou.github.io/awesomplete/)
-[FastClick](https://github.com/ftlabs/fastclick)
-[JQuery](https://jquery.com/)

### Astuces

Etant donné que l'on n'a pas de console, on ne peut pas voir les erreurs qui surviennent. Si l'application ne réagit pas comme prévu, c'est sans doute qu'ne exception s'est produite. Il faut donc mettre des try catch autour du code suspect, comme ceci:

try {
	maFonctionQuiPlante();
} catch (err) {
	alert(err.message);
}

On pourra obtenir les messages d'erreur dans une alerte.

### Contact

Si problème, vous pouvez me contacter sur mon mail :
	jonathan.lecointe@gmail.com