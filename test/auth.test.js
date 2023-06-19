const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const { setupData, testBefore, testAfter } = require("./utils")
const { generateToken } = require("../middleware/auth");

describe("Test API Auth", () => {
    let utente;
    let clearPassword

    before(async () => {
        await testBefore().then(async () => {
            const setupDataResponse = await setupData();
            utente = setupDataResponse.utente;
            clearPassword = setupDataResponse.clearPassword;
        })
    });

    after(async () => {
        await testAfter()
    });

    describe("POST /auth/login", () => {
        it("dovrebbe autenticare l'utente e restituire il token di autenticazione", (done) => {
            request(app)
                .post("/auth/login")
                .send({ email: utente.email, password: clearPassword })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.ok(typeof res.body.token !== 'undefined', 'Il valore non è definito');
                    assert.strictEqual(res.body.userId, utente._id.toString());
                    done();
                });

        });

        it("dovrebbe restituire un errore 404 se l'utente non esiste", (done) => {
            request(app)
                .post("/auth/login")
                .send({ email: "utente@nonesiste.com", password: "PasswordErrata" })
                .expect(404)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, "Utente non trovato");
                    done();
                });
        });

        it("dovrebbe restituire un errore 401 se la password non è valida", (done) => {
            request(app)
                .post("/auth/login")
                .send({ email: utente.email, password: "PasswordErrata" })
                .expect(401)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, "Password non valida");
                    done();
                });
        });
    });

    describe("POST /logout", () => {
        it("dovrebbe invalidare il token e restituire un messaggio di logout", (done) => {
            const token = generateToken(utente._id.toString());
            request(app)
                .post("/auth/logout")
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, "Logout effettuato con successo");
                    done();
                });

        });
    });



});
