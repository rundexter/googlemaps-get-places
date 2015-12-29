var _ = require('lodash'),
    GoogleMapsAPI = require('googlemaps'),
    util = require('./util.js');

var pickInputs = {
        'location': 'location',
        'radius': 'radius',
        'rankby': 'rankby',
        'keyword': 'keyword',
        'name': 'name',
        'opennow': 'opennow',
        'types': 'types',
        'maxprice': 'maxprice'
    },
    pickOutputs = {
        'id': {
            keyName: 'results',
            fields: ['id']
        },
        'name': {
            keyName: 'results',
            fields: ['name']
        },
        'opening_hours': {
            keyName: 'results',
            fields: ['opening_hours']
        },
        'place_id': {
            keyName: 'results',
            fields: ['place_id']
        },
        'types': {
            keyName: 'results',
            fields: ['types']
        },
        'vicinity': {
            keyName: 'results',
            fields: ['vicinity']
        }
    };

module.exports = {

    /**
     * Get auth data.
     *
     * @param step
     * @param dexter
     * @returns {*}
     */
    authOptions: function (step, dexter) {
        var authData = {};

        if (dexter.environment('google_server_key')) {
            authData.key = dexter.environment('google_server_key');
        } else if (dexter.environment('google_client_id') && dexter.environment('google_private_key')) {
            authData.google_client_id = dexter.environment('google_client_id');
            authData.google_private_key = dexter.environment('google_private_key');
        }

        return _.isEmpty(authData)? false : authData;
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(step, dexter);
        if (!auth)
            return this.fail('A [google_server_key] (or [google_client_id,google_private_key] for enterprise) environment variable need for this module.');

        var gmAPI = new GoogleMapsAPI(auth);
        gmAPI.placeSearch(util.pickInputs(step, pickInputs), function(err, result) {
            if (err)
                this.fail(err);
            else
                this.complete(util.pickOutputs(result, pickOutputs));
        }.bind(this));
    }
};
