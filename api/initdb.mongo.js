db = db.getSiblingDB('oz_test');

const adminUserId = ObjectId().toString();
const user1Id = ObjectId().toString();
const user2Id = ObjectId().toString();

db.users.insertMany([
    {
        _id: adminUserId,
        name: "Oz Map",
        email: "oz@ozmap.com",
        hashedPassword: "$2a$10$j46pq/HLnry20u/0cQ9MVeqsUhqx67Taj8ueJSwTUlaLTUB8wJtpC", //Hashed: AdminPass123!
        coordinates: {
            latitude: -22.9068,
            longitude: -43.1729
        },
        isActive: true
    },
    {
        _id: user1Id,
        name: "Caetano JPO",
        email: "caetano@jpo.com",
        hashedPassword: "$2a$10$uzwsU0Co5b2udr6VraRdf./zPK8r5SDEUzeqWSMGxjbauM7Qly3m2", //Hashed: Test126!
        coordinates: {
            latitude: -3.1190,
            longitude: -60.0217
        },
        isActive: true
    },
    {
        _id: user2Id,
        name: "Just another Test",
        email: "maps@arecool.com",
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
const region7Id = ObjectId().toString();
const region8Id = ObjectId().toString();
const region9Id = ObjectId().toString();
const region10Id = ObjectId().toString();
const region11Id = ObjectId().toString();
const region12Id = ObjectId().toString();
const region13Id = ObjectId().toString();
const region14Id = ObjectId().toString();
const region15Id = ObjectId().toString();
const region16Id = ObjectId().toString();
const region17Id = ObjectId().toString();
const region18Id = ObjectId().toString();
const region19Id = ObjectId().toString();
const region20Id = ObjectId().toString();

db.regions.insertMany([
    {
        _id: region1Id,
        name: "Central Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-73.973057, 40.764356],
                    [-73.981899, 40.768094],
                    [-73.958000, 40.800621],
                    [-73.973057, 40.764356]
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
                    [-122.511550, 37.769420],
                    [-122.454362, 37.769420],
                    [-122.454362, 37.774836],
                    [-122.511550, 37.769420]
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
        name: "Hyde Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-0.175002, 51.507268],
                    [-0.165730, 51.513342],
                    [-0.154180, 51.509203],
                    [-0.175002, 51.507268]
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
        name: "Tiergarten",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [13.360134, 52.514694],
                    [13.370951, 52.519824],
                    [13.376543, 52.512806],
                    [13.360134, 52.514694]
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
        name: "Ueno Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [139.769405, 35.712677],
                    [139.773991, 35.718245],
                    [139.779019, 35.715396],
                    [139.769405, 35.712677]
                ]
            ]
        },
        owner: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region6Id,
        name: "Stanley Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-123.142157, 49.310187],
                    [-123.130779, 49.304904],
                    [-123.132598, 49.296669],
                    [-123.142157, 49.310187]
                ]
            ]
        },
        owner: user1Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region7Id,
        name: "Retiro Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-3.688593, 40.417145],
                    [-3.682539, 40.420492],
                    [-3.678814, 40.416493],
                    [-3.688593, 40.417145]
                ]
            ]
        },
        owner: user2Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region8Id,
        name: "Vondelpark",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [4.855279, 52.358706],
                    [4.862589, 52.360733],
                    [4.866490, 52.355278],
                    [4.855279, 52.358706]
                ]
            ]
        },
        owner: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region9Id,
        name: "Ibirapuera Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-46.653496, -23.587698],
                    [-46.645690, -23.589922],
                    [-46.643474, -23.584948],
                    [-46.653496, -23.587698]
                ]
            ]
        },
        owner: user1Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region10Id,
        name: "Phoenix Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-6.342654, 53.356855],
                    [-6.326937, 53.363968],
                    [-6.318466, 53.357826],
                    [-6.342654, 53.356855]
                ]
            ]
        },
        owner: user2Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region11Id,
        name: "Yoyogi Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [139.697876, 35.669080],
                    [139.704899, 35.673455],
                    [139.710233, 35.667891],
                    [139.697876, 35.669080]
                ]
            ]
        },
        owner: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region12Id,
        name: "Lumpini Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [100.541710, 13.732910],
                    [100.551227, 13.736755],
                    [100.555491, 13.729844],
                    [100.541710, 13.732910]
                ]
            ]
        },
        owner: user1Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region13Id,
        name: "Jardim Botânico",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-49.241142, -25.442558],
                    [-49.232650, -25.438790],
                    [-49.228403, -25.446112],
                    [-49.241142, -25.442558]
                ]
            ]
        },
        owner: user2Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region14Id,
        name: "Centennial Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [151.230316, -33.897528],
                    [151.238894, -33.891342],
                    [151.243157, -33.899001],
                    [151.230316, -33.897528]
                ]
            ]
        },
        owner: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region15Id,
        name: "Chapultepec Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-99.201942, 19.422519],
                    [-99.192573, 19.428336],
                    [-99.185440, 19.421755],
                    [-99.201942, 19.422519]
                ]
            ]
        },
        owner: user1Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region16Id,
        name: "Englischer Garten",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [11.592735, 48.158935],
                    [11.604123, 48.163842],
                    [11.610894, 48.156731],
                    [11.592735, 48.158935]
                ]
            ]
        },
        owner: user2Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region17Id,
        name: "Royal Botanic Gardens",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [144.979278, -37.830346],
                    [144.991043, -37.824159],
                    [144.995307, -37.832017],
                    [144.979278, -37.830346]
                ]
            ]
        },
        owner: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region18Id,
        name: "Letná Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [14.424158, 50.097454],
                    [14.433627, 50.103342],
                    [14.440894, 50.096731],
                    [14.424158, 50.097454]
                ]
            ]
        },
        owner: user1Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region19Id,
        name: "Griffith Park",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [-118.294258, 34.134155],
                    [-118.285890, 34.140042],
                    [-118.278757, 34.133461],
                    [-118.294258, 34.134155]
                ]
            ]
        },
        owner: user2Id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: region20Id,
        name: "Parc des Buttes-Chaumont",
        location: {
            type: "Polygon",
            coordinates: [
                [
                    [2.381454, 48.880094],
                    [2.392843, 48.885001],
                    [2.399614, 48.877890],
                    [2.381454, 48.880094]
                ]
            ]
        },
        owner: adminUserId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);
