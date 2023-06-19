const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const Utente = require("../models/Utente").Utente
const { setupData, testBefore, testAfter } = require("./utils")

describe("Test API Follow", () => {

    let utente1;
    let utente2;

    before(async () => {
        await testBefore().then(async () => {
            const setupDataResponse = await setupData();
            utente1 = setupDataResponse.utente;
            utente2 = setupDataResponse.utenteSeguito;
        })
    });

    after(async () => {
        await testAfter()
    });

    describe("POST /follow/:userId", () => {
        it("dovrebbe aggiungere un utente alla lista degli utenti seguiti", (done) => {
            request(app)
                .post(`/follow/${utente1._id}`)
                .send({ utenteSeguitoId: utente2._id })
                .expect(200)
                .end(async (err, res) => {
                    if (err) return done(err);

                    // Verifica che l'utente 2 sia presente nella lista degli utenti seguiti dell'utente 1
                    const updatedUtente1 = await Utente.findById(utente1._id);
                    assert(updatedUtente1.follow.includes(utente2._id));

                    done();
                });
        });
    });

    describe("GET /follow/:userId/preferiti", () => {
        it("dovrebbe ottenere la lista dei preferiti di un utente", (done) => {
            request(app)
                .get(`/follow/${utente1._id}/preferiti`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    // Verifica che la risposta contenga la lista dei preferiti dell'utente
                    assert(Array.isArray(res.body.preferiti));

                    done();
                });
        });
    });

    describe("DELETE /follow/:userId", () => {
        it("dovrebbe rimuovere un utente dalla lista degli utenti seguiti", (done) => {
            request(app)
                .delete(`/follow/${utente1._id}`)
                .send({ utenteSeguitoId: utente2._id })
                .expect(200)
                .end(async (err, res) => {
                    if (err) return done(err);

                    // Verifica che l'utente 2 non sia più presente nella lista degli utenti seguiti dell'utente 1
                    const updatedUtente1 = await Utente.findById(utente1._id);
                    assert(!updatedUtente1.follow.includes(utente2._id));

                    done();
                });
        });
    });
});