# Task Tracker CLI

This project is created to learn basic javascript.
A simple command-line interface (CLI) application to track and manage your tasks.

**Project URL:** https://roadmap.sh/projects/task-tracker

## Features

- Add, update, and delete tasks
- Mark tasks as in progress or done
- List all tasks or filter by status

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd task-cli
```

2. Install dependencies (if any):
```bash
npm install
```

3. Make the CLI executable and link it globally:
Windows (run as Administrator if needed)
```bash
npm link
```

Linux/Mac
```bash
chmod +x task-cli.js
npm link
```

## Usage

After linking, you can run the task tracker from anywhere:
```bash
# Add a new task
task-cli add "Buy groceries"

# Update a task
task-cli update 1 "Buy groceries and cook dinner"

# Delete a task
task-cli delete 1

# Mark a task as in progress
task-cli mark-in-progress 1

# Mark a task as done
task-cli mark-done 1

# List all tasks
task-cli list

# List tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
```

Alternatively, run directly with Node.js:

```bash
node task-cli.js add "Buy groceries"
```

## Requirements

- Node.js (v14 or higher)

## License

MIT
