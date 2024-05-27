# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Resources

- [Brief](https://fed-vocational-astro-course.vercel.app/en/project-exam-2/brief)
- [Design](https://www.figma.com/design/NS9mrJwo5tOgO8BqBIamNF/Holidaze-Exam?node-id=0-1&t=Wr40zOHupZgCzTi4-0)
- [Production deploy](https://holidaze-ss.netlify.app/)
- [API Docs](https://docs.noroff.dev/docs/v2/holidaze/bookings)

## Report

## Introduction
For my exam project, I was given the exciting task of developing a brand new front end for Holidaze, a recently launched accommodation booking site. The goal was to create a user-friendly experience for both customers looking to book holidays and venue managers managing their properties. With a list of required features and user stories as my guide, I set out to design and build a modern, functional application.

## Project Requirements and Implementation
The project requirements were clearly outlined in the form of user stories. Here's how I tackled each one:

1. **Viewing Venues:**
   - I designed a main page where users can see a list of available venues, making it easy to browse options.
   - I added a search bar so users can quickly find specific venues by name or location.

2. **Venue Details:**
   - Clicking on a venue takes users to a detailed page with all the information about that venue, including photos and a calendar of available dates.

3. **User Registration and Authentication:**
   - I made sure users with `stud.noroff.no` emails can register as customers or venue managers.
   - I included login and logout functionality, and allowed users to update their profile pictures to personalize their accounts.

4. **Booking System:**
   - Registered customers can make bookings and view their upcoming trips easily.
   - The booking system is integrated with the venue’s availability calendar to prevent double bookings.

5. **Venue Management:**
   - Venue managers can create new venues, update details of existing ones, and delete venues they no longer manage.
   - Managers can also view and manage all bookings related to their venues.

## Design and User Experience
The design was a crucial part of this project. I wanted to ensure the site was easy to navigate and visually appealing. Here’s how I approached it:

- **Responsive Design:** The site looks and works great on all devices, whether you’re on a desktop, tablet, or smartphone.
- **Intuitive Navigation:** I kept the navigation simple so users can easily find what they’re looking for.
- **Professional Branding:** I worked with a design company in Bodø to create a professional logo, which added a polished touch to the site.

## Technologies and Tools
To build this project, I used some key tools and technologies:

- **React:** This helped me build a dynamic and responsive user interface.
- **Framer Motion:** I used this to add smooth animations, making the site feel more interactive and engaging.
- **Tailwind CSS:** This made styling the site straightforward and ensured it was responsive.

## Challenges and Solutions
The project came with its challenges, but each one taught me something valuable:

- **API Integration:** Connecting the site to the Holidaze API and handling data smoothly was tricky, but with thorough testing and debugging, I managed to get it working seamlessly.
- **User Experience:** Ensuring the site was easy to use for both customers and venue managers required a lot of feedback and iteration. I made adjustments based on user feedback to improve the experience.

## Conclusion
Working on the Holidaze front end was a rewarding experience. I managed to create a modern, user-friendly application that meets all the client’s requirements. The collaboration with the Bodø-based design company for the logo added a professional touch, and the final product is something I’m proud of. This project not only enhanced my technical skills but also taught me the importance of user experience and professional design in web development.


## Getting Started

In the project directory, you can run:

- install the project node module dependencies $`npm i`
- Runs the app in the development mode. `npm run dev`

## Authors

- Sander Selfors (@sanderselfors)