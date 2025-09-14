class Users {
  #Username;
  #PhoneNumber;
  #Password;

  constructor(Username, PhoneNumber, Password) {
    this.setUsername(Username);
    this.setPhoneNumber(PhoneNumber);
    this.setPassword(Password);
  }

  getUsername() {
    return this.#Username;
  }

  setUsername(username) {
    if (!username || !username.trim()) {
      return false;
    }
    if (username.length <= 6 || username.length >= 50) {
      return false;
    }
    this.#Username = username.trim();
    return true;
  }

  getPhoneNumber() {
    return this.#PhoneNumber;
  }

  setPhoneNumber(number) {
    if (!number) {
      return false;
    }
    
    const cleaned = number.replace(/[\s-]/g, '');

    if (!/^\d+$/.test(cleaned)) {
      return false;
    }
    if (cleaned.length !== 9 && cleaned.length !== 10) {
      return false;
    }
    if (!cleaned.startsWith('0')) {
      return false;
    }

    const validPrefixes = [
      '10','11','12','15','16','17','18','19',
      '23','24','25','26','27','28','29',
      '31','32','33','34','35','36','37','38','39',
      '41','42','43','44','45','46','47','48','49'
    ];
    const prefix = cleaned.slice(1, 3);
    if (!validPrefixes.includes(prefix)) {
      return false;
    }

    this.#PhoneNumber = cleaned;
    return true;
  }

  getPassword() {
    return this.#Password;
  }

  setPassword(password) {
    if (!password || !password.trim()) {
      return false;
    }
    if (password.length < 8 || password.length > 30) {
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if (!/[a-z]/.test(password)) {
      return false;
    }
    if (!/[0-9]/.test(password)) {
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return false;
    }

    this.#Password = password;
    return true;
  }

}

export default Users;