import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name) {
      setError('Please enter your name.');
      return;
    }

    if (!age || age <= 0) {
      setError('Please enter a valid age.');
      return;
    }

    try {
      const response = await fetch('http://localhost:7000/submit-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.text();
      setMessage(result);
    } catch (err) {
      setError('Failed to submit: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✨ Survey Application ✨</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="age" style={styles.label}>Age:</label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              style={styles.input}
              min="1"
            />
          </div>
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button}>Submit</button>
          </div>
        </form>
        {message && <p style={styles.successMessage}>{message}</p>}
        {error && <p style={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #a8e0b5, #f3f4f7)', // Gradient background
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Stronger shadow for depth
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    color: '#4a90e2', // Vibrant blue for title
    marginBottom: '20px',
    fontFamily: '"Poppins", sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: '20px',
    width: '100%',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
    display: 'block',
    textAlign: 'left',
  },
  input: {
    width: '94%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Soft shadow for inputs
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: '100%', // Full width
    backgroundColor: '#4a90e2', // Bright blue for button
    color: '#ffffff',
    fontSize: '16px',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  buttonHover: {
    backgroundColor: '#357ab8', // Darker blue on hover
    transform: 'scale(1.05)', // Slight scale up on hover
  },
  successMessage: {
    color: '#28a745', // Green for success message
    marginTop: '20px',
    fontSize: '16px',
  },
  errorMessage: {
    color: '#d32f2f', // Red for error message
    marginTop: '20px',
    fontSize: '16px',
  },
};

// Button hover effect
const applyButtonHoverEffect = (e) => {
  e.target.style.backgroundColor = '#357ab8';
  e.target.style.transform = 'scale(1.05)';
};

const removeButtonHoverEffect = (e) => {
  e.target.style.backgroundColor = '#4a90e2';
  e.target.style.transform = 'scale(1)';
};

export default App;