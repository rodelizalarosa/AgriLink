// testEmail.js
const sendTestEmail = async () => {
  try {
    const response = await fetch(
      "https://osgogrbrjlnslgdinhgl.supabase.co/functions/v1/resend-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "rodeliza.2002@gmail.com",
          subject: "Welcome to AgriLink!",
          html: `<h1>Hello Test User</h1>
                 <p>This is a test email from our company Gmail account.</p>`
        })
      }
    );

    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

sendTestEmail();
