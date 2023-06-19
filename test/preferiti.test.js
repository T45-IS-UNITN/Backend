const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const { setupData, testBefore, testAfter } = require("./utils")

describe("Test API Libri Preferiti", () => {
    let utente;
    let libro;
    before(async () => {
        await testBefore().then(async () => {
            const setupDataResponse = await setupData();
            utente = setupDataResponse.utente;
            libro = setupDataResponse.libro1;
        })
    });

    after(async () => {
        await testAfter()
    });


    describe("POST /preferiti", () => {
        it("dovrebbe aggiungere un libro alla lista dei preferiti di un utente", (done) => {
            request(app)
                .post("/preferiti")
                .send({
                    userId: utente._id,
                    libroId: libro._id,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, "Libro aggiunto alla lista dei preferiti");
                    done();
                });
        });
    })

    describe("GET /preferiti/user/:utenteId", () => {
        it("dovrebbe ottenere la lista dei libri preferiti di un utente", (done) => {
            request(app)
                .get(`/preferiti/user/${utente._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(Array.isArray(res.body.preferiti), true);
                    done();
                });
        });
    })

    describe("DELETE /preferiti", () => {
        it("dovrebbe rimuovere un libro dalla lista dei preferiti di un utente", (done) => {
            request(app)
                .delete("/preferiti")
                .send({
                    userId: utente._id,
                    libroId: libro._id,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(
                        res.body.message,
                        "Libro rimosso dalla lista dei preferiti"
                    );
                    done();
                });
        });
    })
})