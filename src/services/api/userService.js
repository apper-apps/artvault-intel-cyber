import usersData from '../mockData/users.json';

let users = [...usersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock JWT token generation
const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId: user.Id,
    email: user.email,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Mock token validation
const validateToken = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;
    
    return payload;
  } catch (error) {
    return null;
  }
};

export const userService = {
  async login(email, password) {
    await delay(500);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // In a real app, you would hash and compare passwords
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    const token = generateToken(user);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    
    return {
      user: userWithoutPassword,
      token
    };
  },

  async register(userData) {
    await delay(400);
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const newUser = {
      ...userData,
      Id: Math.max(...users.map(u => u.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    const token = generateToken(newUser);
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    
    return {
      user: userWithoutPassword,
      token
    };
  },

  async getCurrentUser(token) {
    await delay(200);
    
    const payload = validateToken(token);
    if (!payload) {
      throw new Error('Invalid token');
    }
    
    const user = users.find(u => u.Id === payload.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    
    return userWithoutPassword;
  },

  async updateProfile(userId, profileData) {
    await delay(300);
    
    const index = users.findIndex(u => u.Id === parseInt(userId));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users[index] = {
      ...users[index],
      ...profileData,
      Id: parseInt(userId),
      updatedAt: new Date().toISOString()
    };
    
    const userWithoutPassword = { ...users[index] };
    delete userWithoutPassword.password;
    
    return userWithoutPassword;
  },

  async changePassword(userId, currentPassword, newPassword) {
    await delay(300);
    
    const user = users.find(u => u.Id === parseInt(userId));
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    const index = users.findIndex(u => u.Id === parseInt(userId));
    users[index] = {
      ...users[index],
      password: newPassword,
      updatedAt: new Date().toISOString()
    };
    
    return true;
  },

  async logout() {
    await delay(100);
    return true;
  },

  async getAll() {
    await delay(200);
    return users.map(user => {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    });
  },

  async getById(id) {
    await delay(150);
    const user = users.find(u => u.Id === parseInt(id));
    if (!user) return null;
    
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  },

  async create(userData) {
    return this.register(userData);
  },

  async update(id, userData) {
    return this.updateProfile(id, userData);
  },

  async delete(id) {
    await delay(250);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) return false;
    
    users.splice(index, 1);
    return true;
  }
};