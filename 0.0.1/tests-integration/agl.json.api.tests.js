'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;

const AGL = require('../src/agl.es6');
const api = new AGL();

describe('AGL Automated Test', () => {
    it('can fetch all the pets', () => {
        return api.fetch().then( res => {
            expect(typeof res).to.equal('object');
        });
    });
});