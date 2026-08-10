// catalog.js — tech badge catalog (shields.io) + socials config

// Each tech: { color (hex no #), logo (simple-icons slug), logoColor }
// Badge URL built later. logoColor defaults to "white".
const TECH = {
  "Languages": {
    "JavaScript": { color: "F7DF1E", logo: "javascript", logoColor: "black" },
    "TypeScript": { color: "3178C6", logo: "typescript" },
    "Python":     { color: "3776AB", logo: "python" },
    "Java":       { color: "ED8B00", logo: "openjdk" },
    "C++":        { color: "00599C", logo: "cplusplus" },
    "C#":         { color: "239120", logo: "csharp" },
    "C":          { color: "A8B9CC", logo: "c", logoColor: "black" },
    "Go":         { color: "00ADD8", logo: "go" },
    "Rust":       { color: "000000", logo: "rust" },
    "Ruby":       { color: "CC342D", logo: "ruby" },
    "PHP":        { color: "777BB4", logo: "php" },
    "Swift":      { color: "F05138", logo: "swift" },
    "Kotlin":     { color: "7F52FF", logo: "kotlin" },
    "Dart":       { color: "0175C2", logo: "dart" },
    "Scala":      { color: "DC322F", logo: "scala" },
    "Elixir":     { color: "4B275F", logo: "elixir" },
    "Lua":        { color: "2C2D72", logo: "lua" },
    "R":          { color: "276DC3", logo: "r" },
    "Haskell":    { color: "5D4F85", logo: "haskell" },
    "Perl":       { color: "39457E", logo: "perl" },
    "HTML5":      { color: "E34F26", logo: "html5" },
    "CSS3":       { color: "1572B6", logo: "css3" },
    "Sass":       { color: "CC6699", logo: "sass" },
    "SQL":        { color: "4479A1", logo: "mysql" },
    "Bash":       { color: "4EAA25", logo: "gnubash" },
    "Solidity":   { color: "363636", logo: "solidity" },
  },
  "Frameworks & Libraries": {
    "React":        { color: "20232A", logo: "react", logoColor: "61DAFB" },
    "Next.js":      { color: "000000", logo: "nextdotjs" },
    "Vue.js":       { color: "35495E", logo: "vuedotjs", logoColor: "4FC08D" },
    "Nuxt":         { color: "00DC82", logo: "nuxtdotjs", logoColor: "black" },
    "Angular":      { color: "DD0031", logo: "angular" },
    "Svelte":       { color: "FF3E00", logo: "svelte" },
    "Astro":        { color: "BC52EE", logo: "astro" },
    "Remix":        { color: "000000", logo: "remix" },
    "Solid.js":     { color: "2C4F7C", logo: "solid" },
    "Node.js":      { color: "339933", logo: "nodedotjs" },
    "Deno":         { color: "000000", logo: "deno" },
    "Express":      { color: "000000", logo: "express" },
    "NestJS":       { color: "E0234E", logo: "nestjs" },
    "Django":       { color: "092E20", logo: "django" },
    "Flask":        { color: "000000", logo: "flask" },
    "FastAPI":      { color: "009688", logo: "fastapi" },
    "Spring":       { color: "6DB33F", logo: "spring" },
    "Laravel":      { color: "FF2D20", logo: "laravel" },
    "Rails":        { color: "CC0000", logo: "rubyonrails" },
    ".NET":         { color: "512BD4", logo: "dotnet" },
    "Flutter":      { color: "02569B", logo: "flutter" },
    "React Native": { color: "20232A", logo: "react", logoColor: "61DAFB" },
    "Electron":     { color: "47848F", logo: "electron" },
    "Tailwind CSS": { color: "06B6D4", logo: "tailwindcss" },
    "Bootstrap":    { color: "7952B3", logo: "bootstrap" },
    "Vite":         { color: "646CFF", logo: "vite" },
    "jQuery":       { color: "0769AD", logo: "jquery" },
    "Redux":        { color: "764ABC", logo: "redux" },
    "GraphQL":      { color: "E10098", logo: "graphql" },
    "PyTorch":      { color: "EE4C2C", logo: "pytorch" },
    "TensorFlow":   { color: "FF6F00", logo: "tensorflow" },
    "pandas":       { color: "150458", logo: "pandas" },
    "NumPy":        { color: "013243", logo: "numpy" },
  },
  "Databases": {
    "PostgreSQL": { color: "4169E1", logo: "postgresql" },
    "MySQL":      { color: "4479A1", logo: "mysql" },
    "MariaDB":    { color: "003545", logo: "mariadb" },
    "MongoDB":    { color: "47A248", logo: "mongodb" },
    "Redis":      { color: "DC382D", logo: "redis" },
    "SQLite":     { color: "003B57", logo: "sqlite" },
    "Firebase":   { color: "FFCA28", logo: "firebase", logoColor: "black" },
    "Supabase":   { color: "3FCF8E", logo: "supabase", logoColor: "black" },
    "Prisma":     { color: "2D3748", logo: "prisma" },
    "Elasticsearch": { color: "005571", logo: "elasticsearch" },
    "DynamoDB":   { color: "4053D6", logo: "amazondynamodb" },
  },
  "Cloud & DevOps": {
    "AWS":            { color: "232F3E", logo: "amazonwebservices" },
    "Azure":          { color: "0078D4", logo: "microsoftazure" },
    "Google Cloud":   { color: "4285F4", logo: "googlecloud" },
    "Docker":         { color: "2496ED", logo: "docker" },
    "Kubernetes":     { color: "326CE5", logo: "kubernetes" },
    "Terraform":      { color: "7B42BC", logo: "terraform" },
    "Ansible":        { color: "EE0000", logo: "ansible" },
    "GitHub Actions": { color: "2088FF", logo: "githubactions" },
    "Jenkins":        { color: "D24939", logo: "jenkins" },
    "Vercel":         { color: "000000", logo: "vercel" },
    "Netlify":        { color: "00C7B7", logo: "netlify" },
    "Cloudflare":     { color: "F38020", logo: "cloudflare" },
    "Heroku":         { color: "430098", logo: "heroku" },
    "DigitalOcean":   { color: "0080FF", logo: "digitalocean" },
    "Nginx":          { color: "009639", logo: "nginx" },
  },
  "Tools": {
    "Git":      { color: "F05032", logo: "git" },
    "GitHub":   { color: "181717", logo: "github" },
    "GitLab":   { color: "FC6D26", logo: "gitlab" },
    "VS Code":  { color: "007ACC", logo: "vscodium" },
    "Neovim":   { color: "57A143", logo: "neovim" },
    "IntelliJ IDEA": { color: "000000", logo: "intellijidea" },
    "Figma":    { color: "F24E1E", logo: "figma" },
    "Postman":  { color: "FF6C37", logo: "postman" },
    "Linux":    { color: "FCC624", logo: "linux", logoColor: "black" },
    "Vim":      { color: "019733", logo: "vim" },
    "Jira":     { color: "0052CC", logo: "jira" },
    "Notion":   { color: "000000", logo: "notion" },
    "Slack":    { color: "4A154B", logo: "slack" },
    "Webpack":  { color: "8DD6F9", logo: "webpack", logoColor: "black" },
    "Vitest":   { color: "6E9F18", logo: "vitest" },
    "Jest":     { color: "C21325", logo: "jest" },
  },
};

