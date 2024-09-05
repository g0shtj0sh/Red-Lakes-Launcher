'use strict';
import { database, changePanel } from '../utils.js';

class Player {
    async init(config) {
        this.config = config;
        this.database = await new database().init();
        this.fixPlayer();
        this.fixAccounts();
    }

    async fixPlayer() {
        this.database = await new database().init();
    let accounts = await this.database.getAll('accounts');
        let activeUser = document.querySelector('.active-account');
        let uuid = activeUser.querySelector('.account-uuid').textContent;
        
        function getAccessTokenByUUID(jsonData, uuid) {
            for (const data of jsonData) {

                if (data.value.uuid == uuid) {
                    
                    return data.value.access_token;
                }
            }
            return "null";
        }
        let accessToken = getAccessTokenByUUID(accounts, uuid);
        console.log(accessToken);
        
        if (accessToken == "null") {
            // Player token is null
            document.querySelector(".player-head").style.pointerEvents = "none";
            document.getElementById("head-container").title = "Connectez-vous à un compte premium pour changer de skin";
            document.getElementById("head-container").style.cursor = "not-allowed";
            console.log("Player token is null");
            var elements = document.querySelector('.player-head');
            elements.style.backgroundImage = `url('assets/images/default/steve.png')`;
        } else {
            // Player token is not null
            document.getElementById("head-container").title = "";
            document.getElementById("head-container").style.cursor = "default";
            document.querySelector(".player-head").style.pointerEvents = "auto";
            console.log("Player token is not null");
            var elements = document.querySelector('.player-head');
            let username;
            let authToken;
            let selectedaccount = await this.database.get('1234', 'accounts-selected');
            let uuid = selectedaccount.value.selected;
            let selectedaccountinfos = await this.database.getAll('accounts');
            for (const data of selectedaccountinfos) {
                if (data.value.uuid == uuid) {
                    authToken = data.value.access_token;
                    username = data.value.name;
                }
            }
        
            // Fonction pour récupérer l'URL du skin depuis l'API Mojang
            function fetchSkinURLHead(username, callback) {
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
            fetchSkinURLHead(username, function (skinData) {
                elements.style.backgroundImage = `url(${skinData})`;
            });
        }
    }
    async fixAccounts(uuid) {
        this.database = await new database().init();
    let accounts = await this.database.getAll('accounts');

        
        function getAccessTokenByUUID(jsonData, uuid) {
            for (const data of jsonData) {

                if (data.value.uuid == uuid) {
                    
                    return data.value.access_token;
                }
            }
            return "null";
        }
        let accessToken = getAccessTokenByUUID(accounts, uuid);
        console.log(accessToken);
        
        if (accessToken == "null") {
            // Player token is null

            var divElement = document.getElementById(uuid);
            if (divElement) {
                const accountImageElement = divElement.querySelector('.account-image');
                accountImageElement.style.backgroundImage = `url('assets/images/default/steve.png')`;
                // Perform further operations on the accountImageElement
              }
        } else {
            // Player token is not null
            var elements = document.getElementById(uuid);
            let username;
            let authToken;
            let selectedaccountinfos = await this.database.getAll('accounts');
            for (const data of selectedaccountinfos) {
                if (data.value.uuid == uuid) {
                    authToken = data.value.access_token;
                    username = data.value.name;
                }
            }
        
            // Fonction pour récupérer l'URL du skin depuis l'API Mojang
            function fetchSkinURLHead(username, callback) {
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
            fetchSkinURLHead(username, function (skinData) {
                const accountImageElement = elements.querySelector('.account-image');
                accountImageElement.style.backgroundImage = `url(${skinData})`;
            });
        }
    }
    async fixSelectedAccounts() {
        this.database = await new database().init();
    let accounts = await this.database.getAll('accounts');
    const selectedaccount = document.querySelector('.active-account');
    let uuid = selectedaccount.id;

        
        function getAccessTokenByUUID(jsonData, uuid) {
            for (const data of jsonData) {

                if (data.value.uuid == uuid) {
                    
                    return data.value.access_token;
                }
            }
            return "null";
        }
        let accessToken = getAccessTokenByUUID(accounts, uuid);
        console.log(accessToken);
        
        if (accessToken == "null") {
            // Player token is null

            var divElement = document.getElementById(uuid);
            if (divElement) {
                const accountImageElement = divElement.querySelector('.account-image');
                accountImageElement.style.backgroundImage = `url('assets/images/default/steve.png')`;
                // Perform further operations on the accountImageElement
              }
        } else {
            // Player token is not null
            var elements = document.getElementById(uuid);
            let username;
            let authToken;
            let selectedaccountinfos = await this.database.getAll('accounts');
            for (const data of selectedaccountinfos) {
                if (data.value.uuid == uuid) {
                    authToken = data.value.access_token;
                    username = data.value.name;
                }
            }
        
            // Fonction pour récupérer l'URL du skin depuis l'API Mojang
            function fetchSkinURLHead(username, callback) {
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
            fetchSkinURLHead(username, function (skinData) {
                const accountImageElement = elements.querySelector('.account-image');
                accountImageElement.style.backgroundImage = `url(${skinData})`;
            });
        }
    }
}


export default Player;