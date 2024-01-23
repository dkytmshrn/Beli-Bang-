const request = require("supertest")
const app = require("../app")
const { User, Store, sequelize } = require("../models")
const { signToken } = require("../helpers/jwt")

let validSellerToken, validCustomerToken, invalidToken, storeId1, storeId2

const dataSeller1 = {
  username: "Seller1",
  email: "seller1@mail.com",
  password: "seller1",
  role: "Seller",
  phoneNumber: "12345",
  address: "Adress",
  profilePicture: "Image"
}

const dataSeller2 = {
  username: "Seller2",
  email: "seller2@mail.com",
  password: "seller2",
  role: "Seller",
  phoneNumber: "12345",
  address: "Adress",
  profilePicture: "Image"
}

const dataCustomer = {
  username: "Customer",
  email: "customer@mail.com",
  password: "customer",
  role: "Customer",
  phoneNumber: "12345",
  address: "Adress",
  profilePicture: "Image"
}

const dataStore = {
  name: "Store",
  status: true,
  description: "Description",
  imageUrl: "Image"
}

beforeAll((done) => {
  User.create(dataSeller1)
    .then((seller1) => {
      validSellerToken = signToken({ id: seller1.id, email: seller1.email })
      dataStore.UserId = seller1.id
      return Store.create(dataStore)
    })
    .then((store1) => {
      storeId1 = store1.id
      return User.create(dataSeller2)
    })
    .then((seller2) => {
      dataStore.UserId = seller2.id
      return Store.create(dataStore)
    })
    .then((store2) => {
      storeId2 = store2.id
      return User.create(dataCustomer)
    })
    .then((customer) => {
      validCustomerToken = signToken({ id: customer.id, email: customer.email })
      invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfE"
      done()
    })
    .catch((err) => {
      done(err)
    })
})

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Likes", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  })
  await sequelize.queryInterface.bulkDelete("Stores", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  })
  await sequelize.queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  })
})

// CREATE LIKE
describe("POST /likes/:storeId", () => {
  test("201 success create new Like", (done) => {
    request(app)
      .post(`/likes/${storeId1}`)
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(201)
        expect(body).toHaveProperty("message", "Success adding like")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  
  test("401 create Like with duplicate User ID", (done) => {
    request(app)
      .post(`/likes/${storeId1}`)
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Like already added")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 create Order with invalid token", (done) => {
    request(app)
      .post(`/likes/${storeId1}`)
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  
  test("401 create Order without token", (done) => {
    request(app)
      .post(`/likes/${storeId1}`)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// SHOW STORES LIKES
describe("GET /likes/:storeId", () => {
  test("200 success get all Likes", (done) => {
    request(app)
      .get(`/likes/${storeId1}`)
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toBeInstanceOf(Array)
        expect(body.length).toBeGreaterThan(0)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 find Likes with invalid token", (done) => {
    request(app)
      .get(`/likes/${storeId1}`)
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  
  test("401 find Likes without token", (done) => {
    request(app)
      .get(`/likes/${storeId1}`)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 find Likes of a Store not in database", (done) => {
    request(app)
      .get("/likes/99")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response
 
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Store not found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  
  test("404 find no Likes", (done) => {
    request(app)
      .get(`/likes/${storeId2}`)
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response
 
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Haven't got any like yet")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// DELETE LIKE BY ID
describe("DELETE /likes/:id", () => {
  test("401 delete Like with invalid token", (done) => {
    request(app)
      .delete(`/likes/${storeId1}`)
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  
  test("401 delete Like without token", (done) => {
    request(app)
      .delete(`/likes/${storeId1}`)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("403 delete Like with incorrect User ID", (done) => {
    request(app)
      .delete("/likes/1")
      .set("access_token", validSellerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(403);
        expect(body).toHaveProperty("message", "Not authorized")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 delete Like not in Database", (done) => {
    request(app)
      .delete("/likes/99")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Likes data not found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("200 success DELETE Like by ID", (done) => {
    request(app)
      .delete("/likes/1")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Like has been removed")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})