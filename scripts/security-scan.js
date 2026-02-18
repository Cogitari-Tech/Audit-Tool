const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const files = args.length > 0 ? args : [];

console.log("Running Security Scan...");

let hasError = false;

// 1. Check for .env files
const envFiles = files.filter(
  (f) => path.basename(f).startsWith(".env") && !f.endsWith(".example"),
);
if (envFiles.length > 0) {
  console.error("❌ SECURITY ERROR: Attempting to commit .env files:");
  envFiles.forEach((f) => console.error(`   - ${f}`));
  hasError = true;
}

// 2. Check for basic secrets in staged files (naive check)
// Patterns:
// - sk- (OpenAI/Stripe keys often start with sk_)
// - ghp_ (GitHub tokens)
// - eyJ (JWTs)
// - AWS keys (AKIA...)
const secretPatterns = [
  { name: "Stripe/OpenAI Key", regex: /sk_[live|test]_\w{10,}/ },
  { name: "GitHub Token", regex: /ghp_\w{10,}/ },
  { name: "JWT Token", regex: /eyJ[a-zA-Z0-9_-]{10,}\./ },
  { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/ },
  {
    name: "Private Key",
    regex: new RegExp("-----BEGIN " + "PRIVATE KEY-----"),
  },
];

files.forEach((file) => {
  try {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      // Skip binary files if possible or check only text extensions
      const ext = path.extname(file);
      if (
        [".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf", ".zip"].includes(ext)
      )
        return;

      const content = fs.readFileSync(file, "utf-8");

      secretPatterns.forEach((pattern) => {
        if (pattern.regex.test(content)) {
          console.error(
            `❌ SECURITY WARNING: Potential ${pattern.name} found in ${file}`,
          );
          // Don't fail immediately on warning to allow review, or fail strict?
          // Let's fail strict for now as requested "security precommit"
          hasError = true;
        }
      });
    }
  } catch (e) {
    // Ignore read errors for deleted files
  }
});

if (hasError) {
  console.error(
    "⛔ Security check failed. Please remove secrets or .env files before committing.",
  );
  process.exit(1);
} else {
  console.log("✅ Security check passed.");
}
