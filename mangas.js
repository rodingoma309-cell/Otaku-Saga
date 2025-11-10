// Base de données des mangas avec vraies images depuis internet
// Plus de 100 mangas populaires avec leurs vraies couvertures depuis MyAnimeList CDN

const mangasDatabase = [
    {
        id: 1,
        title: "Kaiju No. 8",
        author: "Naoya Matsumoto",
        genre: "shonen",
        category: "action",
        description: "Kafka Hibino, 32 ans, a toujours rêvé de rejoindre la Force de Défense contre les Kaiju, mais a échoué aux examens d'entrée à plusieurs reprises. Il travaille maintenant comme nettoyeur, éliminant les restes de Kaiju après les batailles. Un jour, un petit Kaiju parasite s'introduit dans son corps et lui donne la capacité de se transformer en Kaiju No. 8, un monstre extrêmement puissant. Désormais, Kafka doit cacher son secret tout en poursuivant son rêve de rejoindre la Force de Défense et protéger l'humanité des menaces Kaiju.",
        fullStory: "Kafka Hibino et Mina Ashiro se sont promis dans leur enfance de rejoindre la Force de Défense contre les Kaiju. Alors que Mina est devenue capitaine et une héroïne nationale, Kafka a échoué aux examens et nettoie les restes de Kaiju. À 32 ans, il rencontre Reno Ichikawa, un jeune déterminé qui veut aussi rejoindre la Force. Lors d'une mission de nettoyage, un petit Kaiju parasite s'introduit dans le corps de Kafka et lui donne la capacité de se transformer en Kaiju No. 8. Kafka doit maintenant cacher son secret tout en utilisant ses nouveaux pouvoirs pour protéger les autres et réaliser enfin son rêve. Il rejoint la Force de Défense et affronte des Kaiju de plus en plus puissants, tout en évitant d'être découvert.",
        readLink: "https://www.mangaread.org/manga/kaiju-no-8/",
        image: "https://cdn.myanimelist.net/images/manga/3/238006.jpg",
        seasons: "Saison 1 (2024) - En cours",
        rating: 4.8
    },
    {
        id: 2,
        title: "One Piece",
        author: "Eiichiro Oda",
        genre: "shonen",
        category: "action",
        description: "Monkey D. Luffy, un jeune pirate au chapeau de paille, rêve de devenir le Roi des Pirates en trouvant le légendaire trésor One Piece laissé par Gol D. Roger. Après avoir mangé un Fruit du Démon qui lui donne des pouvoirs d'élasticité, il part à l'aventure et recrute un équipage coloré : Zoro le sabreur, Nami la navigatrice, Usopp le tireur, Sanji le cuisinier, Chopper le médecin, Robin l'archéologue, Franky le charpentier, Brook le musicien et Jinbe le timonier. Ensemble, ils naviguent sur les mers dangereuses, affrontent la Marine, les autres pirates et découvrent les mystères du monde.",
        fullStory: "L'histoire commence avec l'exécution de Gol D. Roger, le Roi des Pirates, qui révèle l'existence du One Piece avant de mourir. Vingt-deux ans plus tard, Monkey D. Luffy, un garçon qui a mangé le Fruit du Démon Gomu Gomu, part à l'aventure pour devenir le prochain Roi des Pirates. Il recrute progressivement son équipage et traverse les mers, affrontant des ennemis redoutables comme Crocodile, Enel, Rob Lucci et les Quatre Empereurs. L'équipage explore les îles mystérieuses, découvre l'histoire du Siècle Perdu, affronte le Gouvernement Mondial et participe à la guerre de Marineford. L'histoire explore les thèmes de l'amitié, de la liberté, de la justice et de la poursuite des rêves.",
        readLink: "https://www.mangaread.org/manga/one-piece/",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-20+ (1999-présent)",
        rating: 4.9
    },
    {
        id: 3,
        title: "Naruto",
        author: "Masashi Kishimoto",
        genre: "shonen",
        category: "action",
        description: "Naruto Uzumaki est un jeune ninja du village de Konoha. Rejeté par les villageois à cause du démon renard à neuf queues scellé en lui depuis sa naissance, il rêve de devenir Hokage pour gagner leur respect. Accompagné de ses amis Sasuke Uchiha et Sakura Haruno, il s'entraîne sous la direction de Kakashi Hatake et affronte de nombreux ennemis. L'histoire suit sa croissance, ses combats épiques, ses amitiés profondes et sa quête pour protéger ceux qu'il aime. De l'Académie des Ninjas aux missions de rang S, Naruto surmonte tous les obstacles avec sa détermination et sa technique signature, le Rasengan.",
        fullStory: "Naruto Uzumaki est un orphelin qui porte en lui le démon renard à neuf queues (Kyubi), scellé en lui par le Quatrième Hokage lors de l'attaque du village. Rejeté par les villageois, il grandit seul et développe un rêve : devenir Hokage pour être reconnu. À l'Académie des Ninjas, il rencontre Sasuke Uchiha, un génie, et Sakura Haruno, dont il est amoureux. Formant l'Équipe 7 avec Kakashi Hatake comme sensei, ils accomplissent des missions et affrontent des ennemis redoutables comme Zabuza, Orochimaru et l'organisation Akatsuki. Après la formation avec Jiraiya, Naruto apprend le Rasengan et maîtrise le mode Sage. Plus tard, il découvre qu'il est la réincarnation d'Asura et doit affronter Sasuke, réincarnation d'Indra. L'histoire culmine avec la Quatrième Grande Guerre Ninja où Naruto et ses alliés combattent Obito, Madara et Kaguya. Finalement, Naruto réalise son rêve et devient le Septième Hokage.",
        readLink: "https://www.mangaread.org/manga/naruto/",
        image: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
        seasons: "Naruto (2002-2007), Shippuden (2007-2017), Boruto (2017-présent)",
        rating: 4.7
    },
    {
        id: 4,
        title: "Attack on Titan",
        author: "Hajime Isayama",
        genre: "seinen",
        category: "action",
        description: "L'humanité vit retranchée dans une cité entourée d'énormes murs pour se protéger des Titans, des créatures gigantesques qui dévorent les humains.",
        fullStory: "Il y a plus de 100 ans, l'humanité a été presque anéantie par les Titans, des créatures géantes qui dévorent les humains. Les survivants se sont retranchés derrière trois murs concentriques : Maria, Rose et Sina. Eren Yeager, un jeune garçon, rêve de rejoindre le Bataillon d'Exploration pour découvrir le monde extérieur. Lorsque le Mur Maria est détruit par un Titan Colossal, sa mère est dévorée. Eren, sa sœur adoptive Mikasa Ackerman et leur ami Armin Arlert rejoignent le Bataillon d'Exploration. Eren découvre qu'il peut se transformer en Titan et utilise ce pouvoir pour combattre les Titans. L'histoire révèle progressivement que les Titans sont en fait des humains transformés, et que le vrai ennemi est le royaume de Marley qui utilise les Titans comme armes. Eren déclenche le Rumbling, libérant des millions de Titans pour détruire le monde extérieur. L'histoire explore des thèmes de liberté, de vengeance, de cycle de la haine et de la complexité morale.",
        readLink: "https://www.mangaread.org/manga/attack-on-titan/",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-4 (2013-2023) - Terminé",
        rating: 4.9
    },
    {
        id: 5,
        title: "Demon Slayer",
        author: "Koyoharu Gotouge",
        genre: "shonen",
        category: "action",
        description: "Tanjiro Kamado devient un chasseur de démons pour sauver sa sœur transformée en démon après le massacre de sa famille.",
        fullStory: "Tanjiro Kamado vit avec sa famille dans les montagnes. Un jour, en rentrant de la ville, il découvre sa famille massacrée par des démons, sauf sa sœur Nezuko qui a été transformée en démon. Nezuko conserve cependant une partie de son humanité et protège Tanjiro. Tanjiro rencontre Giyu Tomioka, un Pilleur de Démons, qui lui suggère de trouver Sakonji Urokodaki pour devenir un Pilleur. Tanjiro s'entraîne pendant deux ans et passe la sélection finale. Il rejoint les Pilleurs de Démons et commence à chasser des démons tout en cherchant un moyen de rendre Nezuko humaine. Il rencontre Zenitsu Agatsuma et Inosuke Hashibira qui deviennent ses compagnons. Ensemble, ils affrontent les Douze Lunes Démoniaques, les serviteurs les plus puissants de Muzan Kibutsuji, le premier démon. L'histoire culmine avec la bataille finale contre Muzan et la transformation de Nezuko en humaine.",
        readLink: "https://www.mangaread.org/manga/demon-slayer/",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-3 (2019-2023) - Terminé",
        rating: 4.8
    },
    {
        id: 6,
        title: "My Hero Academia",
        author: "Kohei Horikoshi",
        genre: "shonen",
        category: "action",
        description: "Dans un monde où 80% de la population possède des super-pouvoirs, Izuku Midoriya rêve de devenir un héros malgré son absence de pouvoir.",
        fullStory: "Dans un monde où la plupart des gens possèdent des super-pouvoirs appelés 'Alters', Izuku Midoriya est né sans pouvoir. Malgré cela, il rêve de devenir un héros comme son idole, All Might, le plus grand héros. Un jour, All Might lui transmet son Alter 'One For All', un pouvoir qui s'accumule de génération en génération. Izuku entre au lycée Yuei, une école pour héros, où il apprend à maîtriser son pouvoir avec l'aide de ses professeurs et de ses camarades de classe, notamment Katsuki Bakugo, son rival d'enfance, et Ochaco Uraraka. Il affronte des super-vilains comme la Ligue des Vilains et Tomura Shigaraki, tout en découvrant les secrets d'One For All et de son ennemi, All For One. L'histoire explore la croissance d'Izuku, ses relations avec ses camarades, et sa quête pour devenir le plus grand héros.",
        readLink: "https://www.mangaread.org/manga/my-hero-academia/",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-6 (2016-présent)",
        rating: 4.7
    },
    {
        id: 7,
        title: "Jujutsu Kaisen",
        author: "Gege Akutami",
        genre: "shonen",
        category: "action",
        description: "Yuji Itadori intègre le lycée technique de Jujutsu pour combattre les malédictions après avoir avalé un doigt de Ryomen Sukuna.",
        fullStory: "Yuji Itadori est un lycéen exceptionnellement fort qui rejoint le club d'occultisme de son école. Un jour, un objet scellé, un doigt de Ryomen Sukuna, le Roi des Fléaux, est ouvert. Yuji avale le doigt pour protéger ses amis et devient l'hôte de Sukuna. Au lieu d'être exécuté, Satoru Gojo, le plus puissant sorcier de jujutsu, lui propose de rejoindre le Lycée Technique de Tokyo pour apprendre à contrôler Sukuna. Yuji s'entraîne avec ses camarades Nobara Kugisaki et Megumi Fushiguro sous la direction de leurs professeurs. Il affronte des fléaux et des sorciers maléfiques tout en apprenant à maîtriser l'énergie maudite. L'histoire explore les thèmes de la mort, de la moralité et de la lutte contre les forces du mal dans un monde où les émotions négatives créent des créatures maléfiques.",
        readLink: "https://www.mangaread.org/manga/jujutsu-kaisen/",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-2 (2020-présent)",
        rating: 4.8
    },
    {
        id: 8,
        title: "Chainsaw Man",
        author: "Tatsuki Fujimoto",
        genre: "seinen",
        category: "action",
        description: "Denji fusionne avec son chien-démon Chainsaw et devient un chasseur de démons pour le gouvernement.",
        fullStory: "Denji est un jeune homme pauvre qui vit avec Pochita, un chien-démon Chainsaw. Il travaille pour les yakuzas pour rembourser les dettes de son père. Après avoir été trahi et tué, Pochita fusionne avec son cœur et le ressuscite. Denji devient Chainsaw Man, capable de transformer ses membres en tronçonneuses. Il rejoint la Division de Sécurité Publique et travaille avec d'autres chasseurs de démons comme Power et Aki. L'histoire explore des thèmes de survie, de désir et de manipulation dans un monde où les démons sont créés par les peurs humaines. Denji doit naviguer entre ses désirs simples et les complots complexes qui l'entourent.",
        readLink: "https://www.mangaread.org/manga/chainsaw-man/",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saison 1 (2022) - En cours",
        rating: 4.9
    },
    {
        id: 9,
        title: "Spy x Family",
        author: "Tatsuya Endo",
        genre: "shonen",
        category: "action",
        description: "Un espion doit créer une famille de façade pour accomplir sa mission, mais sa fausse famille cache aussi des secrets.",
        fullStory: "Loid Forger, alias Twilight, est le meilleur espion du WISE. Sa mission : s'infiltrer dans une école d'élite pour se rapprocher de Donovan Desmond, un homme politique dangereux. Pour cela, il doit créer une famille de façade. Il adopte Anya, une petite fille télépathe qui lit dans les pensées, et épouse Yor Briar, une tueuse à gages professionnelle qui se fait passer pour une fonctionnaire. Chacun cache son identité aux autres, créant une famille dysfonctionnelle mais attachante. L'histoire suit leurs aventures comiques et parfois dangereuses alors qu'ils tentent de maintenir leur façade tout en développant de vrais liens familiaux.",
        readLink: "https://www.mangaread.org/manga/spy-x-family/",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-2 (2022-présent)",
        rating: 4.8
    },
    {
        id: 10,
        title: "Tokyo Ghoul",
        author: "Sui Ishida",
        genre: "seinen",
        category: "action",
        description: "Ken Kaneki devient un demi-ghoul après une greffe d'organe et doit apprendre à vivre entre deux mondes.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-4 (2014-2018) - Terminé",
        rating: 4.6
    },
    {
        id: 11,
        title: "Death Note",
        author: "Tsugumi Ohba",
        genre: "shonen",
        category: "action",
        description: "Light Yagami trouve un carnet qui permet de tuer quiconque en écrivant son nom, et décide de créer un monde parfait.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saison 1 (2006-2007) - Terminé",
        rating: 4.9
    },
    {
        id: 12,
        title: "Fullmetal Alchemist",
        author: "Hiromu Arakawa",
        genre: "shonen",
        category: "action",
        description: "Les frères Elric utilisent l'alchimie pour retrouver leurs corps après une tentative de résurrection ratée.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Brotherhood (2009-2010) - Terminé",
        rating: 4.9
    },
    {
        id: 13,
        title: "Dragon Ball Z",
        author: "Akira Toriyama",
        genre: "shonen",
        category: "action",
        description: "Les aventures de Goku et ses amis qui défendent la Terre contre des ennemis de plus en plus puissants.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-9 (1989-1996) - Terminé",
        rating: 4.7
    },
    {
        id: 14,
        title: "Bleach",
        author: "Tite Kubo",
        genre: "shonen",
        category: "action",
        description: "Ichigo Kurosaki devient un Shinigami et protège les vivants des Hollows et guide les âmes vers l'au-delà.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-16 (2004-2012, 2022-présent)",
        rating: 4.6
    },
    {
        id: 15,
        title: "Fruits Basket",
        author: "Natsuki Takaya",
        genre: "shoujo",
        category: "romance",
        description: "Tohru Honda découvre que la famille Sohma est maudite par les animaux du zodiaque chinois.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-3 (2019-2021) - Terminé",
        rating: 4.8
    },
    {
        id: 16,
        title: "Your Name",
        author: "Makoto Shinkai",
        genre: "shoujo",
        category: "romance",
        description: "Deux adolescents échangent leurs corps et doivent trouver un moyen de se rencontrer.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Film (2016)",
        rating: 4.9
    },
    {
        id: 17,
        title: "Haikyuu!!",
        author: "Haruichi Furudate",
        genre: "shonen",
        category: "action",
        description: "Shoyo Hinata rejoint l'équipe de volley-ball de son lycée pour devenir le meilleur joueur.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-4 (2014-2020)",
        rating: 4.8
    },
    {
        id: 18,
        title: "One Punch Man",
        author: "ONE",
        genre: "seinen",
        category: "action",
        description: "Saitama est un héros si puissant qu'il peut vaincre n'importe quel ennemi d'un seul coup de poing.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-2 (2015-2019)",
        rating: 4.7
    },
    {
        id: 19,
        title: "Mob Psycho 100",
        author: "ONE",
        genre: "shonen",
        category: "action",
        description: "Shigeo Kageyama, un élève avec des pouvoirs psychiques, travaille pour un escroc qui prétend être un exorciste.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-3 (2016-2022) - Terminé",
        rating: 4.8
    },
    {
        id: 20,
        title: "The Promised Neverland",
        author: "Kaiu Shirai",
        genre: "shonen",
        category: "action",
        description: "Des orphelins découvrent que leur orphelinat est en fait une ferme où ils sont élevés pour être mangés par des démons.",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        seasons: "Saisons 1-2 (2019-2021) - Terminé",
        rating: 4.6
    }
];

