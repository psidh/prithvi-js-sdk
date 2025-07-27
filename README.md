# Prithvi-JS-SDK: JavaScript SDK for Prithvi

A simple, fast, and easy-to-use Node.js client for interacting with the [Prithvi](https://github.com/psidh/prithvi) in-memory database server over raw TCP. This SDK handles connection management, command execution, and automatic reconnection with optional authentication support.

---

## 🚀 Installation

```bash
npm i prithvi-js-sdk
```

---

## 🛠️ Usage

```javascript
const PrithviClient = require("prithvi-js-sdk");

const client = new PrithviClient("127.0.0.1", 1902);

async function main() {
  try {
    await client.connect();
    console.log("Connected to Prithvi.");

    // Optional: Authenticate
    await client.auth("your-username");
    await client.token(); // Reuses stored token

    await client.set("mykey", "myvalue");
    const value = await client.get("mykey");
    console.log("GET response:", value);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    client.close();
  }
}

main();
```

---

## 📚 API Reference

### 🔌 Connection

- **`new PrithviClient(host, port)`**
  Initializes the client. Defaults: `host = '127.0.0.1'`, `port = 1902`.

- **`connect()`**
  Establishes TCP connection to the Prithvi server.

- **`close()`**
  Closes the client connection.

---

### 🔐 Authentication

- **`auth(username)`**
  Initiates authentication. Returns and stores a `TOKEN <hash>` internally.

- **`token(hash?)`**
  Sends the stored token (from `auth`) or manually passed token to authenticate session.

- **`getStoredToken()`**
  Returns the currently stored token hash.

---

### 🔑 Key Commands

- **`set(key, value, expiry?)`**
  Sets a key with optional expiry (in seconds).

- **`get(key)`**
  Retrieves value for a key.

- **`del(key)`**
  Deletes a key.

- **`exists(key)`**
  Checks existence of a key.

- **`keys()`**
  Returns list of all keys.

---

### 📚 Set Commands

- **`sadd(key, value)`**
  Adds a value to a set.

- **`smembers(key)`**
  Returns all members of a set.

- **`srem(key, value)`**
  Removes a value from a set.

---

### 📃 List Commands

- **`lpush(key, value)`**
  Prepends value to a list.

- **`rpush(key, value)`**
  Appends value to a list.

- **`lpop(key)`**
  Removes and returns first element.

- **`rpop(key)`**
  Removes and returns last element.

- **`getList(key)`**
  Returns all elements in the list.

---

### 🖥️ Server Commands

- **`flush(confirm)`**
  Clears all data. Pass `true` to confirm.

- **`save()`**
  Persists data to disk.

- **`load()`**
  Loads data from disk.

- **`quit()`**
  Gracefully closes the server-side session.

- **`help()`**
  Returns a list of supported server commands.

---

## ⚠️ Error Handling & Resilience

- Auto-reconnect is built-in.
- If the connection drops, the client retries 5 times before giving up.
- Token is preserved across reconnects if previously authenticated.
- All methods return Promises — use `async/await` or `.then()`/`.catch()`.

---

## 🧪 Example with Full Flow

```javascript
await client.connect();

await client.auth("sid");
await client.token();

await client.set("count", "1");
console.log(await client.get("count")); // Output: "1"

console.log("Stored token:", client.getStoredToken());

client.close();
```

---

## 📬 Contributing

Contributions welcome! Open issues, suggest features, or submit PRs.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---
