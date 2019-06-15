FourInARowChat

Starten der Anwendung:

Um die Anwendung zu starten, muss Docker auf dem Rechner installiert sein.

Diese Anwendung wurde mit Docker Toolbox, Kitematic und einer Linux Virtual Maschine 
(Oracle VM VirtualBox) auf einem Windows 64-bit Rechner erstellt. Eventuell kann es bei einer anderen Umgebung zu Fehlern kommen.

1)	Ermitteln der IP-Adresse der Docker default maschine 
	z.B. localhost bei Docker Desktop oder 192.168.99.100 bei Dockertoolbox
2)	Im File app\views\chat.jade muss die IP-Adresse, unter der der Server gefunden werden kann, richtig angegeben
	werden. Bitte prüfen und ggf. einfügen.
3)	Öffnen der Docker Konsole
4)	Den Pfad des Ordners, in dem die Anwendung gespeichert ist,  in die Konsole kopieren, sodass nun Kommandos auf den Ordner ausgefuehrt werden können
5)	docker-compose build in die Konsole eingeben
6)	docker-compose up in die Konsole eingeben
7)	In der Konsole müsste nun Server running und MongoDB Connected angezeigt werden
8)	Die Anwendung kann im Browser unter localhost:80 gefunden werden 

