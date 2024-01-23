const request = require("supertest")
const app = require("../app")
const { User, sequelize } = require("../models")
const { signToken } = require("../helpers/jwt")
const ImageKit = require("imagekit")

jest.mock("imagekit")

let validSellerToken, validCustomerToken, invalidToken, sellerId

const dataSeller = {
  username: "Seller",
  email: "seller@mail.com",
  password: "seller",
  role: "Seller",
  phoneNumber: "12345",
  address: "Adress",
  profilePicture: "test.jpg"
}

const dataCustomer = {
  username: "Customer",
  email: "customer@mail.com",
  password: "customer",
  role: "Customer",
  phoneNumber: "12345",
  address: "Adress",
  profilePicture: "test.jpg"
}

describe("When imagekit throws error", () => {
  beforeAll(() => {
    ImageKit.mockImplementation(() => {
      return {
        upload: () => {
          console.log("upload");
          return new Promise(resolve => {
            resolve({ 
              url: "test.jpg"
            })
          })
        }
      }
    })
  })


  beforeAll((done) => {
    User.create(dataSeller)
      .then((seller) => {
        validSellerToken = signToken({ id: seller.id, email: seller.email })
        sellerId = seller.id
        invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfE"
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    })
  })

  // REGISTER USER
  describe("POST /register", () => {
    test("201 success registering new User", (done) => {
      request(app)
        .post("/register")
        .send(dataCustomer)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(201)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty("access_token", expect.any(String))
          expect(body).toHaveProperty("role", expect.any(String))
          expect(body).toHaveProperty("id", expect.any(Number))
          validCustomerToken = body.access_token
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 register User without username", (done) => {
      request(app)
        .post("/register")
        .send({
          email: dataCustomer.email,
          password: dataCustomer.password,
          role: dataCustomer.role,
          phoneNumber: dataCustomer.phoneNumber,
          address: dataCustomer.address
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Username is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 register User without email", (done) => {
      request(app)
        .post("/register")
        .send({
          username: dataCustomer.username,
          password: dataCustomer.password,
          role: dataCustomer.role,
          phoneNumber: dataCustomer.phoneNumber,
          address: dataCustomer.address
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Email is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 register User with wrong email format", (done) => {
      request(app)
        .post("/register")
        .send({
          username: dataCustomer.username,
          email: 'wrong',
          password: dataCustomer.password,
          role: dataCustomer.role,
          phoneNumber: dataCustomer.phoneNumber,
          address: dataCustomer.address
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Invalid email format")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 register User with duplicate email", (done) => {
      request(app)
        .post("/register")
        .send({
          username: dataCustomer.username,
          email: dataSeller.email,
          password: dataCustomer.password,
          role: dataCustomer.role,
          phoneNumber: dataCustomer.phoneNumber,
          address: dataCustomer.address
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Email must be unique")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 register User without password", (done) => {
      request(app)
        .post("/register")
        .send({
          username: dataCustomer.username,
          email: dataCustomer.email,
          role: dataCustomer.role,
          phoneNumber: dataCustomer.phoneNumber,
          address: dataCustomer.address
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Password is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 register User with incorrect password length", (done) => {
      request(app)
        .post("/register")
        .send({
          username: dataCustomer.username,
          password: 1234,
          email: dataCustomer.email,
          role: dataCustomer.role,
          phoneNumber: dataCustomer.phoneNumber,
          address: dataCustomer.address
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Minimum password is 5 characters")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 register User without role", (done) => {
      request(app)
        .post("/register")
        .send({
          username: dataCustomer.username,
          email: dataCustomer.email,
          password: dataCustomer.password,
          phoneNumber: dataCustomer.phoneNumber,
          address: dataCustomer.address
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Role is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 register User without phone number", (done) => {
      request(app)
        .post("/register")
        .send({
          username: dataCustomer.username,
          email: dataCustomer.email,
          password: dataCustomer.password,
          role: dataCustomer.role,
          address: dataCustomer.address
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Phone Number is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 register User without address", (done) => {
      request(app)
        .post("/register")
        .send({
          username: dataCustomer.username,
          email: dataCustomer.email,
          password: dataCustomer.password,
          role: dataCustomer.role,
          phoneNumber: dataCustomer.phoneNumber
        })
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Address is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // LOGIN USER
  describe("POST /login", () => {
    test("200 success login User", (done) => {
      request(app)
        .post("/login")
        .send({
          email: dataCustomer.email,
          password: dataCustomer.password
        })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty("access_token", expect.any(String))
          expect(body).toHaveProperty("username", expect.any(String))
          expect(body).toHaveProperty("role", expect.any(String))
          expect(body).toHaveProperty("id", expect.any(Number))
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 login User without email", (done) => {
      request(app)
        .post("/login")
        .send({
          password: dataCustomer.password,
        })
        .then((response) => {
          const { body, status } = response
    
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Email is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 login User without password", (done) => {
      request(app)
        .post("/login")
        .send({
          email: dataCustomer.email
        })
        .then((response) => {
          const { body, status } = response
    
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Password is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 login User with incorrect email", (done) => {
      request(app)
        .post("/login")
        .send({
          email: "wrong@mail.com",
          password: dataCustomer.password
        })
        .then((response) => {
          const { body, status } = response
    
          expect(status).toBe(401)
          expect(body).toHaveProperty("message", "Invalid email/password")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 login User with incorrect password", (done) => {
      request(app)
        .post("/login")
        .send({
          email: dataCustomer.email,
          password: "wrongpassword"
        })
        .then((response) => {
          const { body, status } = response
    
          expect(status).toBe(401)
          expect(body).toHaveProperty("message", "Invalid email/password")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // FIND USER BY ID
  describe("GET /users/:id", () => {
    test("200 success fetching User by ID", (done) => {
      request(app)
        .get(`/users/${sellerId}`)
        .set("access_token", validSellerToken)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toBeInstanceOf(Object)
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("401 fetching User with invalid token", (done) => {
      request(app)
        .get(`/users/${sellerId}`)
        .set("access_token", invalidToken)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(401)
          expect(body).toHaveProperty("message", "Invalid token")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 fetching User without token", (done) => {
      request(app)
        .get(`/users/${sellerId}`)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(401)
          expect(body).toHaveProperty("message", "Invalid token")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("404 fetching User not in Database", (done) => {
      request(app)
        .get("/users/99")
        .set("access_token", validSellerToken)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(404)
          expect(body).toHaveProperty("message", "User Not Found")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // UPDATE USERNAME
  describe("PATCH /users/username", () => {
    test("400 update User without username", (done) => {
      request(app)
        .patch("/users/username")
        .set("access_token", validCustomerToken)
        .send({ username: "" })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Username is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 update Username with invalid token", (done) => {
      request(app)
        .patch("/users/username")
        .set("access_token", invalidToken)
        .send({ username: "New username" })
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
    
    test("401 update Username without token", (done) => {
      request(app)
        .patch("/users/username")
        .send({ username: 'New username' })
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

    test("200 success update Username", (done) => {
      request(app)
        .patch("/users/username")
        .set("access_token", validCustomerToken)
        .send({ username: 'New username' })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Success Edit Username");
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // UPDATE PASSWORD
  describe("PATCH /users/password", () => {
    test("400 update User without old password", (done) => {
      request(app)
        .patch("/users/password")
        .set("access_token", validCustomerToken)
        .send({ 
          newPassword: "newcustomer",
          confirmPassword : "newcustomer"
        })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 update User without new password", (done) => {
      request(app)
        .patch("/users/password")
        .set("access_token", validCustomerToken)
        .send({
          oldPassword: "customer",
          newPassword: "",
          confirmPassword : ""
        })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 update User with new password under 5 characters", (done) => {
      request(app)
        .patch("/users/password")
        .set("access_token", validCustomerToken)
        .send({
          oldPassword: "customer",
          newPassword: "new",
          confirmPassword : "new"
        })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Minimum password is 5 characters")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 update User without matching new password", (done) => {
      request(app)
        .patch("/users/password")
        .set("access_token", validCustomerToken)
        .send({
          oldPassword: "customer",
          newPassword: "newcustomer",
          confirmPassword : "customer"
        })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password does not match")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("401 update User with incorrect old password", (done) => {
      request(app)
        .patch("/users/password")
        .set("access_token", validCustomerToken)
        .send({
          oldPassword: "wrong",
          newPassword: "newcustomer",
          confirmPassword : "newcustomer"
        })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid password")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("401 update User with same new password", (done) => {
      request(app)
        .patch("/users/password")
        .set("access_token", validCustomerToken)
        .send({
          oldPassword: "customer",
          newPassword: "customer",
          confirmPassword : "customer"
        })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Cannot use the old password")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 update Username with invalid token", (done) => {
      request(app)
        .patch("/users/password")
        .set("access_token", invalidToken)
        .send({ 
          oldPassword: "customer",
          newPassword: "newcustomer",
          confirmPassword : "newcustomer"
        })
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
    
    test("401 update Username without token", (done) => {
      request(app)
        .patch("/users/password")
        .send({ 
          oldPassword: "customer",
          newPassword: "newcustomer",
          confirmPassword : "newcustomer"
        })
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

    test("200 success update User password", (done) => {
      request(app)
        .patch("/users/password")
        .set("access_token", validCustomerToken)
        .send({ 
          oldPassword: "customer",
          newPassword: "newcustomer",
          confirmPassword : "newcustomer"
        })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Success Edit Password");
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // UPDATE PHONE NUMBER
  describe("PATCH /users/phonenumber", () => {
    test("400 update User without phone number", (done) => {
      request(app)
        .patch("/users/phonenumber")
        .set("access_token", validCustomerToken)
        .send({ phoneNumber: "" })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Phone Number is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 update User phone with invalid token", (done) => {
      request(app)
        .patch("/users/phonenumber")
        .set("access_token", invalidToken)
        .send({ phoneNumber: "1234" })
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
    
    test("401 update User phone without token", (done) => {
      request(app)
        .patch("/users/phonenumber")
        .send({ phoneNumber: "1234" })
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

    test("200 success update User phone number", (done) => {
      request(app)
        .patch("/users/phonenumber")
        .set("access_token", validCustomerToken)
        .send({ phoneNumber: "1234" })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Success Edit Phone Number");
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // UPDATE ADDRESS
  describe("PATCH /users/address", () => {
    test("400 update User without address", (done) => {
      request(app)
        .patch("/users/address")
        .set("access_token", validCustomerToken)
        .send({ address: "" })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Address is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 update User address with invalid token", (done) => {
      request(app)
        .patch("/users/address")
        .set("access_token", invalidToken)
        .send({ address: "New address" })
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
    
    test("401 update User address without token", (done) => {
      request(app)
        .patch("/users/address")
        .send({ address: "New address" })
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

    test("200 success update User address", (done) => {
      request(app)
        .patch("/users/address")
        .set("access_token", validCustomerToken)
        .send({ address: "New address" })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Success Edit Address");
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // UPDATE PROFILE PICTURE
  describe("PATCH /users/profilepicture", () => {
    test("400 update User without profile picture", (done) => {
      request(app)
        .patch("/users/profilepicture")
        .set("access_token", validSellerToken)
        .attach("profilePicture", "")
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Image must be provided")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 update User profile picture with invalid token", (done) => {
      request(app)
        .patch("/users/profilepicture")
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
    
    test("401 update User profile picture without token", (done) => {
      request(app)
        .patch("/users/profilepicture")
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

    test("200 success update User profile picture", (done) => {
      request(app)
        .patch("/users/profilepicture")
        .set("access_token", validSellerToken)
        .attach("profilePicture", "test/test.jpg")
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Success Edit Profile Picture");
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // UPDATE LOCATION
  describe("PATCH /users/location", () => {
    test("400 update User location without longitude", (done) => {
      request(app)
        .patch("/users/location")
        .set("access_token", validCustomerToken)
        .send({ latitude: "-6" })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Location is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 update User location without latitude", (done) => {
      request(app)
        .patch("/users/location")
        .set("access_token", validCustomerToken)
        .send({ longitude: "107" })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Location is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 update User location with invalid token", (done) => {
      request(app)
        .patch("/users/location")
        .set("access_token", invalidToken)
        .send({ longitude: "107", latitude: "-6" })
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
    
    test("401 update User location without token", (done) => {
      request(app)
        .patch("/users/location")
        .send({ longitude: "107", latitude: "-6" })
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

    test("200 success update User location", (done) => {
      request(app)
        .patch("/users/location")
        .set("access_token", validCustomerToken)
        .send({ longitude: "107", latitude: "-6" })
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Success Edit Location");
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })
})