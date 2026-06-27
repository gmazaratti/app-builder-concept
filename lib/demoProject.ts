import type { Project, GeneratedApp } from "./types";
import { INTRO_MESSAGE } from "./constants";

// A fully pre-loaded sample project so the builder demonstrates itself with no
// API key required: a real chat conversation + generated app + browsable files.

const DEMO_SUMMARY =
  "Pause is a calm meditation app. The home screen highlights your current daily streak and a scrollable library of guided sessions, each tappable to start. I scaffolded a clean Expo structure with a HomeScreen, a reusable SessionCard, and a sessions data file.";

function demoApp(): GeneratedApp {
  return {
    summary: DEMO_SUMMARY,
    files: [
      {
        path: "package.json",
        contents: `{
  "name": "pause",
  "version": "1.0.0",
  "main": "App.tsx",
  "scripts": { "start": "expo start" },
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0"
  }
}
`,
      },
      {
        path: "app.json",
        contents: `{
  "expo": {
    "name": "Pause",
    "slug": "pause",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light"
  }
}
`,
      },
      {
        path: "App.tsx",
        contents: `import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff" },
});
`,
      },
      {
        path: "screens/HomeScreen.tsx",
        contents: `import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import SessionCard from "../components/SessionCard";
import { SESSIONS } from "../data/sessions";

export default function HomeScreen() {
  const [streak] = useState(7);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.kicker}>TODAY</Text>
      <Text style={styles.title}>Pause</Text>

      <View style={styles.streak}>
        <Text style={styles.streakNum}>{streak}</Text>
        <Text style={styles.streakLabel}>day streak</Text>
      </View>

      <Text style={styles.section}>Library</Text>
      {SESSIONS.map((s) => (
        <SessionCard key={s.id} session={s} onPress={() => {}} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  kicker: { fontSize: 12, fontWeight: "600", letterSpacing: 1, color: "#9aa0a6" },
  title: { fontSize: 30, fontWeight: "800", color: "#0b0b0c", marginTop: 2 },
  streak: { marginTop: 16, padding: 20, borderRadius: 20, backgroundColor: "#0b0b0c" },
  streakNum: { fontSize: 40, fontWeight: "800", color: "#ffffff" },
  streakLabel: { fontSize: 13, color: "#ffffff", opacity: 0.7 },
  section: { fontSize: 16, fontWeight: "700", color: "#0b0b0c", marginTop: 24, marginBottom: 12 },
});
`,
      },
      {
        path: "components/SessionCard.tsx",
        contents: `import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Session } from "../data/sessions";

type Props = { session: Session; onPress: () => void };

export default function SessionCard({ session, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.dot} />
      <View style={styles.body}>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.meta}>{session.category} • {session.minutes} min</Text>
      </View>
      <Text style={styles.play}>▶</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 16, backgroundColor: "#f6f6f7", marginBottom: 10 },
  dot: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#0b0b0c" },
  body: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#0b0b0c" },
  meta: { fontSize: 13, color: "#6b6f76", marginTop: 2 },
  play: { fontSize: 16, color: "#0b0b0c" },
});
`,
      },
      {
        path: "data/sessions.ts",
        contents: `export type Session = {
  id: string;
  title: string;
  minutes: number;
  category: string;
};

export const SESSIONS: Session[] = [
  { id: "1", title: "Morning Calm", minutes: 5, category: "Focus" },
  { id: "2", title: "Breathe & Reset", minutes: 8, category: "Stress" },
  { id: "3", title: "Deep Sleep", minutes: 15, category: "Sleep" },
  { id: "4", title: "Walking Meditation", minutes: 10, category: "Move" },
];
`,
      },
    ],
  };
}

/** Build a fresh Demo Project instance (fresh objects, safe to mutate/store). */
export function demoProject(): Project {
  const app = demoApp();
  return {
    id: "demo",
    name: "Demo Project",
    // Fixed timestamp so the seed is deterministic; new projects sort above it.
    createdAt: 1_717_000_000_000,
    app,
    messages: [
      INTRO_MESSAGE,
      {
        role: "user",
        content:
          "Build a meditation app with a daily streak and a library of guided sessions.",
      },
      {
        role: "assistant",
        content: DEMO_SUMMARY,
        generated: app,
      },
    ],
  };
}
