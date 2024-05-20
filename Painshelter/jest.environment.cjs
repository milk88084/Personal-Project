const Environment = require("jest-environment-jsdom").default;
const React = require('react');
module.exports = class CustomTestEnvironment extends Environment {
    async setup() {
        await super.setup();
        this.global.TextEncoder = TextEncoder;
        this.global.TextDecoder = TextDecoder;
        this.global.Response = Response;
        this.global.Request = Request;
        this.global.React = React;
        
    }
};