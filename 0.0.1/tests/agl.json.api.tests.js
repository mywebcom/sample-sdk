'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;

const nock = require('nock');

const AGL = require('../src/agl.es6');
const api = new AGL();
const petsRs = require('./fixtures/pets');

describe('AGL Automated Test with Mocked API response', () => {

    beforeEach(() => {
        nock('http://agl-developer-test.azurewebsites.net/')
            .get(uri => uri.includes('people.json'))
            .reply(200, petsRs);
    });

    it('sort cats by name and gender of their owners', () => {
        api.fetch().then((rs)=>{
            const cats = api.sortCats(rs);
            expect(typeof cats).to.equal('object');
            expect(cats.female[0].name).to.equal('Simba');
        })
    });

    afterEach(() => {
        nock.cleanAll();
    })
});