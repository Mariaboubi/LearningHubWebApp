const apiUrl = "https://learning-hub-1whk.onrender.com";
const apiUrlServer = "http://localhost:8080";


// Λήψη κατηγοριών και υποκατηγοριών από το API
function fetchCategoriesAndSubcategories() {
    fetch(`${apiUrl}/categories`)
        .then(categoriesResponse => categoriesResponse.json())
        .then(categories => {
            return fetch(`${apiUrl}/subcategories`)
                .then(subcategoriesResponse => subcategoriesResponse.json())
                .then(subcategories => {
                    for (const category of categories) {
                        if (category.img_url) {
                            category.img_url = `${apiUrl}/${category.img_url}`;
                        }

                        // Σύνδεση υποκατηγοριών με τις κατηγορίες
                        category.subcategories = subcategories.filter(
                            (sub) => sub.category_id === category.id
                        );
                    }

                    // Εμφάνιση κατηγοριών
                    renderCategories(categories);
                });
        })
        .catch(error => {
            console.error("Σφάλμα κατά τη φόρτωση των κατηγοριών/υποκατηγοριών:", error);
        });
}


// Απόδοση κατηγοριών στη σελίδα
function renderCategories(categories) {
    const source = document.getElementById("categories-template").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({ categories });
    document.getElementById("categories").innerHTML = html;
}

// Λήψη στοιχείων κατηγορίας και εμφάνιση στη σελίδα category.html
function fetchCategoryItems() {
    sessionStorage.clear();
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("id");

    fetch(`${apiUrl}/categories`)
        .then(categoriesResponse => categoriesResponse.json())
        .then(categories => {
            if (!categoryId) {
                console.error("Δεν παρέχεται ID κατηγορίας");
                return;
            }

            fetch(`${apiUrl}/learning-items?category=${categoryId}`)
                .then(response => response.json())
                .then(items => {
                    for (const item of items) {
                        if (item.image) {
                            item.image = `${apiUrl}/${item.image}`;
                        }
                    }

                    const category = categories.find(cat => cat.id === parseInt(categoryId));
                    const categoryTitle = category ? category.title : "Άγνωστη Κατηγορία";
                    document.getElementById("category-title").innerText = categoryTitle;

                    renderLearningItems(items);
                })
                .catch(error => {
                    console.error("Σφάλμα κατά τη φόρτωση των στοιχείων της κατηγορίας:", error);
                });
        })
        .catch(error => {
            console.error("Σφάλμα κατά τη φόρτωση των κατηγοριών:", error);
        });
}

function renderLearningItems(items) {
    const source = document.getElementById("learning-items-template").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({ items });
    document.getElementById("learning-items-container").innerHTML = html;
}

function fetchSubcategoryItems() {
    const urlParams = new URLSearchParams(window.location.search);
    const subcategoryId = urlParams.get("id");

    fetch(`${apiUrl}/subcategories`)
        .then(subcategoriesResponse => subcategoriesResponse.json())
        .then(subcategories => {
            if (!subcategoryId) {
                console.error("Δεν παρέχεται ID υποκατηγορίας");
                return;
            }

            fetch(`${apiUrl}/learning-items?subcategory=${subcategoryId}`)
                .then(response => response.json())
                .then(items => {

                    const subcategory = subcategories.find((sub) => sub.id === parseInt(subcategoryId));
                    const subcategoryTitle = subcategory.title;
                    document.getElementById("subcategory-title").innerText = subcategoryTitle;

                    if (items.length == 0) {
                        let p = document.getElementById("learning-items-container")
                        p.textContent = "This subcategory has no content..."
                        return;
                    }
                    for (const item of items) {
                        if (item.image) {
                            item.image = `${apiUrl}/${item.image}`;
                        }
                    }

                    renderLearningItemsWithFeatures(items);
                })
                .catch(error => {
                    console.error("Σφάλμα κατά τη φόρτωση των στοιχείων της υποκατηγορίας:", error);
                });
        })
        .catch(error => {
            console.error("Σφάλμα κατά τη φόρτωση των υποκατηγοριών:", error);
        });
}


// Απόδοση στοιχείων εκπαιδευτικού υλικού με χαρακτηριστικά στη σελίδα
function renderLearningItemsWithFeatures(items) {
    Handlebars.registerHelper("parseFeatures", function (features) {
        if (!features) return [];
        return features.split(";").map((pair) => {
            const [key, value] = pair.split(":");
            return { key: key.trim(), value: value.trim() };
        });
    });

    const source = document.getElementById("learning-items-template").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({ items });
    document.getElementById("learning-items-container").innerHTML = html;
}


// Ενημέρωση του μενού πλοήγησης με τις κατηγορίες
function updateNavWithCategories(categories) {
    const navDropdown = document.querySelector('.navbar .dropdown ul.dropdown-content');

    if (!navDropdown) {
        console.error("Δεν βρέθηκε το στοιχείο του μενού για τις κατηγορίες.");
        return;
    }

    // Προσθήκη των κατηγοριών στο μενού
    categories.forEach((category) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `category.html?id=${category.id}`;
        link.textContent = category.title;
        listItem.appendChild(link);
        navDropdown.appendChild(listItem);
    });
}

async function loadCategoriesItems() {
    fetch(`${apiUrl}/categories`)
        .then(categoriesResponse => categoriesResponse.json())
        .then(categories => { updateNavWithCategories(categories); })

        .catch(error => {
            console.error("Σφάλμα κατά τη φόρτωση των κατηγοριών στο πεδίο nav:", error);
        });

}

