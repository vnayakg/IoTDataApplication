db.users.drop()

db.createCollection("users")

var superData = {
    name  : "SUPER ADMIN",
    username : "superadmin",
    password : "superadmin",
    phone : 0000000000,
    isAdmin: true,
    isSuperAdmin: true,
}

db.users.insert(superData)