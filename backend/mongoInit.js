db.users.drop()

db.createCollection("users")

var superData = {
    name  : "SUPER ADMIN",
    username : "superadmin",
    password : "$2a$10$D6hTKYnJi3T/a8Ivq07bKuDIbgcVLqGGRMWI9NrXi7HmvKiwFo2eq",//superadmin
    phone : 0000000000,
    isAdmin: true,
    isSuperAdmin: true,
}

db.users.insert(superData)