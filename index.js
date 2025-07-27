const net = require("net");

class PrithviClient {
  constructor(host = "127.0.0.1", port = 1902) {
    this.host = host;
    this.port = port;
    this.client = null;
    this.buffer = "";
    this.callbacks = [];
    this.authToken = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client = net.createConnection(
        { host: this.host, port: this.port },
        () => {
          this.client.setEncoding("utf8");
          this.client.on("data", this._handleData.bind(this));
          this.client.on("error", this._handleError.bind(this));
          this.client.on("close", this._handleClose.bind(this));

          resolve();
        }
      );
    });
  }

  _handleData(data) {
    this.buffer += data;

    let index;
    while ((index = this.buffer.indexOf("\n")) >= 0) {
      const line = this.buffer.slice(0, index).trim();
      this.buffer = this.buffer.slice(index + 1);

      const cb = this.callbacks.shift();
      if (cb) cb(line);
    }
  }

  _handleError(err) {
    console.error("Prithvi client error:", err.message);
  }

  _handleClose() {
    console.warn("Prithvi connection closed. Attempting reconnect...");
    this._attemptReconnect();
  }

  _attemptReconnect(retries = 5) {
    if (retries == 0) {
      console.log("Prithvi Connection close after 5 attempts to connect.");
      return;
    }

    setTimeout(() => {
      this.connect()
        .then(() => {
          console.log("Reconnected to the Prithvi Server");
        })
        .catch(() => {
          console.warn("Reconnect Failed. Retrying...");
          this._attemptReconnect(retries - 1);
        });
    }, 500);
  }

  _sendCommand(cmd, retries = 3) {
    return new Promise((resolve, reject) => {
      const trySend = (attempt) => {
        if (!this.client || this.client.destroyed) {
          this.client.end();
          return reject(new Error("Client not connected"));
        }

        try {
          this.client.write(cmd + "\n");
          this.callbacks.push(resolve);
        } catch (err) {
          if (attempt < retries) {
            setTimeout(() => trySend(attempt + 1), 100 * attempt); // Exponential backoff
          } else {
            reject(err);
          }
        }
      };

      trySend(0);
    });
  }

  // COMMANDS

  async set(key, value, expiry = null) {
    const cmd = expiry
      ? `SET ${key} ${value} EX ${expiry}`
      : `SET ${key} ${value}`;
    return this._sendCommand(cmd);
  }

  async get(key) {
    return this._sendCommand(`GET ${key}`);
  }

  async del(key) {
    return this._sendCommand(`DEL ${key}`);
  }

  async exists(key) {
    return this._sendCommand(`EXISTS ${key}`);
  }

  async keys() {
    return this._sendCommand(`KEYS`);
  }

  async sadd(key, value) {
    return this._sendCommand(`SADD ${key} ${value}`);
  }

  async smembers(key) {
    return this._sendCommand(`SMEMBERS ${key}`);
  }

  async srem(key, value) {
    return this._sendCommand(`SREM ${key} ${value}`);
  }

  async lpush(key, value) {
    return this._sendCommand(`LPUSH ${key} ${value}`);
  }

  async rpush(key, value) {
    return this._sendCommand(`RPUSH ${key} ${value}`);
  }

  async lpop(key) {
    return this._sendCommand(`LPOP ${key}`);
  }

  async rpop(key) {
    return this._sendCommand(`RPOP ${key}`);
  }

  async getList(key) {
    return this._sendCommand(`GETLIST ${key}`);
  }

  async flush(confirm = false) {
    return this._sendCommand(confirm ? `FLUSH FALL` : `FLUSH`);
  }

  async save() {
    return this._sendCommand(`SAVE`);
  }

  async load() {
    return this._sendCommand(`LOAD`);
  }

  async quit() {
    return this._sendCommand(`QUIT`);
  }

  async help() {
    return this._sendCommand(`HELP`);
  }

  close() {
    if (this.client && !this.client.destroyed) {
      this.client.end();
    }
  }

  async auth(username) {
    const response = this._sendCommand(`AUTH ${username}`);
    if (response.startsWith("TOKEN ")) {
      this.authToken = response.split(" ")[0];
      return `Authentication successful. Token stored.`;
    } else {
      throw new Error(`Unexpected response: ${response}`);
    }
  }

  async token(hash = null) {
    const tokenToUse = hash || this.authToken;
    if (!tokenToUse) {
      throw new Error(
        "No token provided or stored. Run auth() first or pass token manually."
      );
    }

    return this._sendCommand(`TOKEN ${tokenToUse}`);
  }

  getStoredToken() {
    return this.authToken;
  }
}

module.exports = PrithviClient;
