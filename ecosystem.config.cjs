module.exports = {
  apps: [
    {
      name: "next-adwall", // Name of your app
      script: "npm",         // Use npm to start the app
      args: "start",         // This tells npm to run the "start" script
      interpreter: "none",   // No interpreter needed for npm (Next.js runs with Node.js)
      env: {
        NODE_ENV: "production", // Set the environment variable to production
        PORT: 3002             // Set a custom port if you need one
      }
    }
  ]
}