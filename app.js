const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { nextTick } = require("process");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const team = [];
let teamTitle = "";

function initQuestions() {

    inquirer.prompt([

        {
            type: "input",
            name: "teamName",
            message: "What is your Team/Project Name?",
            default: "My Team"
        },


    ]).then(userChoice => {
        teamTitle = userChoice.teamName;
        addEmployee();
    })
}


function addEmployee() {
    inquirer.prompt([{

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
            type: "list",
            name: "employeeRole",
            message: "Please select employee's role",
            choices: ["Manager", "Engineer", "Intern"]
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
            },
            when: (userInput) => userInput.employeeRole === "Manager"
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
        if (userAnswers.employeeRole === "Manager") {
            const manager = new Manager(userAnswers.employeeName, userAnswers.employeeId, userAnswers.employeeEmail, userAnswers.officeNumber);
            team.push(manager);
        } else if (userAnswers.employeeRole === "Engineer") {
            const engineer = new Engineer(userAnswers.employeeName, userAnswers.employeeId, userAnswers.employeeEmail, userAnswers.gitHubUserName);
            team.push(engineer);
        } else if (userAnswers.employeeRole === "Intern") {
            const intern = new Intern(userAnswers.employeeName, userAnswers.employeeId, userAnswers.employeeEmail, userAnswers.internSchool);
            team.push(intern);
        }

        if (userAnswers.addEmployee === true) {
            addEmployee();
        } else {

            let main = fs.readFileSync(__dirname + '/templates/main.html', 'utf-8');
            main = main.replace(/{{teamTitle}}/g, teamTitle);


            let employeeCards = [];

            team.forEach(member => {
                const employee = member;
                employeeCards += renderEmployee(employee)
            });

            main = main.replace('{{team}}', team);

            fs.writeFileSync(__dirname + '/output/team.html', main);

        }




    })
}

function renderEmployee(employee) {
    if (employee.getRole() === "Manager") {

        let managerCard = fs.readFileSync(__dirname + "/templates/Manager.html", "utf-8");
        managerCard = managerCard.replace('{{name}}', employee.getName());
        managerCard = managerCard.replace('{{role}}', employee.getRole());
        managerCard = managerCard.replace('{{id}}', employee.getId());
        managerCard = managerCard.replace('{{email}}', employee.getEmail());
        managerCard = managerCard.replace('{{officeNumber}}', employee.getOfficeNumber());
        return managerCard;
    } else if (employee.getRole() === "Engineer") {
        let engineerCard = fs.readFileSync(__dirname + "/templates/Engineer.html", "utf-8");
        engineerCard = engineerCard.replace('{{name}}', employee.getName());
        engineerCard = engineerCard.replace('{{role}}', employee.getRole());
        engineerCard = engineerCard.replace('{{id}}', employee.getId());
        engineerCard = engineerCard.replace('{{email}}', employee.getEmail());
        engineerCard = engineerCard.replace('{{github}}', employee.getGithub());
        return engineerCard;
    } else if (employee.getRole() === "Intern") {
        let internCard = fs.readFileSync(__dirname + "/templates/Intern.html", "utf-8");
        internCard = internCard.replace('{{name}}', employee.getName());
        internCard = internCard.replace('{{role}}', employee.getRole());
        internCard = internCard.replace('{{id}}', employee.getId());
        internCard = internCard.replace('{{email}}', employee.getEmail());
        internCard = internCard.replace('{{school}}', employee.getSchool());
        return internCard;
    }
}


initQuestions();
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