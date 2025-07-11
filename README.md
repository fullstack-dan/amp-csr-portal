# amp-csr-portal

This is a customer service representative (CSR) portal built with React, Supabase, and Tailwind CSS. The portal allows CSRs to manage user information, vehicle subscriptions, purchase history, and customer service requests (CSR requests). It is designed to be responsive and works on mobile devices.

## Progress

### Monday

I started with creating some data structures and a mock API to simulate the backend. I can usually build better when I have an idea of the data flow and structure. I also set up the basic routing and navigation structure. Next, I mocked some users and CSR requests. I built the overall dashboard layout, including the sidebar, home page, and the seperate user page. User search is also functional. The mock API has delay simulation, so I was able to test loading states. With all of that, the R in CRUD is done for the most part.

### Tuesday

Today I focused on the U in CRUD. I added pages for viewing individual users and request details. I then implemented in place editing for the users and wrote a modal for updating and taking action on csr requests. I also added a loading state for the user search and request details. The user profile page is now fully functional, allowing CSRs to view and edit customer information and CSR requests. Next, I'll focus on adding purchase history and vehicle subscriptions to customer information, as well as going through my code and clearing up inconsitencies (like users vs customers).

I had a little extra time Tuesday night (caffeine induced insomnia), so I went ahead and wrote a model and generated some example data for vehicle subscriptions. I added that view to the user details page, as well as added a panel for quickly seeing a user's currently open requests. At this point, I had the thought of changing CSR "requests" to CSR "tickets", but I've already migrated and I'm in far too deep at this point.

### Wednesday, Thursday

I spent these two days working on the vehicle subscriptions. I added a view to the User details page for viewing and removing subscriptions, as well as a modal for adding new subscriptions. I did some work on purchase history as well. A lot of my time was spent trying to figure out the sql queries to get the data I needed, as well as trying to figure out how to best display it. I also did a complete design and styling overhaul, because the app was feeling a little flat.

### Friday

I finished all of the required features for the CSR portal. Did a lot of work on mobile app fixes and styling as well, making sure it was responsive and components resized properly. Lastly, I went through and did some better error handling and messaging for all of my forms.

## Features

-   **User management**: View, edit, and manage user information and CSR requests.
-   **Vehicle subscriptions**: View and manage vehicle subscriptions for each user. CSRs can transfer, pause, cancel, delete and add new subscriptions.
-   **Purchase histor**y: View a user's purchase history and related details.
-   **Customer Service Requests**: View and manage CSR requests, including taking actions on them.
-   **Responsive design**: The application is fully responsive and works on mobile devices.
-   **Error handling**: Improved error handling and messaging throughout the application.
-   **Responsive search**: Search for users and CSR requests with fuzzy search capabilities.

## Technologies Used

-   **React**: everyone knows this one
-   **Supabase**: backend API and database
-   **Tailwind CSS**: styling and responsive design
-   **daisyUI**: UI components and styling
-   **Lucide Icons**: icons
-   **Vite**: live development and build process

Deployed on [Render](https://amp-csr-portal-f9gu.onrender.com/)
