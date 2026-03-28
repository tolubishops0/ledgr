Login method enforcement

Users can only log in using the method they originally signed up with (manual vs Google).
Middleware ensures that a matching profile exists before rendering the dashboard, preventing redirect loops.
Makes the dashboard always receive a valid profile and keeps the auth flow stable.
