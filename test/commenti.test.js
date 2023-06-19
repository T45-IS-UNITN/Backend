const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const Commento = require("../models/Commento");
const Utente = require("../models/Utente").Utente;
const Libro = require("../models/Libro")
const Recensione = require("../models/Recensione");
const { setupData, testBefore, testAfter } = require("./utils")

describe("Test API Commenti", () => {
    let utente;
    let recensione;
    let commento;
    let libro;

    before(async () => {
        await testBefore().then(async () => {
            const setupDataResponse = await setupData();
            utente = setupDataResponse.utente;
            commento = setupDataResponse.commento1;
            libro = setupDataResponse.libro1;
            recensione = setupDataResponse.recensione;
        })
    });

    after(async () => {
        await testAfter()
    });

    describe("GET /commenti/:recensioneId", () => {
        it("should return the comments of a review", (done) => {
            request(app)
                .get(`/commenti/${recensione.id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(Array.isArray(res.body), true);
                    done();
                });
        });
    });


    describe("POST /commenti/:recensioneId", () => {
        it("dovrebbe pubblicare un commento", (done) => {
            const testo = "Nuovo commento di prova";
            const autoreId = utente._id;

            request(app)
                .post(`/commenti/${recensione._id}`)
                .send({ testo, autoreId })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, "Commento pubblicato con successo");
                    assert.strictEqual(res.body.commento.testo, testo);
                    assert.strictEqual(res.body.commento.autore.toString(), autoreId.toString());
                    done();
                });
        });
    });

    describe("GET /commenti/libro/:libroId", () => {
        it("dovrebbe restituire tutti i commenti di un libro", (done) => {
            request(app)
                .get(`/commenti/libro/${libro._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(Array.isArray(res.body), true);
                    done();
                });
        });
    });

    describe("GET /commenti/user/:autoreId", () => {
        it("dovrebbe restituire i commenti di un autore", (done) => {
            request(app)
                .get(`/commenti/user/${utente._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(Array.isArray(res.body), true);
                    done();
                });
        });
    });

    describe("DELETE /commenti/:commentoId", () => {
        it("dovrebbe cancellare un commento", (done) => {
            request(app)
                .delete(`/commenti/${commento._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, "Commento cancellato con successo");
                    done();
                });
        });
    });

});
