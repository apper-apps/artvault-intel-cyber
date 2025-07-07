import usersData from '@/services/mockData/users.json';

// Utility function to create delay for realistic API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for user data (simulating database)
let users = [...usersData];
let nextId = Math.max(...users.map(u => u.Id || 0)) + 1;

// Get all users
export async function getAll() {
  await delay(300);
  try {
    return [...users];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

// Get user by ID
export async function getById(id) {
  await delay(200);
  try {
    const userId = parseInt(id);
    const user = users.find(u => u.Id === userId);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return { ...user };
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
}

// Create new user
export async function create(userData) {
  await delay(400);
  try {
    const newUser = {
      ...userData,
      Id: nextId++,
      CreatedOn: new Date().toISOString(),
      ModifiedOn: new Date().toISOString()
    };
    users.push(newUser);
    return { ...newUser };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Update existing user
export async function update(id, userData) {
  await delay(350);
  try {
    const userId = parseInt(id);
    const userIndex = users.findIndex(u => u.Id === userId);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      Id: userId, // Ensure ID doesn't change
      ModifiedOn: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    return { ...updatedUser };
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
}

// Delete user
export async function deleteUser(id) {
  await delay(250);
  try {
    const userId = parseInt(id);
    const userIndex = users.findIndex(u => u.Id === userId);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    return { ...deletedUser };
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
}

// Update user profile (specialized update function)
export async function updateProfile(id, profileData) {
  await delay(300);
  try {
    const userId = parseInt(id);
    const userIndex = users.findIndex(u => u.Id === userId);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Filter out sensitive fields that shouldn't be updated via profile
    const allowedFields = ['Name', 'email', 'bio', 'specialties', 'location', 'website'];
    const filteredData = Object.keys(profileData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = profileData[key];
        return obj;
      }, {});
    
    const updatedUser = {
      ...users[userIndex],
      ...filteredData,
      ModifiedOn: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    return { ...updatedUser };
  } catch (error) {
    console.error(`Error updating profile for user ID ${id}:`, error);
    throw error;
  }
}

// Search users by name or email
export async function search(query) {
  await delay(200);
  try {
    if (!query || query.trim() === '') {
      return [...users];
    }
    
    const searchTerm = query.toLowerCase();
    const filteredUsers = users.filter(user => 
      (user.Name && user.Name.toLowerCase().includes(searchTerm)) ||
      (user.email && user.email.toLowerCase().includes(searchTerm))
    );
    
    return [...filteredUsers];
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteUser,
  updateProfile,
  search
};