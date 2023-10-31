const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 
const app = express();
const cors = require('cors'); // Import CORS middleware


// Use CORS middleware
app.use(cors());
app.use(express.static('public'));
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sportsmanagementsystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
const Coach = mongoose.model('Coach', {
 
  username: String,
  id: String,
  email: String,
  password: String,
  contactNumber: String,
  firstName: String,
  lastName: String,
  sport: String, 
  experience:String,
});


app.post('/csign', async (req, res) => {
    const {
      username,
      id,
      email,
      password,
      contactNumber,
      firstName,
      lastName,
      sport,
      experience,
    } = req.body;

    try {


      if ( !username ||!id || !email || !password || !contactNumber || !firstName || !lastName || !sport ||!experience) {
        return res.status(400).json({ message: 'Please fill in all fields' });
      }

      const newCoach = new Coach({
        
        username,
        id,
        email,
        password,
        contactNumber,
        firstName,
        lastName,
        sport,
        experience,
      });

    
      await newCoach.save();

      
      res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
 
  
const Player = mongoose.model('Player', {
  username: String,
  id: String,
  email: String,
  password: String,
  contactNumber: String,
  firstName: String,
  lastName: String,
  sport: String,
  position: String,
  age: Number, // Add the 'age' field as a number
});

app.post('/psign', async (req, res) => {
  const {
    username,
    id,
    email,
    password,
    contactNumber,
    firstName,
    lastName,
    sport,
    position,
    age, // Include the 'age' field
  } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      !contactNumber ||
      !firstName ||
      !lastName ||
      !sport ||
      !position ||
      !age // Ensure 'age' is included
    ) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const newPlayer = new Player({
      username,
      id,
      email,
      password,
      contactNumber,
      firstName,
      lastName,
      sport,
      position,
      age, // Include the 'age' field
    });

    await newPlayer.save();

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});
const Admin = mongoose.model('Admin', {
  
  username: String,
  email: String,
  password: String,
  contactNumber: String,
  firstName: String,
  lastName: String,
});
app.post('/signup', async (req, res) => {
  const {
  
    username,
    email,
    password,
    contactNumber,
    firstName,
    lastName,
  } = req.body;

  try {
    if ( !username || !email || !password || !contactNumber || !firstName || !lastName) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const newAdmin = new Admin({
    
      username,
      email,
      password,
      contactNumber,
      firstName,
      lastName,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/playerlog', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username in MongoDB
    const user = await Player.findOne({ username });

    if (!user ) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create and send a JWT token for successful login
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h', // You can adjust the token expiration time
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/adminlog', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username in MongoDB
    const user = await Admin.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create and send a JWT token for successful login
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h', // You can adjust the token expiration time
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/coachlog', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Coach.findOne({ username });
    if (!user ) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create and send a JWT token for successful login
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h', // You can adjust the token expiration time
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/addplayer', async (req, res) => {
  const {
    username,
    id,
    email,
    password,
    contactNumber,
    firstName,
    lastName,
    sport,
    position,
    age, // Include the 'age' field
  } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      !contactNumber ||
      !firstName ||
      !lastName ||
      !sport ||
      !position ||
      !age // Ensure 'age' is included
    ) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if a player with the same ID already exists
    const existingPlayer = await Player.findOne({ id });

    if (existingPlayer) {
        return res.status(409).json({ message: 'Player with the same ID already exists' });
      }

    const newPlayer = new Player({
      username,
      id,
      email,
      password,
      contactNumber,
      firstName,
      lastName,
      sport,
      position,
      age, // Include the 'age' field
    });

    await newPlayer.save();

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});
app.post('/addcoach', async (req, res) => {
  const {
      username,
      id,
      email,
      password,
      contactNumber,
      firstName,
      lastName,
      sport,
      experience,
  } = req.body;

  try {
    if (!username ||!id || !email || !password || !contactNumber || !firstName || !lastName || !sport ||!experience) 
    {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if a player with the same ID already exists
    const existingCoach = await Coach.findOne({ id });

    if (existingCoach) {
        return res.status(409).json({ message: 'Coach with the same ID already exists' });
      }

    const newCoach = new Coach({
      username,
      id,
      email,
      password,
      contactNumber,
      firstName,
      lastName,
      sport,
      experience,
    });

    await newCoach.save();

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});

const Practice = mongoose.model('Practice', {
  name: String,
  date: Date,
  startTime: String,
  endTime: String,
  location: String,
  sport: String,
  coach:String,
  description: String,
});



app.post('/add-practice-event', async (req, res) => {
  try {
    // Extract the practice event data from the request body
    const newPracticeEvent = req.body;

    // Create a new instance of the Practice model
    const practiceEvent = new Practice(newPracticeEvent);

    // Save the practice event to the database
    await practiceEvent.save();

    // Return a success response
    res.status(201).json({ message: 'Practice event added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/get-events', async (req, res) => {
  try {
    const events = await Event.find(); // Assuming "Event" is your Mongoose model
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});
app.get('/get-practise-events', async (req, res) => {
  try {
    // Use the Practice model to fetch all practice events from the database
    const practiseEvents = await Practice.find();

    // Return the practice events as JSON
    res.status(200).json(practiseEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/playerslist', async (req, res) => {
  try {
    const players = await Player.find();
    console.log(players); // Log the players to the server console
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const Event = mongoose.model('Event', {
 
  name: String,
  date: Date,
  startTime: String,
  endTime: String,
  location: String,
  category: String, // You can customize the schema as needed
});


app.post('/add-event', async (req, res) => {
  try {
    const eventData = req.body; // Extract event data from the request body

    // Create a new instance of the Event model
    const event = new Event(eventData);

    // Save the event to the database
    await event.save();

    // Return a success response
    res.status(201).json({ message: 'Event added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/get-coaches', async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Update an event (PUT request)
app.put('/update-event/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  const updatedEvent = req.body;

  try {
    // Find the event by its ID and update it
    const updated = await Event.findByIdAndUpdate(eventId, updatedEvent);

    if (updated) {
      res.status(200).send('Event updated successfully');
    } else {
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/get-players-by-teams', async (req, res) => {
  try {
    const playersByTeams = await Player.aggregate([
      {
        $group: {
          _id: {
            team: '$sport',// Change to an appropriate field that represents sport
          },
          players: {
            $push: {
              id: '$id',
              firstName: '$firstName',
              lastName: '$lastName',
              position: '$position',
            },
          },
        },
      },
    ]);

    res.json(playersByTeams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/get-teams', async (req, res) => {
  try {
    const teams = await Player.distinct('sport'); // Assuming 'sport' represents the team name
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.delete('/deletePlayer/:id', async (req, res) => {
  const playerIdToDelete = req.params.id;

  try {
    // Find and delete the player by ID in the MongoDB database
    const deletedPlayer = await Player.findOneAndDelete({ id: playerIdToDelete });

    if (!deletedPlayer) {
      // Player not found
      return res.status(404).json({ message: 'Player not found' });
    }

    // Respond with success message
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.delete('/cancel-practice-event/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    // Use Mongoose to find and delete the practice event by ID
    const deletedEvent = await Practice.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      // Event not found
      return res.status(404).json({ message: 'Practice event not found' });
    }

    res.json({ message: 'Practice event canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Import necessary modules and setup your Express app

app.get('/get-player-details', async (req, res) => {
  try {
    const playerId = req.userId; // You should set userId during token verification
    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.status(200).json({ player });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// ... (previous code)

const RegisteredPlayers = mongoose.model('RegisteredPlayers', {
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  eventName: String,
  eventDate: Date, // Add this field to store the date of the event
  startTime:String,
  endTime:String,
  id: String,
  name: String,
  email: String,
});
app.post('/register-for-event', async (req, res) => {
  try {
    const { id, eventId, name, email } = req.body; // Retrieve 'name' and 'email' from the request body

    // Check if the player is already registered for the same event with the same ID
    const existingRegistration = await RegisteredPlayers.findOne({
      eventId,
      id,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Player is already registered for this event with the same ID' });
    }

    // Fetch the event details, including the event name and date
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create a new event registration instance with the event name and date
    const newRegistration = new RegisteredPlayers({
      eventId,
      eventName: event.name,
      eventDate: event.date,
      startTime:event.startTime,
      endTime:event.endTime,
      id,
      name, // Use the 'name' obtained from the request body
      email, // Use the 'email' obtained from the request body
    });

    // Save the event registration to the database
    await newRegistration.save();

    res.status(201).json({ message: 'Event registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/get-registered-players', async (req, res) => {
  try {
    const { eventId } = req.query;

    // Fetch registered players for the specified eventId
    const registeredPlayers = await RegisteredPlayers.find({ eventId });

    res.json(registeredPlayers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/getProfile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await Player.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
app.get('/getProfile1', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await Coach.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
app.get('/getProfile2', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await Admin.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
// ... (rest of your server-side code)
// Add an endpoint to fetch registered events for a player
app.get('/get-registered-events/:playerId', async (req, res) => {
  try {
    const playerId = req.params.playerId;

    // Fetch the registered events for the player from the RegisteredPlayers collection
    const registeredEvents = await RegisteredPlayers.find({ id: playerId });

    // Return the registered events as JSON
    res.status(200).json(registeredEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
