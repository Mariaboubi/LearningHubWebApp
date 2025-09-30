
const apiUrlServer = "http://localhost:8080";

if (document.readyState !== 'loading'){
    main()
}
else{
    window.addEventListener('load', main)
}


function main() {
    console.log("Page loaded");
    loadCart();
}

function loadCart() {
    const username = sessionStorage.getItem("username");
    const sessionId = sessionStorage.getItem("sessionId");

    if (!username || !sessionId) {
        alert("Παρακαλώ συνδεθείτε για να δείτε το καλάθι σας.");
        return;
    }

    fetch(`http://localhost:8080/cart?username=${username}&sessionId=${sessionId}`)
        .then((response) => {
            if (!response.ok) throw new Error("Unauthorized");
            return response.json();
        })
        .then((cart) => renderCart(cart))
        .catch((error) => console.error("Error loading cart:", error));
}

function renderCart(cart) {
    const container = document.getElementById("root");
    const root = ReactDOM.createRoot(container);
    root.render(<App cart={cart} />);
}

function App({ cart }) {
    const [cartItems, setCartItems] = React.useState(cart.cartItems);


    const totalCost = React.useMemo(() => {
        return cartItems.reduce((sum, item) => sum + parseFloat(item.cost), 0);
    }, [cartItems]);


    function removeFromCart(itemId) {
        const username = sessionStorage.getItem("username");
        const sessionId = sessionStorage.getItem("sessionId");

        fetch("http://localhost:8080/cart/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, sessionId, itemId }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error removing item");
                return response.json();
            })
            .then((updatedCart) => {
                    setCartItems(updatedCart.cartItems);
            })
            .catch((error) => console.error("Error removing item from cart:", error));
    }

    return (
            <div>
                <h1>Το Καλάθι σας</h1>
                <table>
                    <thead className="boo">
                        <tr>
                            <th>Τύπος</th>
                            <th>Τίτλος</th>
                            <th>Κόστος</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    type={item.type}
                                    title={item.title}
                                    cost={item.cost}
                                    onRemove={() => removeFromCart(item.id)}
                                />
                            ))
                        }
                    </tbody>
                </table>
                <p>Συνολικό Κόστος: {totalCost}€</p>
            </div>
    );
}

function CartItem({ type, title, cost , onRemove }) {

    return (
        <tr>
            <td>{type}</td>
            <td>{title}</td>
            <td>{cost}€</td>
            <td><button className="remove-btn" onClick={onRemove}> Αφαίρεση  </button></td>
        </tr>
    )
}

