const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const Recensione = require("../models/Recensione");
const { setupData, testBefore, testAfter } = require("./utils")

describe("Test API Recensioni", () => {

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


  describe("POST /recensioni", () => {
    it("dovrebbe creare una nuova recensione", async () => {
      const recensioneData = {
        titolo: "Titolo recensione",
        contenuto: "Contenuto recensione",
        voto: 5,
        autore: utente._id,
        libro: libro._id,
      };

      const response = await request(app)
        .post("/recensioni")
        .send(recensioneData)
        .expect(201);

      recensioneId = response.body.id;

      // Assert or further test the nuovaRecensioneId value as needed
    });
  });

  describe("GET /recensioni", () => {
    it("dovrebbe ottenere tutte le recensioni", (done) => {
      request(app)
        .get("/recensioni")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          const recensioni = res.body;

          // Assert sulla risposta
          assert.ok(Array.isArray(recensioni));

          done();
        });
    });
  });

  describe("GET /recensioni/user/:utenteId", () => {
    it("dovrebbe ottenere tutte le recensioni di un dato utente", (done) => {
      request(app)
        .get(`/recensioni/user/${utente._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          const recensioni = res.body;

          // Assert sulla risposta
          assert.ok(Array.isArray(recensioni));

          done();
        });
    });
  });

  describe("GET /recensioni/libro/:libroId", () => {
    it("dovrebbe ottenere tutte le recensioni di un dato libro", (done) => {
      request(app)
        .get(`/recensioni/libro/${libro._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          const recensioni = res.body;

          // Assert sulla risposta
          assert.ok(Array.isArray(recensioni));

          done();
        });
    });
  });

  describe("DELETE /recensioni/:recensioneId", () => {
    it("dovrebbe eliminare una recensione dato l'ID", (done) => {
      request(app)
        .delete(`/recensioni/${recensioneId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          const response = res.body;

          // Assert sulla risposta
          assert.strictEqual(
            response.message,
            "Recensione cancellata con successo"
          );

          // Verifica che la recensione sia stata eliminata dal database
          Recensione.find({ _id: recensioneId })
            .then((recensioni) => {
              assert.strictEqual(recensioni.length, 0);
              done();
            })
            .catch((err) => done(err));
        });
    });
  });
});