# GitHub Setup Instructions for NoMoSlido

Follow these steps to push your NoMoSlido project to GitHub:

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Enter a repository name (e.g., "nomoslido")
3. Add a description (optional)
4. Choose if you want it to be public or private
5. Do NOT initialize with a README, .gitignore, or license (since we've already created these files)
6. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

Copy the URL of your newly created repository, then run these commands in your terminal:

```bash
# Add GitHub as a remote called "origin"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git

# Rename your main branch to "main" if needed (likely already done)
git branch -M main

# Push your local repository to GitHub
git push -u origin main
```

If you're using a personal access token or SSH for authentication:

### Using HTTPS with a Personal Access Token:

```bash
git remote add origin https://YOUR-USERNAME:YOUR-TOKEN@github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
git branch -M main
git push -u origin main
```

### Using SSH:

Make sure you've set up an SSH key with GitHub first, then:

```bash
git remote add origin git@github.com:YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Verify Your Repository

After pushing, refresh your GitHub repository page in your browser to see your files online.

## Using GitHub CLI (Alternative Method)

If you have GitHub CLI installed:

```bash
# Authenticate if you haven't already
gh auth login

# Create a new repository
gh repo create YOUR-REPOSITORY-NAME --private --source=. --remote=origin

# Push your code
git push -u origin main
```

## Common Issues

### Authentication Failed

If you see an authentication error, you might need to:
1. Use a personal access token instead of your password
2. Configure credential caching: `git config --global credential.helper cache`
3. Use SSH authentication instead of HTTPS

### "Repository Not Found"

Double-check that:
1. The repository exists on GitHub
2. You're using the correct URL
3. You have access to the repository (if it's in an organization)
4. Your GitHub username and repository name are spelled correctly

### "Remote Already Exists"

If you see "remote origin already exists", you can remove it and add again:
```bash
git remote remove origin
git remote add origin YOUR-REPOSITORY-URL
``` 