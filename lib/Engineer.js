const Employee = require("./Employee");

// TODO: Write code to define and export the Engineer class.  HINT: This class should inherit from Employee.
class Engineer extends Employee {
    constructor(name, id, email, githubUser) {
        super(name, id, email);

        this.githubUser = githubUser;

    }
    getGithub() {
        return this.githubUser;
    }

    getRole() {
        return "Engineer";
    }
}

module.exports = Engineer;