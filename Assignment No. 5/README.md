# Assignment 5: Git and GitHub

## Aim
To create a local Git repository, connect it to a GitHub repository, and upload project files using Git commands.

## Software Requirements
- Git
- GitHub account
- Visual Studio Code
- Web browser

## Procedure and Git Commands

### Step 1: Create a Project Folder
Create a folder named `Assignment-5-Git` and open it in VS Code.

Create a sample file named `index.html`.

### Step 2: Initialize the Local Repository
```bash
git init
```

### Step 3: Check Repository Status
```bash
git status
```

### Step 4: Add Files to the Staging Area
```bash
git add .
```

### Step 5: Commit the Files
```bash
git commit -m "Initial commit for Assignment 5"
```

### Step 6: Configure Git Identity (If Required)
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Step 7: Create a GitHub Repository
Create a new repository on GitHub named `Assignment-5-Git`. Copy its HTTPS URL.

### Step 8: Connect the Local Repository to GitHub
Replace the example URL with your actual repository URL.

```bash
git remote add origin https://github.com/YOUR-USERNAME/Assignment-5-Git.git
```

### Step 9: Rename the Branch to Main
```bash
git branch -M main
```

### Step 10: Push Files to GitHub
```bash
git push -u origin main
```

### Step 11: Verify the Remote Repository
```bash
git remote -v
git status
git log --oneline
```

## Additional Git Commands

Check repository status:
```bash
git status
```

View commit history:
```bash
git log
```

Add a specific file:
```bash
git add index.html
```

Commit new changes:
```bash
git commit -m "Update project files"
```

Upload later commits:
```bash
git push
```

Download and integrate remote changes:
```bash
git pull
```

## Result
Successfully created a local Git repository, connected it to a GitHub repository, and uploaded project files using Git commands.