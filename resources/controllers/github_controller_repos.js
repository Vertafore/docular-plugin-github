
//the controller will be brought in as a require statment
//The function controller should be implemented as an express use handler (middleware)
module.exports = {

    /**
     * [ description]
     * @param  {[type]}   req            [description]
     * @param  {[type]}   res            [description]
     * @param  {Function} next           [description]
     * @param  {[type]}   api            [description]
     * @param  {[type]}   configs_server [description]
     * @return {[type]}                  [description]
     */
    controller: function (req, res, next, api, configs_server) {

        /*============ REPOS API ============*/

        var reposDefaults = {
            client_id: configs_server.client_id,
            client_secret: configs_server.client_secret
        };

        // /repos/:owner/:repo/contributors
        var CTRL_REPO_CONTRIBUTOR = /\/([^\/]{1,})\/([^\/]{1,})\/contributors/;
        // /repos/:owner/:repo/issues
        var CTRL_REPO_ISSUES = /\/([^\/]{1,})\/([^\/]{1,})\/issues/;

        var ctrlParams = req.url.match(CTRL_REPO_CONTRIBUTOR);
        var ctrlIssues = req.url.match(CTRL_REPO_ISSUES);

        var params, configs, uri;

        if(ctrlParams){

            params = {owner: ctrlParams[1], repo: ctrlParams[2]};
            configs = api.nodeExtend(true, {}, reposDefaults, params);

            //request url
            uri = api.addQueryParams('https://api.github.com' +
                '/repos/'+configs.owner+'/'+configs.repo+'/contributors' +
                '?client_id=' + configs.client_id + '&client_secret=' + configs.client_secret, req.query);

            api.request(
                {
                    uri: uri,
                    headers: {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'}
                },
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.json(JSON.parse(body));
                    } else {
                        res.json({error:true});
                    }
                }
            );

        } else if (ctrlIssues) {

            params = {owner: ctrlIssues[1], repo: ctrlIssues[2]};
            configs = api.nodeExtend(true, {}, reposDefaults, params);

            //request url
            uri = api.addQueryParams('https://api.github.com' +
                '/repos/'+configs.owner+'/'+configs.repo+'/issues' +
                '?client_id=' + configs.client_id + '&client_secret=' + configs.client_secret, req.query);

            api.request(
                {
                    uri: uri,
                    headers: {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'}
                },
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.json(JSON.parse(body));
                    } else {
                        res.json({error:true});
                    }
                }
            );
        }

    }
};