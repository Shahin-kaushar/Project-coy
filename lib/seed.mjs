/**
 * Seed data for the Discover demo.
 *
 * Profiles are fictional. `likesYou` lives on the server only and is stripped
 * before anything is sent to the client (see lib/matching.mjs#publicProfile),
 * because Coy's core promise is that you never learn who liked you until the
 * like is mutual.
 */

const PROFILES = [
  {
    name: "Aanya Malhotra",
    age: 24,
    city: "Delhi",
    college: "Delhi University",
    bio: "Chronic overthinker who will still beat you at Scrabble.",
    interests: ["Bookstores", "Filter coffee", "Indie music"],
  },
  {
    name: "Rohan Mehta",
    age: 26,
    city: "Mumbai",
    college: "St. Xavier's College",
    bio: "Weekend trekker, weekday product designer.",
    interests: ["Trekking", "Film photography", "Coffee"],
  },
  {
    name: "Ishaan Verma",
    age: 23,
    city: "Bengaluru",
    college: "Christ University",
    bio: "I make playlists for people who never ask for them.",
    interests: ["Indie music", "Cycling", "Gaming"],
  },
  {
    name: "Meera Nair",
    age: 25,
    city: "Kochi",
    college: "CUSAT",
    bio: "Bakes when stressed, which is often.",
    interests: ["Baking", "K-dramas", "Dogs"],
  },
  {
    name: "Kabir Sethi",
    age: 27,
    city: "Pune",
    college: "Fergusson College",
    bio: "Open mics, terrible puns, occasional closure.",
    interests: ["Stand-up comedy", "Open mics", "Poetry"],
  },
  {
    name: "Aditi Rao",
    age: 22,
    city: "Hyderabad",
    college: "Osmania University",
    bio: "Said \"one more episode\" four episodes ago.",
    interests: ["Anime", "Cooking", "Cats"],
  },
  {
    name: "Arjun Pillai",
    age: 25,
    city: "Chennai",
    college: "Loyola College",
    bio: "Football on Sundays, filter coffee the rest of the week.",
    interests: ["Football", "Filter coffee", "Running"],
  },
  {
    name: "Sanya Kapoor",
    age: 24,
    city: "Jaipur",
    college: "MNIT Jaipur",
    bio: "Architect-in-training and collector of old doors.",
    interests: ["Sketching", "Travel", "Thrifting"],
  },
  {
    name: "Dev Patel",
    age: 26,
    city: "Ahmedabad",
    college: "IIT Gandhinagar",
    bio: "Probably debugging something right now.",
    interests: ["Startups", "Chess", "Running"],
  },
  {
    name: "Naina Bansal",
    age: 23,
    city: "Chandigarh",
    college: "Panjab University",
    bio: "Yoga at six, overthinking by half past.",
    interests: ["Yoga", "Bookstores", "Baking"],
  },
  {
    name: "Vivaan Joshi",
    age: 28,
    city: "Bengaluru",
    college: "Christ University",
    bio: "I know a guy for everything.",
    interests: ["Startups", "Board games", "Street food"],
  },
  {
    name: "Tara Menon",
    age: 24,
    city: "Chennai",
    college: "Anna University",
    bio: "Dance floor regular, morning person by force.",
    interests: ["Theatre", "Indie music", "Running"],
  },
  {
    name: "Reyansh Gupta",
    age: 22,
    city: "Lucknow",
    college: "University of Lucknow",
    bio: "Ex state-level badminton, current-level procrastinator.",
    interests: ["Badminton", "Anime", "Street food"],
  },
  {
    name: "Aisha Khan",
    age: 25,
    city: "Mumbai",
    college: "TISS Mumbai",
    bio: "Trying to read 30 books this year. On book four.",
    interests: ["Bookstores", "Poetry", "Coffee"],
  },
  {
    name: "Nikhil Reddy",
    age: 27,
    city: "Hyderabad",
    college: "IIIT Hyderabad",
    bio: "I will demo my side project whether you ask or not.",
    interests: ["Startups", "Sci-fi", "Gaming"],
  },
  {
    name: "Pooja Iyer",
    age: 24,
    city: "Bengaluru",
    college: "Mount Carmel College",
    bio: "Trained Bharatanatyam dancer, untrained chef.",
    interests: ["Theatre", "Cooking", "Cats"],
  },
  {
    name: "Siddharth Bose",
    age: 26,
    city: "Kolkata",
    college: "Jadavpur University",
    bio: "Cinephile with very strong opinions about endings.",
    interests: ["Film photography", "Indie music", "Bookstores"],
  },
  {
    name: "Kavya Sharma",
    age: 23,
    city: "Delhi",
    college: "SRCC",
    bio: "Debate team dropout turned spreadsheet enthusiast.",
    interests: ["Board games", "Badminton", "Travel"],
  },
  {
    name: "Aryan Singh",
    age: 25,
    city: "Delhi",
    college: "IIT Delhi",
    bio: "Trying to be the friend who replies on time.",
    interests: ["Cricket", "Gaming", "Running"],
  },
  {
    name: "Ritika Das",
    age: 24,
    city: "Kolkata",
    college: "Jadavpur University",
    bio: "Pottery class regular. Still bad at it.",
    interests: ["Pottery", "Yoga", "Thrifting"],
  },
  {
    name: "Omkar Deshmukh",
    age: 28,
    city: "Pune",
    college: "Savitribai Phule Pune University",
    bio: "Marine engineer ashore, exploring every hill nearby.",
    interests: ["Trekking", "Cycling", "Film photography"],
  },
  {
    name: "Simran Kaur",
    age: 23,
    city: "Chandigarh",
    college: "Panjab University",
    bio: "Coffee snob. I will judge your order, kindly.",
    interests: ["Coffee", "Bookstores", "Stand-up comedy"],
  },
  {
    name: "Yash Agarwal",
    age: 24,
    city: "Indore",
    college: "IIM Indore",
    bio: "Ran a half marathon once. Mention it and I never stop.",
    interests: ["Running", "Cricket", "Street food"],
  },
  {
    name: "Diya Mathew",
    age: 22,
    city: "Kochi",
    college: "CUSAT",
    bio: "Illustrator who can only draw in cafes.",
    interests: ["Sketching", "Coffee", "Indie music"],
  },
  {
    name: "Harsh Yadav",
    age: 26,
    city: "Delhi",
    college: "Amity University",
    bio: "Weekend chef, weekday engineer.",
    interests: ["Cooking", "Anime", "Gaming"],
  },
  {
    name: "Ananya Roy",
    age: 25,
    city: "Kolkata",
    college: "Jadavpur University",
    bio: "Ex-journalist, current content writer, forever chai person.",
    interests: ["Poetry", "Bookstores", "Theatre"],
  },
  {
    name: "Manav Shetty",
    age: 27,
    city: "Bengaluru",
    college: "Christ University",
    bio: "My camera roll is ninety percent street food.",
    interests: ["Street food", "Film photography", "Travel"],
  },
  {
    name: "Shreya Kulkarni",
    age: 23,
    city: "Pune",
    college: "Fergusson College",
    bio: "Board game hoarder with a very competitive streak.",
    interests: ["Board games", "Badminton", "Baking"],
  },
  {
    name: "Aditya Nambiar",
    age: 24,
    city: "Kochi",
    college: "CUSAT",
    bio: "Can quote three sci-fi novels and zero real conversations.",
    interests: ["Sci-fi", "Gaming", "Chess"],
  },
  {
    name: "Neha Trivedi",
    age: 26,
    city: "Ahmedabad",
    college: "NID Ahmedabad",
    bio: "Designer, plant mom, part-time pottery mess.",
    interests: ["Pottery", "Yoga", "Thrifting"],
  },
  {
    name: "Karan Malhotra",
    age: 25,
    city: "Delhi",
    college: "Delhi University",
    bio: "Gym in the morning, gigs at night.",
    interests: ["Indie music", "Running", "Stand-up comedy"],
  },
  {
    name: "Riya Sen",
    age: 24,
    city: "Mumbai",
    college: "St. Xavier's College",
    bio: "Theatre kid who peaked in college and is at peace with it.",
    interests: ["Theatre", "Open mics", "Poetry"],
  },
  {
    name: "Abhinav Jain",
    age: 22,
    city: "Jaipur",
    college: "MNIT Jaipur",
    bio: "Astronomy club president. Yes, I will point out Orion.",
    interests: ["Astronomy", "Chess", "Trekking"],
  },
  {
    name: "Ishita Ghosh",
    age: 27,
    city: "Bengaluru",
    college: "Christ University",
    bio: "Product manager by day, amateur baker by weekend.",
    interests: ["Baking", "Cats", "Startups"],
  },
];

/**
 * Profiles that have already liked the signed-in user. This flag must never
 * reach the client: the feed strips it, and a match is only revealed when the
 * user likes them back.
 */
const LIKES_YOU = new Set(["p02", "p05", "p09", "p13", "p18", "p22", "p27", "p31"]);

export const ME = {
  id: "me",
  name: "You",
  age: 24,
  city: "Bengaluru",
  photo: "/avatars/me.svg",
};

export function seedProfiles() {
  return PROFILES.map((profile, index) => {
    const id = `p${String(index + 1).padStart(2, "0")}`;
    return {
      id,
      name: profile.name,
      age: profile.age,
      city: profile.city,
      college: profile.college,
      bio: profile.bio,
      interests: [...profile.interests],
      photo: `/avatars/${id}.svg`,
      // Stable ordering keeps the demo deterministic across restarts.
      order: index + 1,
      likesYou: LIKES_YOU.has(id),
    };
  });
}

export function seedDatabase() {
  return {
    version: 1,
    me: { ...ME },
    profiles: seedProfiles(),
    swipes: [],
    matches: [],
  };
}