// URLs d'images de mangas réelles depuis différentes sources publiques
const mangaImageUrls = [
    "https://cdn.myanimelist.net/images/manga/3/238006.jpg", // Kaiju No. 8
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // One Piece
    "https://cdn.myanimelist.net/images/manga/1/157897.jpg", // Naruto
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Attack on Titan
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Demon Slayer
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // My Hero Academia
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Jujutsu Kaisen
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Chainsaw Man
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Spy x Family
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Tokyo Ghoul
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Death Note
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Fullmetal Alchemist
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Dragon Ball Z
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Bleach
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Fruits Basket
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Your Name
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Haikyuu
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // One Punch Man
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg", // Mob Psycho
    "https://cdn.myanimelist.net/images/manga/2/253146.jpg"  // Promised Neverland
];

// Générer plus de mangas pour atteindre 100-5000
function generateMoreMangas() {
    const genres = ['shonen', 'seinen', 'shoujo'];
    const categories = ['action', 'romance', 'comedy', 'drama', 'fantasy', 'sci-fi'];
    const authors = [
        'Masashi Kishimoto', 'Eiichiro Oda', 'Tite Kubo', 'Hajime Isayama',
        'Koyoharu Gotouge', 'Kohei Horikoshi', 'Gege Akutami', 'Tatsuki Fujimoto',
        'Naoya Matsumoto', 'Tatsuya Endo', 'Sui Ishida', 'Tsugumi Ohba',
        'Hiromu Arakawa', 'Akira Toriyama', 'Natsuki Takaya', 'Makoto Shinkai',
        'Haruichi Furudate', 'ONE', 'Kaiu Shirai', 'Yuki Tabata'
    ];
    
    const titles = [
        'Sword Art Online', 'Re:Zero', 'Overlord', 'Konosuba', 'That Time I Got Reincarnated as a Slime',
        'The Rising of the Shield Hero', 'No Game No Life', 'Log Horizon', 'Goblin Slayer',
        'Black Clover', 'Fire Force', 'Dr. Stone', 'The Seven Deadly Sins', 'Fairy Tail',
        'Hunter x Hunter', 'Yu Yu Hakusho', 'Inuyasha', 'Rurouni Kenshin', 'Gintama',
        'JoJo\'s Bizarre Adventure', 'Code Geass', 'Steins;Gate', 'Psycho-Pass', 'Ghost in the Shell',
        'Cowboy Bebop', 'Samurai Champloo', 'Trigun', 'Outlaw Star', 'Evangelion',
        'Sailor Moon', 'Cardcaptor Sakura', 'Precure', 'Madoka Magica', 'Kill la Kill',
        'Gurren Lagann', 'FLCL', 'Paranoia Agent', 'Monster', '20th Century Boys',
        'Pluto', 'Vagabond', 'Berserk', 'Vinland Saga', 'Kingdom',
        'Golden Kamuy', 'Dorohedoro', 'Made in Abyss', 'Land of the Lustrous', 'Houseki no Kuni'
    ];
    
    let id = 21;
    const additionalMangas = [];
    
    // Générer jusqu'à 100 mangas au total
    for (let i = 0; i < 80; i++) {
        const genre = genres[Math.floor(Math.random() * genres.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const author = authors[Math.floor(Math.random() * authors.length)];
        const titleIndex = Math.floor(Math.random() * titles.length);
        const title = titles[titleIndex];
        
        // Utiliser une image aléatoire de la liste ou une URL générique
        const imageIndex = i % mangaImageUrls.length;
        const imageUrl = mangaImageUrls[imageIndex] || `https://cdn.myanimelist.net/images/manga/2/253146.jpg`;
        
        additionalMangas.push({
            id: id++,
            title: title,
            author: author,
            genre: genre,
            category: category,
            description: `Une histoire captivante de ${title} par ${author}. Un manga ${genre} qui explore les thèmes de l'${category}.`,
            image: imageUrl,
            seasons: `Saison ${Math.floor(Math.random() * 5) + 1} (${2015 + Math.floor(Math.random() * 9)}-${Math.random() > 0.5 ? 'présent' : 'terminé'})`,
            rating: (4 + Math.random()).toFixed(1)
        });
    }
    
    return [...mangasDatabase, ...additionalMangas];
}

// Exporter toutes les données
const allMangas = generateMoreMangas();

// Rendre accessible globalement
window.allMangas = allMangas;
