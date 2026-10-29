# MagentaLingo

Microsoft 365 lernen mit Tilly – spielerisch und für den Vertrieb.

- 6 Kapitel von Teams bis Lizenzen, je 6 Lektionen und ein Abschlusstest
- Level Silber, Gold und Magenta
- Fehlertraining, Tagesziel, Serien und Erfolge
- **Wissen: Das digitale Büro** – begehbares 3D-Büro: Mit Tilly durch Empfang, Flur und acht Räume laufen. Jedes Tool steht als Möbel, Gerät oder Kollege im Raum (z. B. der Pförtner mit Checkliste für Conditional Access) und erklärt sich per Klick, einfach und mit Lizenzangabe. Am Ende des Flurs liegt der **Sales Room**: Dort lernt man, Microsoft-Deals mit BANT (Budget, Authority, Need, Timeline) zu qualifizieren, mit Gesprächsfragen, Warnzeichen, Beispiel-Deal und BANT-Quiz. Dazu eine Listenansicht und ein Lizenz-Spickzettel
- Spielstand bleibt im Browser; Sicherung als Datei unter „Erfolge“
- Läuft auch offline und lässt sich als App installieren (über GitHub Pages)

Am besten über GitHub Pages aufrufen. Beim direkten Öffnen von `index.html` läuft alles bis auf den 3D-Rundgang, dort erscheint dann die Listenansicht.

**Steuerung im 3D-Büro:** Auf den Boden tippen zum Laufen, leuchtende Punkte öffnen die Tool-Karten, unten direkt in einen Raum springen. Ziehen dreht die Ansicht, Mausrad oder +/− zoomt. Am Rechner gehen auch WASD bzw. Pfeiltasten und Q/E zum Drehen.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | App, Design und Logik |
| `content.js` | Alle Fragen, Hinweise von Tilly und der Lernbereich mit Lizenzangaben |
| `fonts/`, `icons/` | Schriften und Icons, lokal ausgeliefert (keine Anfragen an Google) |
| `office3d.js` | Das 3D-Büro: Räume, Objekte je Tool, Steuerung |
| `vendor/three/` | Three.js 0.170 (MIT-Lizenz), lokal ausgeliefert |
| `sw.js`, `manifest.webmanifest` | Offline-Nutzung und Installation als App |
| `tools/check-content.js` | Prüft die Inhalte |

## Inhalte ändern

1. Fragen und Texte in `content.js` bearbeiten.
2. Prüfen:
   ```bash
   node tools/check-content.js
   ```
   Der Check meldet Fehler im Aufbau und schlägt Alarm, wenn sich Antworten erraten lassen: wenn die richtige Antwort zu oft die längste oder kürzeste ist oder wenn „Stimmt“ und „Stimmt nicht“ nicht ungefähr gleich oft richtig sind. Er läuft auch automatisch bei jedem Push.
3. In `index.html` die `APP_V` und in `sw.js` die `VERSION` erhöhen, damit Browser und installierte Apps sicher die neuen Dateien holen.
4. Bei Lizenzänderungen das Prüfdatum anpassen (`checked` je Kapitel und `LEARN.checked`).
