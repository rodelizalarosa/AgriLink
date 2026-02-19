await fetch("https://osgogrbrjlnslgdinhgl.supabase.co/functions/v1/resend-email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": "YOUR_SUPABASE_ANON_KEY"
  },
  body: JSON.stringify({
    type: "invite",
    name: "John Doe",
    to: "john@example.com",
    tempPassword: "TempPassword123",
    link: "https://agrilink.com/setup"
  })
});