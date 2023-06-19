const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const Utente = require("../models/Utente").Utente
const { setupData, testBefore, testAfter } = require("./utils")
const bcrypt = require("bcrypt");

describe("Test API User", () => {

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


    describe("GET /user", () => {
        it("dovrebbe ottenere tutti gli utenti", (done) => {
            request(app)
                .get("/user")
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(Array.isArray(res.body), true);
                    done();
                });
        });
    })

    describe("GET /user/:userId", () => {
        it("dovrebbe ottenere un utente specifico", (done) => {
            request(app)
                .get(`/user/${utente._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body._id, utente._id.toString());
                    done();
                });
        });
    });

    describe("POST /user", () => {
        it("Dovrebbe creare un nuovo utente con successo", (done) => {
            const nuovoUtente = {
                name: "Nuovo Utente",
                email: "nuovo@example.com",
                password: "password123",
            };

            request(app)
                .post("/user")
                .send(nuovoUtente)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    // Verifica che il messaggio di risposta sia corretto
                    assert.strictEqual(
                        res.body.message,
                        "Nuovo utente creato con successo"
                    );

                    // Verifica che il nuovo utente sia stato salvato nel database
                    const utenteCreato = Utente.findOne({ email: nuovoUtente.email });
                    assert.ok(utenteCreato);

                    // Verifica che la password sia stata correttamente cifrata
                    const passwordMatch = bcrypt.compare(
                        nuovoUtente.password,
                        utenteCreato.password
                    );
                    assert.ok(passwordMatch);

                    done();
                });
        });
    });

    describe("DELETE /user/:userId", () => {
        it("Dovrebbe cancellare correttamente l'utente", (done) => {
            request(app)
                .delete(`/user/${utente._id}`)
                .send({
                    loggedUserId: utente._id.toString(),
                })
                .expect(200)
                .end(async (err, res) => {
                    if (err) return done(err);

                    // Verifica che il messaggio di risposta sia corretto
                    assert.strictEqual(
                        res.body.message,
                        "Utente cancellato con successo"
                    );

                    // Verifica che l'utente sia stato correttamente rimosso dal database
                    const utenteCancellato = await Utente.findById(utente._id);
                    assert.strictEqual(utenteCancellato, null);

                    done();
                });
        })

    });
})