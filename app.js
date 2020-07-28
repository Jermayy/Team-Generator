const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


const team = [];


function createManager() {
    inquirer.prompt([{

            type: "input",
            name: "managerName",
            message: "Please enter manager's full name",
            validate: (nameInput) => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("manager must have a name");
                    return false;
                }
            }
        },

        {

            type: "input",
            name: "managerId",
            message: "Please enter manager's ID number",
            validate: (idInput) => {
                if (idInput) {
                    return true;
                } else {
                    console.log("Manager must have an ID number");
                    return false;
                }
            }
        },
        {

            type: "input",
            name: "managerEmail",
            message: "Please enter manager's Email Address",
            validate: (idInput) => {
                if (idInput) {
                    return true;
                } else {
                    console.log("Manager must have an Email Address");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "officeNumber",
            message: "Please enter Manager's office phone number",
            validate: (number) => {
                if (number) {
                    return true;
                } else {
                    console.log("Must enter an office phone number");
                    return false;
                }
            }
        }
    ]).then(({ managerName, managerId, managerEmail, officeNumber }) => {


        const manager = new Manager(
            managerName, managerId, managerEmail, officeNumber
        );
        team.push(manager);
        addEmployee();
    })

}

function addEmployee() {
    inquirer.prompt([{
            type: "list",
            name: "employeeRole",
            message: "Please select employee's role",
            choices: ["Engineer", "Intern"]
        },

        {

            type: "input",
            name: "employeeName",
            message: "Please enter employee's full name",
            validate: (nameInput) => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Employee must have a name");
                    return false;
                }
            }
        },

        {

            type: "input",
            name: "employeeId",
            message: "Please enter employee's ID number",
            validate: (idInput) => {
                if (idInput) {
                    return true;
                } else {
                    console.log("Employee must have an ID number");
                    return false;
                }
            }
        },
        {

            type: "input",
            name: "employeeEmail",
            message: "Please enter employee's Email Address",
            validate: (idInput) => {
                if (idInput) {
                    return true;
                } else {
                    console.log("Employee must have an Email Address");
                    return false;
                }
            }
        },

        {

            type: "input",
            name: "gitHubUserName",
            message: "Please enter Engineer's GitHub Username",
            validate: (username) => {
                if (username) {
                    return true;
                } else {
                    console.log("Must enter Engineer's GitHub Username");
                    return false;
                }
            },
            when: (userInput) => userInput.employeeRole === "Engineer"
        },
        {

            type: "input",
            name: "internSchool",
            message: "Please enter Intern's School",
            validate: (school) => {
                if (school) {
                    return true;
                } else {
                    console.log("Must enter Intern's school");
                    return false;
                }
            },
            when: (userInput) => userInput.employeeRole === "Intern"
        },

        {
            type: "confirm",
            name: "addEmployee",
            Message: "Would you like you add another team member? (Yes/No)" // If no, render HTML
        }
    ]).then(userAnswers => {

        if (userAnswers.employeeRole === "Engineer") {
            const engineer = new Engineer(
                userAnswers.employeeName,
                userAnswers.employeeId,
                userAnswers.employeeEmail,
                userAnswers.gitHubUserName
            );
            team.push(engineer);
            console.log(team);
        }
        if (userAnswers.employeeRole === "Intern") {
            const intern = new Intern(
                userAnswers.employeeName,
                userAnswers.employeeId,
                userAnswers.employeeEmail,
                userAnswers.internSchool
            );
            team.push(intern);
            console.log(team);
        }



        if (userAnswers.addEmployee === true) {
            addEmployee();
        } else {

            fs.writeFile(outputPath, render(team), err => {
                if (err) {
                    throw err;
                }
                console.log("Successful!");
            })
        }




    })
}

createManager();


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)




// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```