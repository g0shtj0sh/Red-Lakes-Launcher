import { database, changePanel } from '../utils.js';
import player from '../utils/player.js';

class Skin {
    static id = "panelSkin";
    async init(config) {
        this.config = config;
        this.database = await new database().init();
        this.initSkins();
    }
    initSkins() {
        document.querySelector('.skin-close-btn').addEventListener('click', () => {
            const playerInstance = new player();
            playerInstance.fixPlayer();
            playerInstance.fixSelectedAccounts();
            changePanel('home');
        });

        let username;
        let authToken;
        document.querySelector('.player-head').addEventListener('click', async () => {




            let selectedaccount = await this.database.get('1234', 'accounts-selected');
            let uuid = selectedaccount.value.selected;
            let selectedaccountinfos = await this.database.getAll('accounts');
            for (const data of selectedaccountinfos) {
                if (data.value.uuid == uuid) {
                    authToken = data.value.access_token;
                    username = data.value.name;
                }
            }

            // Appel de la fonction pour récupérer et afficher le skin lors du chargement de la page

            fetchSkinURL(username, function (skinData) {
                displaySkin(skinData);
            });

            // Fonction appelée au chargement de la page

            // Récupère les images du localStorage (s'il est pris en charge)
            let images = [];
            if (isLocalStorageSupported()) {
                const storedImages = localStorage.getItem('images');
                if (storedImages) {
                    images = JSON.parse(storedImages);
                }
            }

            // Affiche les images
            displayImages(images);

        });

        // Fonction appelée lorsqu'une image est ajoutée
        function onFileAdded(file) {
            return new Promise((resolve, reject) => {
                // Vérifie la taille de l'image
                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = function () {
                    if (img.width === 64 && img.height === 64 || img.width === 64 && img.height === 32) {
                        // Convertit l'image en base64
                        convertToBase64(file, function (dataURL) {
                            // Récupère les images existantes du localStorage (s'il est pris en charge)
                            let images = [];
                            if (isLocalStorageSupported()) {
                                const storedImages = localStorage.getItem('images');
                                if (storedImages) {
                                    images = JSON.parse(storedImages);
                                }
                            }

                            // Ajoute la nouvelle image à la liste
                            images.push({
                                dataURL: dataURL
                            });

                            // Stocke les images dans le localStorage
                            if (isLocalStorageSupported()) {
                                localStorage.setItem('images', JSON.stringify(images));
                            }

                            resolve();
                        });
                    } else {
                        console.error('L\'image doit être au format d\'un skin Minecraft (64x64 ou 64x32)');
                        resolve();
                    }
                };
            });
        }
        // Fonction pour convertir l'image en base64
        function convertToBase64(file, callback) {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function () {
                callback(reader.result);
            };
        }
        // Vérifie si le navigateur supporte le stockage local (localStorage)
        function isLocalStorageSupported() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        }
        // Fonction pour afficher les images importées
        function displayImages(images) {


            const imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = ''; // Réinitialise le contenu  

            let verify = document.getElementById('custom-input');
            if (images.length == 0 && verify == null) {
                // Create the label element
                var label = document.createElement("label");
                label.setAttribute("for", "file-input");
                label.setAttribute("class", "custom-input");
                label.id = "custom-input";

                // Create the image element
                var img = document.createElement("img");
                img.setAttribute("class", "icon-skin-input");
                img.setAttribute("src", "assets/images/logo/add.svg");
                img.setAttribute("alt", "plus icon");

                // Create the span element
                var span = document.createElement("span");
                span.setAttribute("class", "input-text");
                span.textContent = "Ajoutrer des skins";

                // Create the input element
                var input = document.createElement("input");
                input.setAttribute("class", "add-files");
                input.setAttribute("type", "file");
                input.setAttribute("id", "file-input");
                input.setAttribute("accept", ".png");
                input.setAttribute("multiple", "");
                input.setAttribute("hidden", "");

                // Append the image and span elements to the label
                label.appendChild(img);
                label.appendChild(span);

                // Append the input element to the label
                label.appendChild(input);
                imageContainer.appendChild(label);
                // Associe l'événement de changement de fichier à l'élément d'entrée de fichier
                const fileInput = document.getElementById('file-input');
                fileInput.addEventListener('change', async function (e) {
                    const files = e.target.files;
                    let images = [];
                    // Parcours des fichiers sélectionnés
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        await onFileAdded(file);
                    }

                    if (isLocalStorageSupported()) {
                        const storedImages = localStorage.getItem('images');
                        if (storedImages) {
                            images = JSON.parse(storedImages);
                        }
                        displayImages(images);
                    }

                    fileInput.value = ''; // Réinitialise la valeur du champ de fichier pour permettre de sélectionner les mêmes fichiers
                });
            }

