# Architecture

A la racine du projet se retrouve un dossier src qui contient tout le code qui est exécuté. 
Le reste des fichiers à la racine sont des fichiers de configurations (règles de formatage du code, conf typescript, conf library de test, dépendances du projet).

Le détail des dossiers de src est ci-dessous.

## Dossier application
Cette couche représente le point d'entrée de l'application. Cette couche connait uniquement ce qui est dans la couche core et ne doit pas connaître la couche infrastructure.
Ses seules raisons de changer doivent être :
- un changement de techno d'API (changement de lib/framework) 
- la modification d'un contrat d'interface d'API
- l'ajout de nouveaux points d'entrée (nouveaux endpoints ou ajout de jobs)
- un ajout/suppression de règle métier ayant un impact sur l'affichage


Dans notre cas, l'application est une API REST donc on y retrouve :
- la route : définition des endpoints (URL + méthode HTTP + contrat d'interface) et la méthode de controller à appeler pour chaque endpoint
- le controller : il a la responsabilité de gérer la requête en appelant le use case avec les bons paramètres. S'il y a besoin, il fait une conversion entre les informations de la requête et le format attendu par le use case.
- l'implémentation du presenter (laissé dans le fichier controller dans l'exemple, voir paramètre de sortie du use case) : transforme les différents cas de retours du use case en code et réponse HTTP
Si dans l'application il y a d'autres types de points d'entrée comme des jobs alors j'ajoute des sous répertoire api et job dans le dossier application. 

### Pourquoi la couche application ne peut pas appeler la couche infrastructure ?
1) Cela lui donnerait une raison supplémentaire de changer : elle serait alors dépendante de la couche infrastructure donc un changement dans la couche infrastructure aurait un impact sur la couche application
2) Cela lui permettrait de bypasser le domaine et donc :
   - d'insérer des données invalides dans le système (= ne respectant pas les règles métier)
   - de répondre à des besoins sans créer de use case
     - de la logique fuiterait alors dans cette couche
     - les fonctionnalités du système seraient plus complexe à identifier (la où seule la liste des fichiers du dossier use case devrait suffire) 


## Dossier core
Cette couche représente le coeur/noyau de notre système. C'est dans celle-ci que se trouve le métier de l'application. 
Elle doit être indépendante de toute technologie. Autrement dit, elle ne connait pas les autres couches/dossier de l'application.

Elle est sous divisée en 2 parties :
- use case
- domain

### Use case
Un use case représente une fonctionnalité du système. Il n'a donc qu'une seule responsabilité : orchestrer le métier pour réaliser la fonctionnalité.
Un fichier = un use case. Un use case n'a qu'une seule méthode publique : execute. Celle-ci n'a que deux arguments : un pour l'entrée et un pour la sortie.
Leur type est déclaré dans le même fichier que le use case.

Les use cases doivent être indépendants les uns des autres. Un use case ne peut connaître que ce qu'il y a dans le domaine.

#### Paramètre d'entrée
Appelé NomDuUseCaseCommand ou NomDuUseCaseQuery, il contient l'ensemble des données nécessaires à l'exécution du use case.
L'objectif est de rendre explicite en un seul coup d'oeil les paramètres nécessaires à l'exécution d'un use case.

Il est suffixé par Command quand il s'agit d'un ordre sur le système ou par Query quand il s'agit d'une demande d'information sur le système (voir CQS : Command-query separation ou CQRS pour la définition des termes). 

Dans l'exemple ici, il est nommé : AuthenticateUserUseCaseCommand. Comme on demande une génération de token j'ai considéré qu'il s'agissait d'une command.

#### Paramètre de sortie
Appelé NomDuUseCasePresenter, c'est une interface contenant autant de méthode qu'il y a de cas de retours possibles au use case. 
L'objectif est de rendre explicite en un seul coup d'oeil les différents cas métier sans avoir à lire le code du use case. 
On peut ainsi les comprendre juste en lisant les méthodes de l'interface.
Ici il s'appelle AuthenticateUserUseCasePresenter.


### Domain
Cette couche ne doit en connaître aucune autre.

Ce dossier contient tout ce qui permet de modéliser le métier. On y retrouve :
- les entités/ValueObject
- les interfaces de repository
- les services métier (logique ne pouvant être portée dans les entités)

Le repository permet de récupérer un User sans avoir besoin de connaître où celui-ci est stocké.

Un User est capable de dire si son password est correcte.
Le fait de générer un token est du métier dans un contexte d'authentification par contre le comment celui-ci est généré ne l'est pas (lib).
Un Token est un ValueObject. Pourquoi pas un simple String ? Afin de pouvoir mettre un invariant dans celui-ci : le fait qu'il doit avoir 32 caractères et ainsi rendre explicite cette règle.

J'ai hésité à faire un CredentialRepository à la place du UserRepository. Il aurait eu une méthode `exists(credentials)`.
Il faudrait plus de recul/connaissance sur le domaine pour déterminer ce qui s'en approche le plus.

## Infrastructure
Cette couche contient le code technique permettant d'interagir avec les services externes.
Elle implémente les interfaces du domain.
La génération du token se base par exemple sur la lib uuid. C'est donc dans cette couche que l'on retrouve son utilisation.

## Ma manière de définir où placer le code
Tout le code qui n'a pas de raison de changer si je modifie mon controller (changement de lib par exemple) n'a pas de raison d'être dans le controller et devrait être dans le use case.
Même chose avec l'infra. Si changer les technos ne provoque pas de changement sur une partie du code alors cette partie du code est probablement dans la mauvaise couche.