async function login() {
    var ssid = null;
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    usernameInput.addEventListener("change", function (evt) {
        const username = evt.target.value.trim();
        let usernameRe = /^[A-Za-z0-9_]{3,}$/
        const usernameValid = usernameRe.test(username); // Πρέπει να έχει τουλάχιστον 3 χαρακτήρες και να περιλαμβάνει μόνο λατινικούς χαρακτήρες, αριθμούς και κάτω παύλες

        if (!usernameValid) {
            evt.target.classList.add("invalid");
            evt.target.setCustomValidity("Το όνομα χρήστη πρέπει να έχει τουλάχιστον 3 χαρακτήρες και να περιλαμβάνει μόνο λατινικούς χαρακτήρες, αριθμούς και κάτω παύλες.");
            evt.target.reportValidity();
        } else {
            evt.target.classList.remove("invalid");
            evt.target.setCustomValidity("");
        }

    });

    passwordInput.addEventListener("change", function (evt) {
        const password = evt.target.value.trim();
        let passwordRe = /^(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%#])[A-Za-z\d_@$!%#]{8,}$/ // Τουλάχιστον 8 χαρακτήρες, με τουλάχιστον ένα κεφαλαίο, με τουλάχιστον έναν αριθμό και έναν ειδικό χαρακτήρα
        const passwordValid = passwordRe.test(password);

        if (!passwordValid) {
            evt.target.classList.add("invalid");
            evt.target.setCustomValidity("Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 8 χαρακτήρες, με τουλάχιστον ένα κεφαλαίο, με τουλάχιστον έναν αριθμό και έναν ειδικό χαρακτήρα( _, @, $, !, %, # ).");
            evt.target.reportValidity();
        } else {
            evt.target.classList.remove("invalid");
            evt.target.setCustomValidity("");
        }
    });


    document.getElementById("registration-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const loginMessage = document.getElementById("login-message");

        fetch(`${apiUrlServer}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject("Λανθασμένο όνομα χρήστη ή κωδικός.");
                }
            })
            .then((data) => {
                ssid = data.sessionId;
                sessionStorage.setItem("sessionId", data.sessionId);
                sessionStorage.setItem("username", username);
                console.log("sessionId: ", data.sessionId);
                loginMessage.textContent = "Σύνδεση επιτυχής!";
                loginMessage.style.color = "green";

                if (username && ssid) {
                    const cartLink = document.getElementById("cart-link");
                    cartLink.href = `cart.html?username=${username}&sessionId=${ssid}`;
                } else {
                    console.warn("Ο χρήστης δεν είναι συνδεδεμένος. Δεν δημιουργείται σύνδεσμος για το καλάθι.");
                }


            })
            .catch((error) => {
                if (typeof error === "string") {
                    loginMessage.textContent = error; 
                } else {
                    loginMessage.textContent = "Σφάλμα κατά τη σύνδεση. Προσπαθήστε ξανά.";
                }
                loginMessage.style.color = "red";
                console.error("Σφάλμα κατά τη σύνδεση:", error);
            });

    });


    
}
function addToCart(id, title, cost, type) {
    const sessionId = sessionStorage.getItem("sessionId");
    const username = sessionStorage.getItem("username");

    if (!sessionId) {
        alert("Παρακαλώ συνδεθείτε για αγορά του εκπαιδευτικού υλικού.");
        return;
    }

    const cartItem = { id, title, cost, type, username, sessionId };

    fetch("http://localhost:8080/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
    })
        .then((response) => {
            const button = document.querySelector(`button[onclick="addToCart('${id}', '${title}', '${cost}', '${type}')"]`);
            const parentContainer = button.parentElement;
            
            let messageDiv = parentContainer.querySelector('.cart-message');
            if (!messageDiv) {
                messageDiv = document.createElement('div');
                messageDiv.className = 'cart-message';
                parentContainer.appendChild(messageDiv);
            }

            if (response.ok) {
                messageDiv.textContent = "Το αντικείμενο προστέθηκε στο καλάθι!";
                messageDiv.style.color = "green";
            } else {
                response.text().then((text) => {
                    messageDiv.textContent = text || "Προέκυψε σφάλμα κατά την προσθήκη.";
                    messageDiv.style.color = "red";
                });
            }

            // Εξαφάνιση του μηνύματος μετά από 3 δευτερόλεπτα
            setTimeout(() => {
                messageDiv.textContent = "";
            }, 3000);
        })
        .catch((error) => {
            console.error("Σφάλμα κατά την προσθήκη στο καλάθι:", error);
        });
}


window.addEventListener("DOMContentLoaded", () => {


    if (document.getElementById("categories-template")) {
        fetchCategoriesAndSubcategories();
        loadCategoriesItems();
    }

    if (document.title.includes("Cources - Sky is the limit")) {
        fetchCategoryItems();
        loadCategoriesItems();
        login();

    }
    if (document.title.includes("Subcategories - Sky is the limit")) {
        fetchSubcategoryItems();
        loadCategoriesItems();
    }
    if (document.title.includes("About us - Sky is the limit")) {
        loadCategoriesItems();
    }

});



// Λειτουργία για την εναλλαγή ορατότητας του κωδικού
function togglePasswordVisibility(inputId, buttonElement) {
    // Βρίσκουμε το πεδίο κωδικού με το id που δόθηκε
    const inputField = document.getElementById(inputId);

    // Βρίσκουμε το εικονίδιο μέσα στο κουμπί
    const imgElement = buttonElement.querySelector("img");

    // Εναλλαγή τύπου πεδίου (password <-> text)
    if (inputField.type === "password") {
        inputField.type = "text";
        imgElement.src = "images/see.png"; // Αλλαγή εικονιδίου σε "Hide"
        imgElement.alt = "Hide Password";
    } else {
        inputField.type = "password";
        imgElement.src = "images/invisible.png"; // Αλλαγή εικονιδίου σε "Show"
        imgElement.alt = "Show Password";
    }
}