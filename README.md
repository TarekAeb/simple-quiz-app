# 🎮 Algerian Quiz Game

A real-time interactive quiz application with turn-based and buzzer rounds, perfect for educational events and competitions. Built with React, TypeScript, PeerJS for real-time communication, and Tailwind CSS for styling.

![Algeria Quiz Game](https://i.imgur.com/n6Lft1h.png)

## 🌟 Features

- **Two Game Phases**:
  - **Phase 1**: Turn-based questions with 30-second time limit
  - **Phase 2**: Buzzer round where fastest team gets to answer
  
- **Real-time Multiplayer**:
  - Host view for moderator/presenter
  - Team views on separate devices
  - P2P communication (no server required)
  
- **Team Management**:
  - QR code generation for easy joining
  - Password protection for teams
  - Real-time connection status
  
- **Interactive UI**:
  - Animated components with Framer Motion
  - Responsive design works on all devices
  - Algerian-themed color scheme
  
- **Game Mechanics**:
  - Automatic scoring system
  - 8-second answer time after buzzing
  - Auto-skip for teams who don't answer after buzzing

## 🛠️ Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Real-time Communication**: PeerJS (WebRTC)
- **QR Codes**: qrcode.react
- **Routing**: React Router
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 14.x or higher
- npm or yarn

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TarekAeb/algerian-quiz-game.git
   cd algerian-quiz-game
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

You can customize the quiz by editing the question data in:
- `src/data/questions.ts`

```typescript
// Example of question format
export const phase1Questions: Question[] = [
  {
    text: "What is the capital of Algeria?",
    options: ["Oran", "Algiers", "Constantine", "Annaba"],
    correctIndex: 1
  },
  // More questions...
];
```

## 📱 Usage Guide

### For the Quiz Host/Moderator

1. **Setup the Game**:
   - Open the app on the main display (computer/projector)
   - Enter the moderator password
   - Configure team names

2. **Phase 1 (Turn-based)**:
   - Teams take turns answering questions
   - Each team has 30 seconds to answer
   - Correct answers earn 10 points

3. **Phase 2 (Buzzer Round)**:
   - Teams scan their QR codes to join on their devices
   - Questions appear on the main screen
   - First team to buzz in gets to answer
   - Teams have 8 seconds to answer after buzzing
   - Use the "Skip Team" button if needed

4. **Results**:
   - Final scores are displayed at the end
   - Option to play again with same teams

### For Team Players

1. **Join the Game**:
   - Scan the QR code for your team
   - Enter your team name and the password (provided by host)

2. **During Phase 1**:
   - Watch the main screen for questions
   - Answer only when it's your team's turn

3. **During Phase 2**:
   - Press the buzzer button when you know the answer
   - You have 8 seconds to answer after buzzing
   - Answer correctly to earn points

## 🌐 Deployment

### Deploying to Netlify

1. Create a `_redirects` file in the `public` folder with:
   ```
   /* /index.html 200
   ```

2. Build the project:
   ```bash
   npm run build
   # or
   yarn build
   ```

3. Deploy using Netlify CLI or connect your GitHub repository to Netlify for automatic deployments.

## ⚠️ Troubleshooting

### Common Issues

1. **PeerJS Connection Issues**:
   - Make sure all devices are on the same network
   - Check firewall settings
   - Try using the `/peerdebug` route to test connections

2. **"Page Not Found" Errors**:
   - Ensure your `_redirects` file is properly set up for Netlify
   - Check that all routes are correctly defined in App.tsx

3. **QR Codes Not Working**:
   - Verify the URL in the QR code matches your deployment
   - Ensure device cameras have permission to scan

## 🧩 Project Structure

```
src/
├── components/        # React components
│   ├── Game.tsx       # Main game component
│   ├── Phase1Screen.tsx
│   ├── Phase2Screen.tsx
│   ├── TeamBuzzer.tsx
│   └── TeamLogin.tsx
├── services/          # Service classes
│   └── BuzzerService.ts
├── lib/               # Utility functions and types
├── data/              # Question data
└── App.tsx            # Application entry point
```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Tarek Aeb - [@TarekAeb](https://github.com/TarekAeb)

---

Built with ❤️ for the Youm al-Ilm Celebration, 2025.
