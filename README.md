This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Tech Stack

Framework: Next.js (v14+) with App Router

Language: TypeScript

Styling: Tailwind CSS

State Management: Zustand

API Stubs: Next.js API routes

Visualization: Chart.js (planned)



eeg-cloud-frontend/
├── app/
│   ├── (flow)/         # Flow pages and layout
│   │   ├── layout.tsx   # Flow stepper and shared UI
│   │   ├── page.tsx     # Welcome page at /flow
│   │   ├── account/     # Login page at /flow/account
│   │   │   └── page.tsx
│   │   ├── step1/       # Personal Information step
│   │   │   └── page.tsx
│   │   └── step2/       # Survey & visualization step
│   │       └── page.tsx
│   ├── api/             # Next.js API route stubs
│   │   └── auth/
│   │       └── login/route.ts
│   ├── components/      # Shared UI components
│   │   ├── Stepper.tsx
│   │   └── ...
│   └── styles/
│       └── globals.css
├── public/              # Static assets
├── src/
│   └── stores/          # Zustand global store
│       └── useStore.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md            # You are here




Routing & Pages

/flow → Welcome Page (WelcomePage)

/flow/account → Log In Page (LoginPage)

/flow/participantinfo → Personal Information form (Step1)

/flow/survey → Survey & Result (Step2)

Each flow page is wrapped by a shared FlowLayout that renders the Stepper