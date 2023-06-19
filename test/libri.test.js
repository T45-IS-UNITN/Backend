const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const { setupData, testBefore, testAfter } = require("./utils")

describe("Test API Libri", () => {

    let utente;
    let commento;
    let libro;
    let recensioneId;

    before(async () => {
        await testBefore().then(async () => {
            const setupDataResponse = await setupData();
            utente = setupDataResponse.utente;
            commento = setupDataResponse.commento1;
            libro = setupDataResponse.libro1;
        })
    });

    after(async () => {
        await testAfter()
    });


    describe("POST /libri", () => {
        it("dovrebbe creare un nuovo libro", (done) => {
            request(app)
                .post("/libri")
                .send({
                    titolo: "Titolo libro",
                    autore: "Autore libro",
                    annoPubblicazione: 2022,
                    generi: ["Fantasy", "Avventura"],
                })
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.titolo, "Titolo libro");
                    assert.strictEqual(res.body.autore, "Autore libro");
                    assert.strictEqual(res.body.annoPubblicazione, 2022);
                    assert.deepStrictEqual(res.body.generi, ["Fantasy", "Avventura"]);
                    libroId = res.body._id;
                    done();
                });
        });
    });

    describe("GET /libri", () => {
        it("dovrebbe ottenere tutti i libri", (done) => {
            request(app)
                .get("/libri")
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(Array.isArray(res.body), true);
                    done();
                });
        });
    })

    describe("GET /libri/:libroId", () => {
        it("dovrebbe ottenere un libro specifico", (done) => {
            request(app)
                .get(`/libri/${libroId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body._id, libroId);
                    done();
                });
        });
    });

    describe("DELETE /libro/:libroId", () => {
        it("dovrebbe cancellare un libro specifico", (done) => {
            request(app)
                .delete(`/libri/${libroId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, "Libro cancellato con successo");
                    done();
                });
        });
    });

});