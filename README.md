# PrithviClient: JavaScript SDK for Prithvi

A simple and easy-to-use Node.js client for interacting with the Prithvi database server. This SDK manages the TCP connection, command sending, and response handling, including automatic reconnection.

---

## Usage

First, import and create an instance of the `PrithviClient`. Then, connect to the server.

```javascript
const PrithviClient = require('prithvi-client');

const client = new PrithviClient('127.0.0.1', 1902);

async function main() {
  try {
    await client.connect();
    console.log('Successfully connected to the Prithvi server.');

    // Now you can use the client to send commands
    const setResult = await client.set('mykey', 'myvalue');
    console.log('SET response:', setResult);

    const getResult = await client.get('mykey');
    console.log('GET response:', getResult);
  } catch (error) {
    console.error('Failed to connect or send command:', error.message);
  } finally {
    client.close();
  }
}

main();
```

## API Reference

All commands are asynchronous and return a `Promise` that resolves with the server's response.

### Connection

**`new PrithviClient(host, port)`**

- Creates a new client instance.
- `host`: The server IP address (default: `'127.0.0.1'`).
- `port`: The server port (default: `1902`).

**`connect()`**

- Establishes a connection to the Prithvi server.

**`close()`**

- Closes the connection to the server.

### String Commands

- **`set(key, value, expiry)`**: Sets a key-value pair. `expiry` is an optional time in seconds.
- **`get(key)`**: Retrieves the value for a given key.

### Key Management

- **`del(key)`**: Deletes a key.
- **`exists(key)`**: Checks if a key exists.
- **`keys()`**: Returns all keys.

### Set Commands

- **`sadd(key, value)`**: Adds a value to a set.
- **`smembers(key)`**: Returns all members of a set.
- **`srem(key, value)`**: Removes a value from a set.

### List Commands

- **`lpush(key, value)`**: Prepends a value to a list.
- **`rpush(key, value)`**: Appends a value to a list.
- **`lpop(key)`**: Removes and returns the first element of a list.
- **`rpop(key)`**: Removes and returns the last element of a list.
- **`getList(key)`**: Retrieves the entire list.

### Server Commands

- **`flush(confirm)`**: Deletes all keys from the database. Set `confirm` to `true`.
- **`save()`**: Saves the current database state to disk.
- **`load()`**: Loads the database from a file.
- **`quit()`**: Closes the connection from the server-side.
- **`help()`**: Returns a list of available commands from the server.

---

## Error Handling and Reconnection

The client is designed to be resilient. If the connection to the Prithvi server is lost, the client will automatically try to reconnect up to 5 times with a short delay between attempts. Error messages will be logged to the console during this process.

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request if you have suggestions for improvement.

---

## License

This project is licensed under the [MIT License](./LICENSE).
