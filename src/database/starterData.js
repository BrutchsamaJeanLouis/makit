const Fund = require("./models/fund").default;
const User = require("./models/user").default;
const Rating = require("./models/rating").default;
const Location = require("./models/location").default;
const Media = require("./models/media").default;
const Project = require("./models/project").default;

const seedDB = async sequalizeInstance => {
  const users = await User.findAll();
  // if no user dont already exist
  if (users.length < 5) {
    console.log("\n Bulk insert users-------------------------------------------------------");
    await User.bulkCreate([
      {
        username: "user1",
        password: "$2b$10$cqpR.FhqULDRtHEA0NHmq.PDcKP2YpslHtDV9hEjp5/cc8dwTu1Fa",
        email: "mail1@mail.com",
        company: "corp",
        salt: 10
      },
      {
        username: "user2",
        password: "$2b$10$cqpR.FhqULDRtHEA0NHmq.PDcKP2YpslHtDV9hEjp5/cc8dwTu1Fa",
        email: "mail2@mail.com",
        company: "corp",
        salt: 10
      },
      {
        username: "user3",
        password: "$2b$10$cqpR.FhqULDRtHEA0NHmq.PDcKP2YpslHtDV9hEjp5/cc8dwTu1Fa",
        email: "mail3@mail.com",
        company: "corp",
        salt: 10
      },
      {
        username: "user4",
        password: "$2b$10$cqpR.FhqULDRtHEA0NHmq.PDcKP2YpslHtDV9hEjp5/cc8dwTu1Fa",
        email: "mail4@mail.com",
        company: "corp",
        salt: 10
      },
      {
        username: "user5",
        password: "$2b$10$cqpR.FhqULDRtHEA0NHmq.PDcKP2YpslHtDV9hEjp5/cc8dwTu1Fa",
        email: "mail5@mail.com",
        company: "corp",
        salt: 10
      }
    // @ts-ignore
    ]).then(console.log("\n DONE bulk insert users-------------------------------------------------------"));
  }

  const projects = await Project.findAll();
  if (projects.length < 10) {
    console.log("\n Bulk insert projects-----------------------------------------------------------------");
    await Project.bulkCreate([
      { name: "project1", description: " this is the 1 created project", userID: 1 },
      { name: "project2", description: " this is the 2 created project", userID: 2 },
      { name: "project3", description: " this is the 3 created project", userID: 2 },
      { name: "project4", description: " this is the 4 created project", userID: 3 },
      { name: "project5", description: " this is the 5 created project", userID: 3 },
      { name: "project6", description: " this is the 6 created project", userID: 1 },
      { name: "project7", description: " this is the 7 created project", userID: 1 },
      { name: "project8", description: " this is the 8 created project", userID: 1 },
      { name: "project9", description: " this is the 9 created project", userID: 2 },
      { name: "project10", description: " this is the 10 created project", userID: 1 }
      // @ts-ignore
    ]).then(console.log("\n DONE bulk insert projects----------------------------------------------------------"));
  }

  // const like1 = Like.build({
  //   userID: 2,
  //   projectID: 1
  // })
  // const like2 = Like.build({
  //   userID: 3,
  //   projectID: 1
  // })
  // const like3 = Like.build({
  //   userID: 3,
  //   projectID: 2
  // })
  // const like4 = Like.build({
  //   userID: 3,
  //   projectID: 3
  // })
  // const like5 = Like.build({
  //   userID: 3,
  //   projectID: 4
  // })
  // Like.findAll().then((likeResponce) => {
  //   // no unique way to identify like check if more than 5 exist
  //   if (likeResponce.length < 5) {
  //     like1.save()
  //     like2.save()
  //     like3.save()
  //     like4.save()
  //     like5.save()
  //   }
  // })

  // const fund1 = Fund.build({
  //   amount: 20000,
  //   userID: 1,
  //   projectID: 1
  // })
  // const fund2 = Fund.build({
  //   amount: 100,
  //   userID: 1,
  //   projectID: 2
  // })
  // const fund3 = Fund.build({
  //   amount: 700000,
  //   userID: 2,
  //   projectID: 7
  // })
  // const fund4 = Fund.build({
  //   amount: 50000,
  //   userID: 2,
  //   projectID: 3
  // })
  // Fund.findAll().then((fundResponce) => {
  //   // no unique way to identify like check if more than 5 exist
  //   if (fundResponce.length < 4) {
  //     fund1.save()
  //     fund2.save()
  //     fund3.save()
  //     fund4.save()
  //   }
  // })

  // const location1 = Location.build({
  //   projectID: 1,
  //   address: '71 Street',
  //   city: 'Manchester',
  //   postcode: 'M1 6WH',
  //   country: 'United Kingdom'
  // })
  // const location2 = Location.build({
  //   projectID: 2,
  //   address: '72 Street',
  //   city: 'Manchester',
  //   postcode: 'M1 6WH',
  //   country: 'United Kingdom'
  // })
  // const location3 = Location.build({
  //   projectID: 3,
  //   address: '73 Street',
  //   city: 'Miami',
  //   postcode: 'M1 6WH',
  //   country: 'United States'
  // })
  // Location.findAll().then((locationResponce) => {
  //   // no unique way to identify like check if more than 5 exist
  //   if (locationResponce.length < 3) {
  //     location1.save()
  //     location2.save()
  //     location3.save()
  //   }
  // })

  // const media1 = Media.build({
  //   projectID: 1,
  //   mediaType: 'image',
  //   mediaUrl: 'https://picsum.photos/200/300'
  // })
  // const media2 = Media.build({
  //   projectID: 1,
  //   mediaType: 'image',
  //   mediaUrl: 'https://picsum.photos/500/300'
  // })
  // const media3 = Media.build({
  //   projectID: 1,
  //   mediaType: 'image',
  //   mediaUrl: 'https://picsum.photos/300/300'
  // })
  // const media4 = Media.build({
  //   projectID: 3,
  //   mediaType: 'image',
  //   mediaUrl: 'https://picsum.photos/200/300'
  // })
  // const media5 = Media.build({
  //   projectID: 4,
  //   mediaType: 'image',
  //   mediaUrl: 'https://picsum.photos/200/300'
  // })
  // Media.findAll().then((mediaResponce) => {
  //   // no unique way to identify like check if more than 5 exist
  //   if (mediaResponce.length < 5) {
  //     media1.save()
  //     media2.save()
  //     media3.save()
  //     media4.save()
  //     media5.save()
  //   }
  // })
};

module.exports = seedDB;
