const request = require("supertest");
const assert = require("assert");
const app = require("../index");
const Recensione = require("../models/Recensione");
const { log } = require("console");

let recensioneId;
const libroId = "648ef795b3764e6f34bc299f";
const utenteId = "648ef7acb3764e6f34bc29b0";

describe("POST /recensioni", () => {
  it("should create a new recensione and return its ID", async () => {
    const recensioneData = {
      titolo: "Titolo recensione",
      contenuto: "Contenuto recensione",
      voto: 5,
      autore: utenteId,
      libro: libroId,
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
  it("should return all reviews", (done) => {
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
  it("should return all reviews by a specific user", (done) => {
    // const utenteId = "648ef7acb3764e6f34bc29b0";

    request(app)
      .get(`/recensioni/user/${utenteId}`)
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
  it("should return all reviews for a specific book", (done) => {
    // const libroId = "648ef795b3764e6f34bc299f";

    request(app)
      .get(`/recensioni/libro/${libroId}`)
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
  it("should delete a review", (done) => {
    // const recensioneId = recensioneID;

    request(app)
      .get(`/recensioni/user/${utenteId}`)
      .end((err, res) => {
        recensioneId = res.body[0]._id;
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
                // console.log(recensioni);
                assert.strictEqual(recensioni.length, 0);
                done();
              })
              .catch((err) => done(err));
          });
      });
  });
});

// Aggiungi altri test per gli altri metodi di /recensioni