            // Parcours des images
            for (let i = 0; i < images.length; i++) {
                if (document.getElementById(`skin-viewer${i}`) != null) {
                    document.getElementById(`skin-viewer${i}`).remove();
                }
                const image = images[i];

                // Crée un élément d'aperçu pour chaque image
                const img = new Image();

                // Set the source to the data URL
                img.src = image.dataURL;
                let oldSkin;
                // Check the height once the image is loaded
                img.onload = function () {
                    if (img.height === 32) {
                        oldSkin = 'legacy';
                    }
                    else {
                        oldSkin = 'new';
                    }

                    let variant;
                    checkTransparentPixels(image.dataURL).then(result => {
                        if (result) {
                            variant = "slim";
                        } else {
                            variant = "classic";
                        }
                        const skinViewerHTML = `<!-- Set Skin for the Viewer --><button class=\"skin-delete-btn\"><img class=\"delete-logo\" src=\"assets\/images\/logo\/delete.svg\"><\/button>\r\n<style id="images-style">\r\n\t#skin-viewer${i} *{ background-image: url(\'${image.dataURL}'); }\r\n<\/style>\r\n\r\n<!-- Skin Viewer HTML Elements -->\r\n<div id=\"skin-viewer${i}\" class=\"mc-skin-viewer-11x still ${variant} ${oldSkin}\">\r\n\t<div class=\"player\">\r\n\t\t<!-- Head -->\r\n\t\t<div class=\"head\" >\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Body -->\r\n\t\t<div class=\"body\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Left Arm -->\r\n\t\t<div class=\"left-arm\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Right Arm -->\r\n\t\t<div class=\"right-arm\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Left Leg -->\r\n\t\t<div class=\"left-leg\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Right Leg -->\r\n\t\t<div class=\"right-leg\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t<\/div>\r\n<\/div>`;
                        const imgElement = document.createElement('div');
                        imgElement.innerHTML = skinViewerHTML;
                        imgElement.classList.add('image-preview');
                        imgElement.classList.add('skin-background');
                        imgElement.id = 'image-preview' + i;

                        // Associe les événements de clic à l'élément d'aperçu
                        imgElement.addEventListener('click', function (event) {
                            // Check if the clicked element is the delete button
                            if (event.target.classList.contains('delete-logo')) {
                                removeImage(i); // Trigger the remove image function
                            } else {
                                let imagesjson = JSON.parse(localStorage.getItem('images'));
                                let theimage = imagesjson[i];
                                apply(theimage, imgElement.id); // Trigger the apply function
                            }
                        });


                        // Ajoute l'élément d'aperçu à la div conteneur
                        imageContainer.appendChild(imgElement);
                        if (i == images.length - 1)  {
                            // Create the label element
                            var label = document.createElement("label");
                            label.setAttribute("for", "file-input");
                            label.setAttribute("class", "custom-input");
                            label.id = "custom-input";

                            // Create the image element
                            var img = document.createElement("img");
                            img.setAttribute("class", "icon-skin-input");
                            img.setAttribute("src", "assets/images/logo/add.svg");
                            img.setAttribute("alt", "plus icon");

                            // Create the span element
                            var span = document.createElement("span");
                            span.setAttribute("class", "input-text");
                            span.textContent = "Ajouter des skins";

                            // Create the input element
                            var input = document.createElement("input");
                            input.setAttribute("class", "add-files");
                            input.setAttribute("type", "file");
                            input.setAttribute("id", "file-input");
                            input.setAttribute("accept", ".png");
                            input.setAttribute("multiple", "");
                            input.setAttribute("hidden", "");

                            // Append the image and span elements to the label
                            label.appendChild(img);
                            label.appendChild(span);

                            // Append the input element to the label
                            label.appendChild(input);
                            imageContainer.appendChild(label);
                            // Associe l'événement de changement de fichier à l'élément d'entrée de fichier
                            const fileInput = document.getElementById('file-input');
                            fileInput.addEventListener('change', async function (e) {
                                const files = e.target.files;
                                let images = [];
                                // Parcours des fichiers sélectionnés
                                for (let i = 0; i < files.length; i++) {
                                    const file = files[i];
                                    await onFileAdded(file);
                                }

                                if (isLocalStorageSupported()) {
                                    const storedImages = localStorage.getItem('images');
                                    if (storedImages) {
                                        images = JSON.parse(storedImages);
                                    }
                                    displayImages(images);
                                }

                                fileInput.value = ''; // Réinitialise la valeur du champ de fichier pour permettre de sélectionner les mêmes fichiers
                            });
                        };

                    });
                }
            }
        }
        async function checkTransparentPixels(path) {
            const img = new Image();
            img.src = path;
            await img.decode();
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            function isTransparent(x, y) {
                const pixelData = ctx.getImageData(x, y, 1, 1).data;
                return pixelData[3] === 0;
            }

            function checkRange(startX, startY, endX, endY) {
                for (let x = startX; x <= endX; x++) {
                    for (let y = startY; y <= endY; y++) {
                        if (!isTransparent(x, y)) {
                            return false;
                        }
                    }
                }
                return true;
            }

            const ranges = [
                { startX: 50, startY: 16, endX: 51, endY: 19 },
                { startX: 54, startY: 20, endX: 55, endY: 31 },
                { startX: 42, startY: 48, endX: 43, endY: 51 },
                { startX: 46, startY: 52, endX: 47, endY: 63 }
            ];

            for (const range of ranges) {
                if (!checkRange(range.startX, range.startY, range.endX, range.endY)) {
                    return false;
                }
            }

            return true;
        }
        // Fonction pour supprimer une image
        function removeImage(index) {
            // Récupère les images du localStorage (s'il est pris en charge)
            let images = [];
            if (isLocalStorageSupported()) {
                const storedImages = localStorage.getItem('images');
                if (storedImages) {
                    images = JSON.parse(storedImages);
                }
            }

            // Supprime l'image du tableau
            if (index >= 0 && index < images.length) {
                images.splice(index, 1);

                // Stocke les images mises à jour dans le localStorage
                if (isLocalStorageSupported()) {
                    localStorage.setItem('images', JSON.stringify(images));
                }

                // Affiche les images
                displayImages(images);
            }
            
        }
        // Fonction pour récupérer l'URL du skin depuis l'API Mojang
        function fetchSkinURL(username, callback) {
            const profileURL = `https://api.minecraftservices.com/minecraft/profile`;

            fetch(profileURL, {
                cache: 'no-store', headers: {
                    'Authorization': 'Bearer ' + authToken,
                },
            })
                .then(response => response.json())
                .then(data => {
                    const skinUrl = data.skins[0].url;
                    callback(skinUrl);
                })
                .catch(error => {
                    console.error('Error while retrieving the player skin: ', error);
                });
        }

        // Fonction pour afficher le skin à gauche des images importées
        function displaySkin(skinURL) {
            const skinContainer = document.getElementById('skin-container');
            skinContainer.innerHTML = ''; // Réinitialise le contenu

            // Crée un élément d'image pour le skin
            const img = new Image();

            // Set the source to the data URL
            img.src = skinURL;
            let oldSkin;
            // Check the height once the image is loaded
            img.onload = function () {
                if (img.height === 32) {
                    oldSkin = 'legacy';
                }
                else {
                    oldSkin = 'new';
                }

                let variant;
                checkTransparentPixels(skinURL).then(result => {
                    if (result) {
                        variant = "slim";
                    } else {
                        variant = "classic";
                    }
                    const skinViewerHTML = `<!-- Set Skin for the Viewer -->\r\n<style id="skin-viewer-current-style">\r\n\t#skin-viewer-current *{ background-image: url(\'${skinURL}'); }\r\n<\/style>\r\n\r\n<!-- Skin Viewer HTML Elements -->\r\n<div id=\"skin-viewer-current\" class=\"mc-skin-viewer-11x spin ${variant} ${oldSkin}\">\r\n\t<div class=\"player\">\r\n\t\t<!-- Head -->\r\n\t\t<div class=\"head\" >\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Body -->\r\n\t\t<div class=\"body\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Left Arm -->\r\n\t\t<div class=\"left-arm\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Right Arm -->\r\n\t\t<div class=\"right-arm\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Left Leg -->\r\n\t\t<div class=\"left-leg\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t\t<!-- Right Leg -->\r\n\t\t<div class=\"right-leg\">\r\n\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<div class=\"accessory\">\r\n\t\t\t\t<div class=\"top\"><\/div>\r\n\t\t\t\t<div class=\"left\"><\/div>\r\n\t\t\t\t<div class=\"front\"><\/div>\r\n\t\t\t\t<div class=\"right\"><\/div>\r\n\t\t\t\t<div class=\"back\"><\/div>\r\n\t\t\t\t<div class=\"bottom\"><\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>\r\n\t<\/div>\r\n<\/div>`;
                    const skinImage = document.createElement('div');
                    skinImage.innerHTML = skinViewerHTML;
                    skinImage.classList.add('image-preview');
                    skinContainer.appendChild(skinImage);
                })
            }

            // Ajoute l'élément d'image au conteneur

        }
        // Fonction appelée lorsqu'une fonction est appliquée à une image
        function apply(image, id) {
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            document.body.appendChild(overlay);

            function fetchCurrentSkinUrl(callback) {
                const profileURL = `https://api.minecraftservices.com/minecraft/profile`;

                fetch(profileURL, {
                    cache: 'no-store', headers: {
                        'Authorization': 'Bearer ' + authToken,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        const skinUrl = data.skins[0].url;
                        callback(skinUrl);
                    })
                    .catch(error => {
                        console.error('Error while retrieving the current player skin: ', error);
                        overlay.remove();
                        return;
                    });
            }

            fetchCurrentSkinUrl(function (previousSkin) {

                async function changeSkin(imageData, variant, authToken, callback) {

                    let stringbase64 = imageData.dataURL;
                    // Convert base64 image to Blob
                    const response = await fetch(stringbase64);
                    const data = await response.blob();
                    const file = new File([data], "skin.png", { type: "image/png" });
                    const blob = URL.createObjectURL(file);

                    // Create a FormData object to send the image file
                    var formData = new FormData();
                    formData.append('variant', variant);
                    formData.append('file', file);

                    // Create the request
                    var request = new XMLHttpRequest();
                    request.open('POST', 'https://api.minecraftservices.com/minecraft/profile/skins');
                    request.setRequestHeader('Authorization', 'Bearer ' + authToken);
                    request.onload = function () {
                        if (request.status === 200) {
                            // Request succeeded
                            callback(null, request.responseText);
                        } else {
                            // Request failed
                            callback('Error while changing the skin: ' + request.status);
                        }
                    };

                    // Send the request
                    request.send(formData);
                }
                let variant;
                checkTransparentPixels(image.dataURL)
                    .then(result => {
                        if (result) {
                            variant = "slim";
                        } else {
                            variant = "classic";
                        } // Determine the variant based on the transparency pixels
                        // Change the skin with the determined variant
                        changeSkin(image, variant, authToken, function (error, response) {
                            if (error) {
                                console.error('Error:', error);
                                overlay.remove();
                                return;
                                // Handle the error case here
                            } else {

                                response = JSON.parse(response);
                                let currentSkin = response.skins[0].url;
                                if (currentSkin == previousSkin) {
                                    console.error('Skin déjà appliqué.');
                                    overlay.remove();
                                    return;
                                }

                                const clickedSkin = document.getElementById(id);
                                const imageStyles = clickedSkin.getElementsByTagName('style')[0];

                                // Replace the background URL of the clicked image with the image from the skin container
                                console.log(image.dataURL)
                                console.log(currentSkin)

                                function convertImageToBase64(url, callback) {
                                    var img = new Image();

                                    // Lorsque l'image est chargée, nous la dessinons sur un canvas
                                    img.onload = function () {
                                        var canvas = document.createElement('canvas');
                                        canvas.width = img.width;
                                        canvas.height = img.height;

                                        var ctx = canvas.getContext('2d');
                                        ctx.drawImage(img, 0, 0);

                                        // Obtention de la représentation base64 de l'image à partir du canvas
                                        var dataURL = canvas.toDataURL();

                                        // Appel de la fonction de rappel avec l'image base64 en paramètre
                                        callback(dataURL);
                                    };

                                    // Chargement de l'image à partir du lien
                                    img.src = url;
                                }
                                convertImageToBase64(previousSkin, function (previousSkinBase64) {
                                    imageStyles.innerHTML = imageStyles.innerHTML.replace(image.dataURL, previousSkinBase64);
                                    const styleHTML = imageStyles.innerHTML;
                                    const pattern = /#(skin-viewer\d+)/;
                                    const match = styleHTML.match(pattern);
                                    if (match) {
                                        const id = match[1];
                                        const divElement = document.getElementById(id); // Select the corresponding div by ID

                                        if (divElement) {
                                            // Replace the background URL of the clicked image with the image from the skin container
                                            const img = new Image();




                                            // Set the source to the data URL
                                            img.src = previousSkinBase64;
                                            let oldSkin;
                                            // Check the height once the image is loaded
                                            img.onload = function () {
                                                if (img.height === 32) {
                                                    oldSkin = 'legacy';
                                                    //check if the div contains the class new and remove it then add the class legacy
                                                    if (divElement.classList.contains('new')) {
                                                        divElement.classList.remove('new');
                                                    }
                                                }
                                                else {
                                                    oldSkin = 'new';
                                                    //check if the div contains the class legacy and remove it then add the class new
                                                    if (divElement.classList.contains('legacy')) {
                                                        divElement.classList.remove('legacy');
                                                    }
                                                }

                                                let variant;
                                                checkTransparentPixels(previousSkin).then(result => {
                                                    if (result) {
                                                        variant = "slim";
                                                        if (divElement.classList.contains('classic')) {
                                                            divElement.classList.remove('classic');
                                                        }
                                                    } else {
                                                        variant = "classic";
                                                        if (divElement.classList.contains('slim')) {
                                                            divElement.classList.remove('slim');
                                                        }
                                                    }
                                                    divElement.classList.add(variant)
                                                    divElement.classList.add(oldSkin)
                                                });
                                            }

                                        }
                                    } else {
                                        console.log("No ID found in the style tag");
                                    }

                                    //update the images in the local storage
                                    const images = JSON.parse(localStorage.getItem('images'));
                                    let imageIndex = id.replace('image-preview', '');
                                    images[imageIndex].dataURL = previousSkinBase64;

                                    localStorage.setItem('images', JSON.stringify(images));

                                    // Replace current skin in the skin container
                                    const img = new Image();

                                    // Set the source to the data URL
                                    img.src = currentSkin;
                                    let oldSkin;
                                    // Check the height once the image is loaded
                                    const skinViewer = document.getElementById('skin-viewer-current');
                                    img.onload = function () {
                                        if (img.height === 32) {
                                            oldSkin = 'legacy';
                                            if (skinViewer.classList.contains('new')) {
                                                skinViewer.classList.remove('new');
                                            }
                                        }
                                        else {
                                            oldSkin = 'new';
                                            if (skinViewer.classList.contains('legacy')) {
                                                skinViewer.classList.remove('legacy');
                                            }
                                        }

                                        let variant;
                                        checkTransparentPixels(currentSkin).then(result => {
                                            if (result) {
                                                variant = "slim";
                                                if (skinViewer.classList.contains('classic')) {
                                                    skinViewer.classList.remove('classic');
                                                }
                                            } else {
                                                variant = "classic";
                                                if (skinViewer.classList.contains('slim')) {
                                                    skinViewer.classList.remove('slim');
                                                }
                                            }
                                            const skinContainer = document.getElementById('skin-viewer-current-style');

                                            skinContainer.innerHTML = `#skin-viewer-current *{ background-image: url(\'${currentSkin}\'); }`;
                                            skinViewer.classList.add(variant)
                                            skinViewer.classList.add(oldSkin)
                                        });
                                    }

                                    // Continue with your future code here
                                    overlay.remove(); // Remove the overlay
                                });
                            }

                        });

                    })
                    .catch(error => {
                        console.error(error);
                        overlay.remove(); // Remove the overlay
                        return;
                    });
            });
        }

    }

}

export default Skin;
