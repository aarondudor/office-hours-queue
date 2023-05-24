import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import studentRoutes from './routes/students';
import instructorRoutes from './routes/instructor';
import mockStudentRoutes from './routes/mock/students';
import mockInstructorRoutes from './routes/mock/instructor';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/students', studentRoutes);
app.use('/instructors', instructorRoutes);
app.use('/mock/students', mockStudentRoutes);
app.use('/mock/instructors', mockInstructorRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
