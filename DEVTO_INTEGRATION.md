# DEV.to Integration Guide

Profile Studio provides two complementary DEV.to integrations:

1. **Browser Preview** — displays your latest DEV.to articles while building your profile.
2. **GitHub Actions Automation** — automatically keeps the DEV.to section of your GitHub profile README up to date.

---

## 1. Browser Preview

The browser preview uses the public DEV.to API to display your latest articles.

### How to use

1. Open the **Add-ons** step in Profile Studio.
2. Enable **DEV.to articles**.
3. Enter your DEV.to username.
4. Set the number of posts to display.
5. Your latest DEV.to articles will appear in the preview.

The username can be entered as either:

```text
yourname

or:

<https://dev.to/yourname>
```

### **Features**

- Live DEV.to article preview
- Cover images when available
- Article titles
- Article descriptions
- Publication dates
- Article tags
- Responsive article cards
- Dark and light mode support
- Safe URL handling
- Graceful handling of API errors
- Configurable number of posts

## 2. DEV.to GitHub Automation

Profile Studio can generate a GitHub Actions package that automatically updates the DEV.to section of your GitHub profile README.

The generated package contains:

.github/

├── profile-studio.json

├── scripts/

│ └── update-devto.js

└── workflows/

└── devto-readme.yml

## How the automation works

The automation runs inside your **GitHub profile repository**.

For example:

```
CloudFay/CloudFay
```

or, for another user:

```
username/username
```
The workflow does not contain a hard-coded GitHub username.

Instead, GitHub Actions checks out the repository where the workflow is installed.

Therefore the same generated package can be used by different users.

# **3\. README Markers**

The automation only modifies the section between these two markers:

&lt;!-- DEVTO:START --&gt;

&lt;!-- DEVTO:END --&gt;

Add them to your GitHub profile README where you want the DEV.to section to appear.

For example:

```
 Hi, I'm Your Name 👋

I'm a developer building things with cloud technologies.

&lt;!-- DEVTO:START --&gt;

&lt;!-- DEVTO:END --&gt;

 Projects
```

...

Everything outside these markers is left untouched.

# 4. Generated Configuration

Profile Studio generates:

.github/profile-studio.json

Example:
```
{

"devto": {

"post_count": 5,

"username": "your-devto-username",

"enabled": true,

"automation": true

}

}
```

### Configuration fields

| Field | Description |
| --- | --- |
| `username` | Your DEV.to username |
| `post_count` | Number of articles to display |
| `enabled` | Enables DEV.to integration |
| `automation` | Enables GitHub Actions automation |


post_count supports values from:
```
1–20
```

# 5. Installing the Automation Package

After enabling DEV.to automation in Profile Studio:

1. Download the **DEV.to package**.
2. Extract the ZIP file.
3. Copy the .github directory into your GitHub profile repository.
4. Make sure the repository contains your profile README.md.
5. Commit and push the files.
6. Open the repository's **Actions** tab.
7. Select **Update DEV.to Articles**.
8. Run the workflow manually for the first test.

Your repository should look similar to:
```
your-profile-repository/

├── .github/

│ ├── profile-studio.json

│ ├── scripts/

│ │ └── update-devto.js

│ └── workflows/

│ └── devto-readme.yml

└── README.md
```

# 6. What the GitHub Action Does

The workflow:

1. Checks out the profile repository.
2. Installs Node.js 20.
3. Reads .github/profile-studio.json.
4. Fetches the latest DEV.to articles using the DEV.to API.
5. Selects the configured number of articles.
6. Generates the DEV.to README section.
7. Replaces only the content between the DEV.to markers.
8. Commits the change if the README changed.
9. Pushes the update back to the profile repository.

The workflow runs automatically once per day.

It can also be started manually from GitHub Actions.

# 7. Manual Workflow Trigger

To manually run the automation:

1. Open your GitHub profile repository.
2. Select **Actions**.
3. Select **Update DEV.to Articles**.
4. Click **Run workflow**.

This is useful when testing the installation or when you want to update the README immediately.

# 8. Example Generated README Section

The automation generates a section similar to:

![Dev.to Section](image.png)

&lt;!-- DEVTO:END --&gt;

The exact content depends on the articles returned by DEV.to.

# **9\. Security and Safety**

The integration validates external URLs before placing them into generated HTML.

Article URLs and cover-image URLs are restricted to:

```
http://

https://
```

Unsafe schemes such as:
```
javascript:

data:
```
are rejected.

Article titles, descriptions, tags, and author information are HTML-escaped before being inserted into the generated README section.

# **10\. Troubleshooting**

## **DEV.to articles do not appear**

Check:

- DEV.to username is correct.
- DEV.to integration is enabled.
- You have published at least one DEV.to article.
- The browser has network access.
- Check the browser console for API errors.

## **GitHub Action fails with "README.md not found"**

Make sure the workflow is installed in your GitHub profile repository and that the repository contains:

README.md

## **GitHub Action reports "DEV.to README markers were not found"**

Make sure your profile README contains:

&lt;!-- DEVTO:START --&gt;

&lt;!-- DEVTO:END --&gt;

The markers must appear in that exact order.

## **The wrong part of the README was changed**

The automation only replaces the content between:

&lt;!-- DEVTO:START --&gt;

and:

&lt;!-- DEVTO:END --&gt;

Everything outside those markers remains untouched.

## **GitHub Action cannot push changes**

Check that the workflow contains:

permissions:

contents: write

The workflow uses the repository's GitHub Actions token to commit and push the generated README update.

# **11\. Architecture**

![Project Architecture](image.png)