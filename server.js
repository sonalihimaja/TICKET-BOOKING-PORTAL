
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
var PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

var events = [
  {
    id: "e1",
    name: "Coldplay World Tour 2026",
    date: "2026-04-15",
    time: "7:00 PM",
    venue: "Hyderabad Arena",
    category: "Concert",
    price: 2500,
    available: 50,
    image: "🎵",
  },
  {
    id: "e2",
    name: "IPL Final - RCB vs MI",
    date: "2026-05-25",
    time: "6:30 PM",
    venue: "Wankhede Stadium, Mumbai",
    category: "Sports",
    price: 1200,
    available: 200,
    image: "🏏",
  },
  {
    id: "e3",
    name: "Tech Summit India 2026",
    date: "2026-04-30",
    time: "10:00 AM",
    venue: "HITEX, Hyderabad",
    category: "Conference",
    price: 500,
    available: 100,
    image: "💻",
  },
  {
    id: "e4",
    name: "Bahubali Theatre Experience",
    date: "2026-05-10",
    time: "9:00 PM",
    venue: "PVR IMAX, Vijayawada",
    category: "Movie",
    price: 350,
    available: 80,
    image: "🎬",
  },
  {
    id: "e5",
    name: "Comedy Night with Zakir Khan",
    date: "2026-04-22",
    time: "8:00 PM",
    venue: "Shilpakala Vedika, Hyderabad",
    category: "Comedy",
    price: 800,
    available: 60,
    image: "😂",
  },
  {
    id: "e6",
    name: "AR Rahman Live Concert",
    date: "2026-06-01",
    time: "6:00 PM",
    venue: "Chennai Trade Centre",
    category: "Concert",
    price: 1500,
    available: 120,
    image: "🎼",
  },
];

var bookings = [];

function makeTicketId() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var result = "TKT-";
  for (var i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

app.get("/api/events", function(req, res) {
  res.json({ success: true, data: events });
});

app.get("/api/events/:id", function(req, res) {
  var id = req.params.id;
  var event = null;

  for (var i = 0; i < events.length; i++) {
    if (events[i].id == id) {
      event = events[i];
      break;
    }
  }

  if (event == null) {
    res.json({ success: false, message: "Event not found" });
  } else {
    res.json({ success: true, data: event });
  }
});

app.post("/api/book", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var seats = req.body.seats;
  var eventId = req.body.eventId;

  if (!name || !email || !phone || !seats || !eventId) {
    res.json({ success: false, message: "Please fill all fields" });
    return;
  }

  // find the event
  var foundEvent = null;
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == eventId) {
      foundEvent = events[i];
      break;
    }
  }

  if (foundEvent == null) {
    res.json({ success: false, message: "Event not found" });
    return;
  }

  if (foundEvent.available < seats) {
    res.json({ success: false, message: "Not enough seats available" });
    return;
  }

  foundEvent.available = foundEvent.available - seats;

  var newBooking = {
    bookingId: makeTicketId(),
    eventId: eventId,
    eventName: foundEvent.name,
    venue: foundEvent.venue,
    date: foundEvent.date,
    time: foundEvent.time,
    name: name,
    email: email,
    phone: phone,
    seats: seats,
    totalAmount: seats * foundEvent.price,
    status: "Confirmed"
  };

  bookings.push(newBooking);

  res.json({ success: true, message: "Booking confirmed!", data: newBooking });
});

app.get("/api/bookings", function(req, res) {
  res.json({ success: true, data: bookings });
});

app.delete("/api/bookings/:id", function(req, res) {
  var bookingId = req.params.id;
  var index = -1;

  for (var i = 0; i < bookings.length; i++) {
    if (bookings[i].bookingId == bookingId) {
      index = i;
      break;
    }
  }

  if (index == -1) {
    res.json({ success: false, message: "Booking not found" });
    return;
  }

  var cancelledBooking = bookings[index];
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == cancelledBooking.eventId) {
      events[i].available = events[i].available + cancelledBooking.seats;
      break;
    }
  }

  bookings.splice(index, 1);

  res.json({ success: true, message: "Booking cancelled" });
});

app.listen(PORT, function() {
  console.log("Server is running at http://localhost:" + PORT);
});
