import axios from 'axios';

const sendEmail = async (user, message) => {
    try {
      const response = await axios.post('http://localhost:4000/send-email', {
        name: user ? user.name : '',
        email: typeof user == 'object' ? user.email : (user || ''),
        message: message
      });
      if (response.data.status === 'success') {
        console.log('Email sent successfully!');
      } else {
        console.log('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
};

export default sendEmail;