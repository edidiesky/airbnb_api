import bcrypt from "bcryptjs";

const userData = [
  {
    username: "Jeremy",
    image: "/images/user_1.jpeg",
    country: "Belgium",
    email: "essienedidiong1000@gmail.com",
    createdAt: "1/17/2020",
    password: bcrypt.hashSync("12345", 10),
    role: "user",
    about: {},
  },
  {
    username: "DamiLola17b",
    image: "/images/user_2.png",
    country: "United Arab Emirates",
    email: "DamiLola17b@gmail.com",
    createdAt: "1/17/2020",
    password: bcrypt.hashSync("12345", 10),
    role: "user",
    about: {},
  },
  {
    username: "JonathanMayors12",
    image: "/images/user_3.png",
    country: "Christmas Island",
    email: "JonathanMayors12@gmail.com",
    createdAt: "1/17/2020",
    password: bcrypt.hashSync("12345", 10),
    role: "user",
    about: {},
  },
];
export default userData;