// Socials: { label, logo, color, prefix (prepended if value isn't a full url), placeholder }
const SOCIALS = {
  linkedin:  { label: "LinkedIn", logo: "linkedin", color: "0A66C2", prefix: "https://linkedin.com/in/", placeholder: "your-handle", input: "LinkedIn username or URL" },
  x:         { label: "X",        logo: "x",        color: "000000", prefix: "https://x.com/",            placeholder: "yourhandle",  input: "X / Twitter handle" },
  instagram: { label: "Instagram",logo: "instagram",color: "E4405F", prefix: "https://instagram.com/",    placeholder: "yourhandle",  input: "Instagram username" },
  tiktok:    { label: "TikTok",   logo: "tiktok",   color: "000000", prefix: "https://tiktok.com/@",      placeholder: "yourhandle",  input: "TikTok username" },
  youtube:   { label: "YouTube",  logo: "youtube",  color: "FF0000", prefix: "https://youtube.com/@",     placeholder: "channel",     input: "YouTube channel" },
  pinterest: { label: "Pinterest",logo: "pinterest",color: "BD081C", prefix: "https://pinterest.com/",    placeholder: "yourhandle",  input: "Pinterest username" },
  devto:     { label: "Dev.to",   logo: "devdotto", color: "0A0A0A", prefix: "https://dev.to/",           placeholder: "username",    input: "Dev.to username" },
  website:   { label: "Portfolio",logo: "googlechrome", color: "4285F4", prefix: "https://",              placeholder: "yoursite.com",input: "Website URL" },
  email:     { label: "Email",    logo: "gmail",    color: "EA4335", prefix: "mailto:",                   placeholder: "you@email.com",input: "Email address" },
};

// shields.io label escaping: -- for dash, __ for underscore, then URL-encode
// the rest (handles #, +, spaces, etc. → C#, C++, Tailwind CSS all work).
function shEscape(s) {
  return encodeURIComponent(s.replace(/_/g, "__").replace(/-/g, "--"));
}

function badgeUrl(label, cfg, style) {
  const lc = cfg.logoColor || "white";
  return `https://img.shields.io/badge/${shEscape(label)}-${cfg.color}?style=${style}&logo=${cfg.logo}&logoColor=${lc}`;
}

window.TECH = TECH;
window.SOCIALS = SOCIALS;
window.shEscape = shEscape;
window.badgeUrl = badgeUrl;
