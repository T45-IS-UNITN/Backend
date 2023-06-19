const request = require('supertest');
const assert = require("assert");
const { setupData, testBefore, testAfter } = require("./utils")
const app = require("../index");

describe('Test API Feed', () => {

    let utente;

    before(async () => {
        await testBefore().then(async () => {
            const setupDataResponse = await setupData();
            utente = setupDataResponse.utente;
        })
    });

    after(async () => {
        await testAfter()
    });

    describe("GET /feed/libri", () => {
        it('dovrebbe ottenere libri consigliati per un utente', (done) => {
            request(app)
                .get(`/feed/libri/${utente._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(Array.isArray(res.body), true);
                    done();
                });
        });
    })


    describe('GET /feed/recensioni', () => {
        it('dovrebbe ottenere recensioni basate sulle preferenze dell\'utente', (done) => {
            request(app)
                .get(`/feed/recensioni/${utente._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(Array.isArray(res.body), true);
                    done();
                });
        });
    });
});


