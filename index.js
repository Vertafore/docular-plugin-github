"use strict";

module.exports =  {
    ui_resources: {
        js: ['resources/javascript/behavior.js'],
        css: ['resources/css/style.css']
    },
    controllers: {
        repos: {
            node: 'resources/controllers/github_controller_repos.js',
            php: 'resources/controllers/github_controller_repos.php'
        }
    },
    configs: {
        client: {
            owner: false,
            repo: false
        },
        server: {
            client_id: false,
            client_secret: false
        }
    }
};