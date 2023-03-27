db.createUser(
    {
        user: "giaa",
        pwd: "giaa",
        roles: [
            {
                role: "readWrite",
                db: "giaa"
            }
        ]
    }
);
