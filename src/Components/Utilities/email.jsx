import axios from 'axios';
import { API_URL } from '../../Services/auth';

const sendEmail = async (user, message, endpoint) => {
    try {
      const response = await axios.post(`${API_URL}/${endpoint}`, {
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