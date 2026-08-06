# GlobalLogStore

1. Top Navigation & Wallet System:

Top header with the app title GlobalLogStore and a Wallet Card showing the user's available balance (e.g., $0.00).

A 'Fund Wallet' button inside the card that opens a modal for adding funds.

Navigation links to switch between two main pages: Dashboard and Marketplace.

2. Image Upload & Categorization (Upload Modal / Form):

Image Upload Zone: Drag-and-drop file uploader with a real-time image preview.

Category Dropdown: A styled select input labeled 'Category'. Each option must render its official brand logo/icon alongside the text:

Google, Facebook, TikTok, X (Twitter), Instagram, Outlook, and Other.

Description Field: A multi-line text area labeled 'Description' directly below the category dropdown.

Submit Action: An 'Upload Log' button that saves the post to the backend and routes the uploaded log to its designated marketplace category.

3. Marketplace Tab:

Horizontal, scrollable filter tabs at the top of the page representing each category (All, Google, Facebook, TikTok, X, Instagram, Outlook).

Clicking a tab filters the marketplace grid dynamically to display only logs posted under that specific category.

Display each log item as a sleek card featuring the image, category badge with logo, description, price/status, and user details.

4. Floating Curved Bottom Navigation Bar:

A floating, pill-shaped bottom navigation bar fixed at the bottom of the screen (rounded-full / capsule layout with glassmorphism blurred background).

Place a prominent '+' (Create/Upload) button centered in the middle of the bar. Clicking '+' opens the Upload Log modal directly.

Space out auxiliary navigation icons evenly to the left and right of the central '+' button (e.g., Home, Marketplace, Wallet, Profile).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a89663b1-c458-4019-b1b1-50aa2a531306).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
