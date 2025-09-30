const uuid = require('uuid');
console.log(uuid.v4())
const express = require('express')

const app = express()
app.use(express.json()); ///

app.use('/public',
    express.static(__dirname + '/public'))

const users = [
    { username: "user1", password: "Password123!" },
    { username: "user2", password: "Password456!" },
    { username: "user3", password: "Password789!" },
    { username: "user4", password: "Booiscool123!" },
    { username: "user5", password: "Tsiboiscooler123!" },
    { username: "user6", password: "Aaaaa12!" },
];

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    console.log("SERVER ", username, password);

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        const sessionId = uuid.v4();
        user.sessionId = sessionId;
        res.json({ sessionId });
    } else {
        res.status(401).send("Unauthorized");
    }
});

const cart = []; // Απλό array για προσωρινή αποθήκευση αντικειμένων

app.post("/cart", (req, res) => {
    const { id, title, cost, username, sessionId, type } = req.body;

    // Έλεγχος ταυτοποίησης
    const validSession = users.some((u) => u.username === username && sessionId);
    if (!validSession) {
        return res.status(401).send("Unauthorized: Παρακαλώ συνδεθείτε.");
    }

    // Έλεγχος αν το αντικείμενο υπάρχει ήδη στο καλάθι
    const existingItem = cart.find((item) => item.id === id && item.username === username);
    if (existingItem) {
        return res.status(400).send("Το αντικείμενο υπάρχει ήδη στο καλάθι.");
    }

    // Προσθήκη του αντικειμένου στο καλάθι
    cart.push({ id, title, cost, username ,type});
    console.log(`Το αντικείμενο ${title} προστέθηκε στο καλάθι του χρήστη ${username}.`);
    res.status(200).send("Το αντικείμενο προστέθηκε στο καλάθι.");
});


app.get("/cart", (req, res) => {
    const { username, sessionId } = req.query;

    // Έλεγχος ταυτότητας
    const user = users.find((u) => u.username === username);
    if (!user || sessionId !== user.sessionId) {
        return res.status(401).send("Unauthorized");
    }

    // Φιλτράρισμα αντικειμένων καλαθιού
    const userCart = cart.filter((item) => item.username === username);

    res.json({ cartItems: userCart });
});


app.post("/cart/remove", (req, res) => {
    const { username, sessionId, itemId } = req.body;

    // Έλεγχος ταυτότητας
    const user = users.find((u) => u.username === username);
    if (!user || sessionId !== user.sessionId) {
        return res.status(401).send("Unauthorized");
    }
    
    for (let i = cart.length - 1; i >= 0; i--) {
        if(itemId == cart[i].id && username == cart[i].username){
            cart.splice(i, 1);
        }
    }

    // Αναδόμηση καλαθιού
    const userCart = cart.filter((item) => item.username === username);
    // Επιστροφή ενημερωμένου καλαθιού
    res.json({ cartItems: userCart });
});




let server = app.listen(8080)
console.log("listening...")
