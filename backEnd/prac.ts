type users = {
  name: string;
};

function greet2(user: users) {
  console.log(user.name.toUpperCase());
}

greet2({ name: 123 });
