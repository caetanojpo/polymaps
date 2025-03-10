db = db.getSiblingDB('oz_test');

const adminUserId = ObjectId().toString();
const user1Id = ObjectId().toString();
const user2Id = ObjectId().toString();

db.users.insertMany([
  {
    _id: adminUserId,
    name: "Admin User",
    email: "admin@admin.com",
    hashedPassword: "$2a$10$j46pq/HLnry20u/0cQ9MVeqsUhqx67Taj8ueJSwTUlaLTUB8wJtpC", //Hashed: AdminPass123!
    coordinates: {
      latitude: 37.774929,
      longitude: -122.419418
    },
    isActive: true
  },
  {
    _id: user1Id,
    name: "Test User 1",
    email: "test@test.com",
    hashedPassword: "$2a$10$uzwsU0Co5b2udr6VraRdf./zPK8r5SDEUzeqWSMGxjbauM7Qly3m2", //Hashed: Test126!
    coordinates: {
      latitude: 40.712776,
      longitude: -74.005974
    },
    isActive: true
  },
  {
    _id: user2Id,
    name: "Test User 2",
    email: "test2@test.com",
    hashedPassword: "$2a$10$DUWguwD0nYoH0ioRLYRlseIHwcVU2Jx4OdwhvTINqXaQMzRHkAl0K", //Hashed:Test126!
    coordinates: {
      latitude: 34.052235,
      longitude: -118.243683
    },
    isActive: true
  }
]);

const region1Id = ObjectId().toString();
const region2Id = ObjectId().toString();
const region3Id = ObjectId().toString();
const region4Id = ObjectId().toString();
const region5Id = ObjectId().toString();
const region6Id = ObjectId().toString();

db.regions.insertMany([
  {
    _id: region1Id,
    name: "Central Park",
    location: {
      type: "Polygon",
      coordinates: [
        [
          [-73.965355, 40.782865],
          [-73.965760, 40.783118],
          [-73.965370, 40.783375],
          [-73.965355, 40.782865]
        ]
      ]
    },
    owner: adminUserId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: region2Id,
    name: "Golden Gate Park",
    location: {
      type: "Polygon",
      coordinates: [
        [
          [-122.486219, 37.769042],
          [-122.485725, 37.769530],
          [-122.485520, 37.769109],
          [-122.486219, 37.769042]
        ]
      ]
    },
    owner: user1Id,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: region3Id,
    name: "Yosemite National Park",
    location: {
      type: "Polygon",
      coordinates: [
        [
          [-119.538329, 37.865101],
          [-122.485725, 37.769530],
          [-119.537704, 37.865023],
          [-119.538329, 37.865101]
        ]
      ]
    },
    owner: user2Id,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: region4Id,
    name: "Lake Tahoe",
    location: {
      type: "Polygon",
      coordinates: [
        [
          [-120.032351, 39.096843],
          [-122.485725, 37.769530],
          [-120.031872, 39.097128],
          [-120.032351, 39.096843]
        ]
      ]
    },
    owner: adminUserId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: region5Id,
    name: "Mount Shasta",
    location: {
      type: "Polygon",
      coordinates: [
        [
          [-122.314376, 41.409903],
          [-122.314870, 41.410124],
          [-122.314363, 41.410456],
          [-122.314376, 41.409903]
        ]
      ]
    },
    owner: user1Id,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: region6Id,
    name: "Redwood National Park",
    location: {
      type: "Polygon",
      coordinates: [
        [
          [-124.005558, 41.213181],
          [-124.005180, 41.213450],
          [-124.004751, 41.213129],
          [-124.005558, 41.213181]
        ]
      ]
    },
    owner: user2Id,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
