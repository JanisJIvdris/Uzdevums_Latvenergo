<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
        >
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
        >
      </div>
      <button type="submit">
        Login
      </button>
    </form>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import apiClient from '../services/apiService';

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    // Handles user login by sending credentials to the server
    async login() {
      try {
        const response = await apiClient.post('/login', {
          username: this.username,
          password: this.password,
        });
        const { token } = response.data; // Extract JWT token from response
        localStorage.setItem('token', token);
        // Redirect to the main page
        this.$router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    },
  },
};
</script>

<style scoped>
form {
  max-width: 300px;
  margin: 0 auto;
}

div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
}
</style>
