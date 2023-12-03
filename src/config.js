/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.CONNECTION_STR) {
  console.error('CONNECTION_STR is not defined');
  process.exit(1);
}

export default {
  CONNECTION_STR:
    'mongodb+srv://prettyderby6666:prettyderby6666@cluster0.k0pargn.mongodb.net/?retryWrites=true&w=majority',
};
